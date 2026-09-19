-- Free Traveler — USER_PROFILE public read policy
-- Necessary correction found while building CMP-SCR004-DETAIL: showing a
-- mate post author's nickname + adult-verification badge requires reading
-- ANOTHER user's profile row, but 0002_rls.sql only allowed reading your
-- own row. A nickname is inherently public-facing the moment it authors a
-- publicly-readable mate_post (mate_post_select_all is already `using (true)`),
-- so this closes that gap rather than working around it client-side.
--
-- Added as a new migration (not editing 0002_rls.sql) per standard practice
-- of never rewriting an already-applied migration.

create policy user_profile_select_public
  on public.user_profile for select
  using (true);
