-- Free Traveler — USER_PROFILE mate-matching fields
-- REQ-FUNC-029 (동행 프로필 필드)
--
-- Necessary correction found while building CMP-SCR005-PROFILE: its AC
-- requires editing 연령대(age group, required)/성별(gender, optional)/
-- 여행 스타일(travel style, required)/자기소개(bio), but 0001_schema.sql's
-- user_profile had none of these columns. age_group is a free-choice range
-- label (e.g. "20대"), never a birthdate — REQ-FUNC-028's privacy
-- minimization (no exact birthdate stored) is unaffected.

alter table public.user_profile
  add column age_group text,
  add column gender text,
  add column travel_style text,
  add column bio text check (bio is null or char_length(bio) <= 500);
