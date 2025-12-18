create type public.grading_company as enum (
  'PSA',
  'CGC',
  'BGS',
  'SGC',
  'ARS',
  'other'
);

create type public.card_condition as enum (
  'mint',
  'near_mint',
  'lightly_played',
  'moderately_played',
  'heavily_played',
  'damaged'
);
