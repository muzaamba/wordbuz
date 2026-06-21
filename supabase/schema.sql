/* ==================================================================== */
/* SUPABASE SCHEMA FOR WORDBUZ                                          */
/* ==================================================================== */

/* 1. Create Users Profile Table (linked to auth.users) */
create table if not exists public.users (
  uid uuid references auth.users not null primary key,
  username text not null,
  points integer default 0,
  streak integer default 0,
  total_attempts integer default 0,
  referrals integer default 0,
  daily_entries integer default 0,
  accuracy integer default 0,
  last_active timestamp with time zone default timezone('utc'::text, now()),
  referral_code text unique not null
);

/* 2. Create Puzzles Table */
create table if not exists public.puzzles (
  id text not null primary key,
  type text not null,
  difficulty text not null,
  question text not null,
  answer text[] not null,
  explanation text,
  is_daily boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

/* 3. Enable Row-Level Security (RLS) */
alter table public.users enable row level security;
alter table public.puzzles enable row level security;

/* 4. Set up RLS Policies for Users */
create policy "Allow public read access to users table"
  on public.users for select
  using (true);

create policy "Allow owners to update their own profile"
  on public.users for update
  using (auth.uid() = uid);

create policy "Allow owners to insert their own profile"
  on public.users for insert
  with check (auth.uid() = uid);

/* 5. Set up RLS Policies for Puzzles */
create policy "Allow public read access to puzzles"
  on public.puzzles for select
  using (true);

/* 6. Secure function to increment referrals and points safely (Security Definer) */
create or replace function public.increment_referral(referrer_code_param text)
returns void as $$
begin
  update public.users
  set points = points + 50,
      referrals = referrals + 1
  where referral_code = referrer_code_param;
end;
$$ language plpgsql security definer;

/* Grant execution to API consumers */
grant execute on function public.increment_referral(text) to anon, authenticated, service_role;

/* 7. Seed Initial Puzzles Data */
insert into public.puzzles (id, type, difficulty, question, answer, explanation, is_daily) values
/* Free Play: Fudud (Easy) */
('e1', 'Qiso (Riddle)', 'Fudud', 'Waa maxay waxa leh furayaal laakiin aan quful lahayn?', array['Kiboodhka', 'Keyboard', 'Kiboodh'], 'Kiboodhka (Keyboard) wuxuu leeyahay furayaal laakiin waxba ma qufulo.', false),
('e2', 'Qiso (Riddle)', 'Fudud', 'Waxaan ku hadlaa af la''aan, waxaanna wax ku maqlaa dhego la''aan. Waa maxay?', array['Dhawaaq', 'Echo', 'Shanqadh'], 'Dhawaaqa dib u soo noqda (Echo) ma laha xubno laakiin wuu hadlaa wuuna maqlaa.', false),

/* Free Play: Dhexdhexaad (Medium) */
('m1', 'Xisaab (Sequence)', 'Dhexdhexaad', 'Soo hel lambarka xiga: 2, 6, 12, 20, ?', array['30'], 'Farqiga u dhexeeya lambarada wuxuu kordhayaa 2: +4, +6, +8, markaa kan xiga waa +10 (20 + 10 = 30).', false),
('m2', 'Mantiq (Logic)', 'Dhexdhexaad', 'Nin ayaa eegaya sawir. Wuxuu yiri "Walaalo ma lihi, laakiin ninka sawirka ku jira aabihiis waa aabahay wiilkiisa." Waa kuma qofka sawirka ku jira?', array['Wiilkiisa', 'His son', 'Son'], '"Aabahay wiilkiisa" maadaama uusan walaalo lahayn, waa isaga. Marka "ninkan aabihiis waa aniga", sawirku waa wiilkiisa.', false),

/* Free Play: Adag (Hard) */
('h1', 'Mantiq (Lateral)', 'Adag', 'Noolo ma ihi, laakiin waan koraa; sanbabo ma lihi, laakiin hawo ayaan u baahnahay; af ma lihi, laakiin biyaha ayaa i dila. Waa maxay?', array['Dab', 'Fire'], 'Dabku wuu koraa, oksijiin buu u baahan yahay, biyuhuna way baabiiyaan.', false),
('h2', 'Mantiq (Lateral)', 'Adag', 'Waa maxay waxa isla marka aad magaciisa sheegto baaba''a?', array['Aamusnaan', 'Silence'], 'Marka aad hadasho, aamusnaanta (Silence) way jabtaa.', false),

/* Daily Challenges (Seeded for June 11th and June 12th, 2026) */
('daily-2026-06-11', 'Mantiq (Logic)', 'Dhexdhexaad', 'Waa maxay waxa qoyan marka uu ku qallajinayo?', array['Shukumaan', 'Towel'], 'Shukumaanka (Towel) wuxuu nuugaa biyaha marka aad isku qallajinayso, sidaas ayuuna ku qoyaa.', true),
('daily-2026-06-12', 'Mantiq (Logic)', 'Dhexdhexaad', 'Waa maxay waxa qoyan marka uu ku qallajinayo?', array['Shukumaan', 'Towel'], 'Shukumaanka (Towel) wuxuu nuugaa biyaha marka aad isku qallajinayso, sidaas ayuuna ku qoyaa.', true)

on conflict (id) do update set
  type = excluded.type,
  difficulty = excluded.difficulty,
  question = excluded.question,
  answer = excluded.answer,
  explanation = excluded.explanation,
  is_daily = excluded.is_daily;
