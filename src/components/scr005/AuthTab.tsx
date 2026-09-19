'use client';

import { useEffect, useState } from 'react';
import type { User } from '@supabase/supabase-js';
import { createBrowserDbClient } from '@/lib/supabase/client';

/**
 * Login / Sign-up / Password Reset
 * REQ-FUNC-066
 *
 * All auth operations go through Supabase Auth (createBrowserDbClient) —
 * passwords are never handled or stored by this app's own code, Supabase
 * encrypts them. Email confirmation and password-reset links both land on
 * /auth/callback (API-AUTH-ADULT-VERIFY's technical route), which exchanges
 * the code for a session and redirects back to /account.
 */

type Mode = 'login' | 'signup' | 'forgot-password';

export function AuthTab() {
  const [user, setUser] = useState<User | null | undefined>(undefined);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    // createBrowserClient throws synchronously (not just a rejected promise)
    // when Supabase env vars are empty/unconfigured — a known bootstrap
    // blocker (docs/ARCHITECTURE.md §14). Routing the call through
    // Promise.resolve().then(...) turns that into an ordinary rejection so
    // it's handled the same way as any other failure below, and keeps every
    // setState call deferred into a promise callback rather than directly
    // in the effect body.
    Promise.resolve()
      .then(() => createBrowserDbClient())
      .then((supabase) => {
        if (cancelled) return;

        supabase.auth
          .getUser()
          .then(({ data }) => {
            if (!cancelled) setUser(data.user);
          })
          .catch(() => {
            if (!cancelled) setUser(null);
          });

        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!cancelled) setUser(session?.user ?? null);
        });
        unsubscribe = () => subscription.unsubscribe();
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, []);

  if (user === undefined) {
    return <div className="h-40 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  if (user) {
    return <LoggedInView email={user.email ?? ''} onSignedOut={() => setUser(null)} />;
  }

  return <AuthForms />;
}

function LoggedInView({ email, onSignedOut }: { email: string; onSignedOut: () => void }) {
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleSignOut() {
    setIsSigningOut(true);
    try {
      const supabase = createBrowserDbClient();
      await supabase.auth.signOut();
      onSignedOut();
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <div className="flex flex-col gap-md">
      <p className="text-body-sm text-body">{email} 계정으로 로그인되어 있습니다.</p>
      <button type="button" onClick={handleSignOut} disabled={isSigningOut} className="btn-secondary self-start">
        로그아웃
      </button>
    </div>
  );
}

function AuthForms() {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const supabase = createBrowserDbClient();
      const redirectTo = `${window.location.origin}/auth/callback?next=/account`;

      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
        if (signInError) {
          setError('이메일 또는 비밀번호가 올바르지 않습니다.');
        }
        return;
      }

      if (mode === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectTo },
        });
        if (signUpError) {
          setError('가입에 실패했습니다. 다시 시도해주세요.');
        } else {
          setMessage('가입 확인 이메일을 보냈습니다. 이메일함을 확인해주세요.');
        }
        return;
      }

      // forgot-password
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (resetError) {
        setError('비밀번호 재설정 이메일 전송에 실패했습니다.');
      } else {
        setMessage('비밀번호 재설정 이메일을 보냈습니다.');
      }
    } catch {
      setError('요청을 처리하지 못했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-md">
      <div role="tablist" className="flex gap-xs">
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'login'}
          onClick={() => {
            setMode('login');
            setError(null);
            setMessage(null);
          }}
          className={`tab-pill${mode === 'login' ? ' active' : ''}`}
        >
          로그인
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'signup'}
          onClick={() => {
            setMode('signup');
            setError(null);
            setMessage(null);
          }}
          className={`tab-pill${mode === 'signup' ? ' active' : ''}`}
        >
          가입하기
        </button>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-sm">
        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">이메일</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
          />
        </label>

        {mode !== 'forgot-password' ? (
          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">비밀번호</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            />
          </label>
        ) : null}

        {error ? <p className="text-body-sm font-medium text-danger">{error}</p> : null}
        {message ? <p className="text-body-sm font-medium text-success">{message}</p> : null}

        <button type="submit" disabled={isSubmitting} className="btn-primary self-start">
          {mode === 'login' ? '로그인' : mode === 'signup' ? '가입하기' : '재설정 이메일 보내기'}
        </button>
      </form>

      {mode === 'login' ? (
        <button
          type="button"
          onClick={() => {
            setMode('forgot-password');
            setError(null);
            setMessage(null);
          }}
          className="self-start text-body-sm font-medium text-coral hover:text-coral-active"
        >
          비밀번호를 잊으셨나요?
        </button>
      ) : null}

      {mode === 'forgot-password' ? (
        <button
          type="button"
          onClick={() => {
            setMode('login');
            setError(null);
            setMessage(null);
          }}
          className="self-start text-body-sm font-medium text-coral hover:text-coral-active"
        >
          로그인으로 돌아가기
        </button>
      ) : null}
    </div>
  );
}
