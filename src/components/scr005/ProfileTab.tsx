'use client';

import { useEffect, useState } from 'react';
import { createBrowserDbClient } from '@/lib/supabase/client';

/**
 * Profile + Adult Verification
 * REQ-FUNC-028,029
 *
 * Nickname/age-group/travel-style are required, gender/bio optional.
 * Only `is_adult` (boolean) + `adult_verified_at` (timestamp) are ever
 * stored for verification — never a birthdate (0004_user_profile_mate_fields.sql
 * deliberately has no birthdate column). Adult verification here is a
 * self-attestation checkbox, consistent with this project's established
 * scope (no external KYC provider exists anywhere in this codebase).
 */

const AGE_GROUPS = ['10대', '20대', '30대', '40대', '50대', '60대 이상'];
const GENDERS = ['남성', '여성', '밝히지 않음'];

interface Profile {
  nickname: string;
  age_group: string | null;
  gender: string | null;
  travel_style: string | null;
  bio: string | null;
  is_adult: boolean;
  adult_verified_at: string | null;
}

export function ProfileTab() {
  const [userId, setUserId] = useState<string | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const supabase = createBrowserDbClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          if (!cancelled) setError('로그인이 필요합니다.');
          return;
        }

        const { data, error: fetchError } = await supabase
          .from('user_profile')
          .select('nickname, age_group, gender, travel_style, bio, is_adult, adult_verified_at')
          .eq('id', user.id)
          .single();

        if (cancelled) return;
        if (fetchError || !data) {
          setError('프로필을 불러오지 못했습니다.');
          return;
        }
        setUserId(user.id);
        setProfile(data);
      } catch {
        if (!cancelled) setError('프로필을 불러오지 못했습니다.');
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="text-body-sm font-medium text-danger">{error}</p>;
  }

  if (!profile || !userId) {
    return <div className="h-64 animate-pulse rounded-md bg-surface-soft" aria-hidden="true" />;
  }

  return <ProfileForm userId={userId} initialProfile={profile} />;
}

function ProfileForm({ userId, initialProfile }: { userId: string; initialProfile: Profile }) {
  const [nickname, setNickname] = useState(initialProfile.nickname);
  const [ageGroup, setAgeGroup] = useState(initialProfile.age_group ?? '');
  const [gender, setGender] = useState(initialProfile.gender ?? '');
  const [travelStyle, setTravelStyle] = useState(initialProfile.travel_style ?? '');
  const [bio, setBio] = useState(initialProfile.bio ?? '');
  const [isAdult, setIsAdult] = useState(initialProfile.is_adult);
  const [adultVerifiedAt, setAdultVerifiedAt] = useState(initialProfile.adult_verified_at);
  const [confirmAdultChecked, setConfirmAdultChecked] = useState(false);

  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);

  const canSave = Boolean(nickname.trim() && ageGroup && travelStyle.trim());

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setSaveMessage(null);
    setSaveError(null);
    setIsSaving(true);
    try {
      const supabase = createBrowserDbClient();
      const { error } = await supabase
        .from('user_profile')
        .update({
          nickname: nickname.trim(),
          age_group: ageGroup,
          gender: gender || null,
          travel_style: travelStyle.trim(),
          bio: bio.trim() || null,
        })
        .eq('id', userId);

      if (error) {
        setSaveError('저장에 실패했습니다. 다시 시도해주세요.');
      } else {
        setSaveMessage('프로필이 저장되었습니다.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleVerifyAdult() {
    try {
      const supabase = createBrowserDbClient();
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('user_profile')
        .update({ is_adult: true, adult_verified_at: now })
        .eq('id', userId);

      if (!error) {
        setIsAdult(true);
        setAdultVerifiedAt(now);
      }
    } catch {
      // Leave the checkbox/button as-is; the user can retry the click.
    }
  }

  return (
    <div className="flex flex-col gap-lg">
      <div className="rounded-md bg-surface-soft px-md py-md">
        {isAdult ? (
          <div className="flex items-center gap-sm">
            <span className="rounded-full bg-success/10 px-sm py-xxs text-caption font-medium text-success">
              성인 인증 완료
            </span>
            {adultVerifiedAt ? (
              <span className="text-caption text-muted">{new Date(adultVerifiedAt).toLocaleString('ko-KR')}</span>
            ) : null}
          </div>
        ) : (
          <div className="flex flex-col gap-sm">
            <label className="flex items-start gap-sm">
              <input
                type="checkbox"
                checked={confirmAdultChecked}
                onChange={(e) => setConfirmAdultChecked(e.target.checked)}
                className="mt-xxs h-5 w-5"
              />
              <span className="text-body-sm text-body">만 19세 이상입니다.</span>
            </label>
            <button
              type="button"
              onClick={handleVerifyAdult}
              disabled={!confirmAdultChecked}
              className="btn-primary self-start"
            >
              성인 인증하기
            </button>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-md">
        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">닉네임</span>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
            maxLength={50}
            className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
          />
        </label>

        <div className="grid grid-cols-1 gap-md sm:grid-cols-2">
          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">연령대</span>
            <select
              value={ageGroup}
              onChange={(e) => setAgeGroup(e.target.value)}
              required
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            >
              <option value="">선택</option>
              {AGE_GROUPS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-xs">
            <span className="text-body-sm font-medium text-ink">성별 (선택)</span>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
            >
              <option value="">선택 안 함</option>
              {GENDERS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">여행 스타일</span>
          <input
            type="text"
            value={travelStyle}
            onChange={(e) => setTravelStyle(e.target.value)}
            required
            maxLength={200}
            placeholder="예: 맛집 탐방, 느긋한 일정"
            className="h-14 rounded-sm border border-border-strong bg-canvas px-md text-body-md text-ink"
          />
        </label>

        <label className="flex flex-col gap-xs">
          <span className="text-body-sm font-medium text-ink">자기소개 (선택)</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value.slice(0, 500))}
            rows={4}
            maxLength={500}
            className="rounded-sm border border-border-strong bg-canvas px-md py-sm text-body-md text-ink"
          />
        </label>

        {saveError ? <p className="text-body-sm font-medium text-danger">{saveError}</p> : null}
        {saveMessage ? <p className="text-body-sm font-medium text-success">{saveMessage}</p> : null}

        <button type="submit" disabled={!canSave || isSaving} className="btn-primary self-start">
          저장하기
        </button>
      </form>
    </div>
  );
}
