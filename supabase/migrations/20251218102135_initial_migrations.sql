create type "public"."card_condition" as enum ('mint', 'near_mint', 'lightly_played', 'moderately_played', 'heavily_played', 'damaged');

create type "public"."grading_company" as enum ('PSA', 'CGC', 'BGS', 'SGC', 'ARS', 'other');

create type "public"."portfolio_item_type" as enum ('card', 'sealed');

create type "public"."price_source" as enum ('manual', 'ebay', 'tcgplayer', 'community');

create type "public"."sealed_product_type" as enum ('booster_box', 'booster_pack', 'case', 'starter_deck', 'promo', 'collection_box', 'other');


  create table "public"."cards" (
    "id" bigint generated always as identity not null,
    "external_id" text,
    "set_id" bigint,
    "card_number" text not null,
    "name" text not null,
    "rarity" text,
    "card_type" text,
    "color" text,
    "cost" integer,
    "power" integer,
    "counter" integer,
    "attribute" text,
    "effect" text,
    "image_url" text,
    "is_user_submitted" boolean default false,
    "submitted_by" uuid,
    "approved" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."cards" enable row level security;


  create table "public"."grading_population" (
    "id" bigint generated always as identity not null,
    "card_id" bigint,
    "grading_company" public.grading_company not null,
    "grade" numeric(3,1) not null,
    "population" integer not null default 0,
    "population_higher" integer default 0,
    "recorded_at" timestamp with time zone default now(),
    "source" text default 'gemrate'::text
      );


alter table "public"."grading_population" enable row level security;


  create table "public"."population_sync_log" (
    "id" bigint generated always as identity not null,
    "sync_type" text not null,
    "cards_updated" integer default 0,
    "status" text not null,
    "error_message" text,
    "started_at" timestamp with time zone default now(),
    "completed_at" timestamp with time zone
      );



  create table "public"."portfolio_items" (
    "id" bigint generated always as identity not null,
    "user_id" uuid not null,
    "item_type" public.portfolio_item_type not null,
    "card_id" bigint,
    "sealed_product_id" bigint,
    "quantity" integer not null default 1,
    "purchase_price" numeric(10,2),
    "purchase_date" date,
    "condition" public.card_condition,
    "is_graded" boolean default false,
    "grading_company" public.grading_company,
    "grade" numeric(3,1),
    "cert_number" text,
    "is_wishlist" boolean default false,
    "is_for_sale" boolean default false,
    "asking_price" numeric(10,2),
    "notes" text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."portfolio_items" enable row level security;


  create table "public"."price_history" (
    "id" bigint generated always as identity not null,
    "item_type" public.portfolio_item_type not null,
    "card_id" bigint,
    "sealed_product_id" bigint,
    "price" numeric(10,2) not null,
    "source" public.price_source not null default 'manual'::public.price_source,
    "condition" public.card_condition,
    "is_graded" boolean default false,
    "grade" numeric(3,1),
    "recorded_at" timestamp with time zone default now(),
    "recorded_by" uuid
      );


alter table "public"."price_history" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "username" text not null,
    "display_name" text,
    "avatar_url" text,
    "bio" text,
    "is_public" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."sealed_products" (
    "id" bigint generated always as identity not null,
    "name" text not null,
    "set_id" bigint,
    "product_type" public.sealed_product_type not null,
    "description" text,
    "image_url" text,
    "release_date" date,
    "is_user_submitted" boolean default false,
    "submitted_by" uuid,
    "approved" boolean default true,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
      );


alter table "public"."sealed_products" enable row level security;


  create table "public"."sets" (
    "id" bigint generated always as identity not null,
    "code" text not null,
    "name" text not null,
    "release_date" date,
    "total_cards" integer,
    "image_url" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."sets" enable row level security;

CREATE UNIQUE INDEX cards_external_id_key ON public.cards USING btree (external_id);

CREATE UNIQUE INDEX cards_pkey ON public.cards USING btree (id);

CREATE UNIQUE INDEX cards_set_id_card_number_key ON public.cards USING btree (set_id, card_number);

CREATE UNIQUE INDEX grading_population_card_id_grading_company_grade_key ON public.grading_population USING btree (card_id, grading_company, grade);

CREATE UNIQUE INDEX grading_population_pkey ON public.grading_population USING btree (id);

CREATE INDEX idx_cards_name ON public.cards USING gin (to_tsvector('english'::regconfig, name));

CREATE INDEX idx_cards_rarity ON public.cards USING btree (rarity);

CREATE INDEX idx_cards_set_id ON public.cards USING btree (set_id);

CREATE INDEX idx_population_card_id ON public.grading_population USING btree (card_id);

CREATE INDEX idx_population_company ON public.grading_population USING btree (grading_company);

CREATE INDEX idx_population_grade ON public.grading_population USING btree (grade);

CREATE INDEX idx_portfolio_card_id ON public.portfolio_items USING btree (card_id);

CREATE INDEX idx_portfolio_for_sale ON public.portfolio_items USING btree (is_for_sale) WHERE (is_for_sale = true);

CREATE INDEX idx_portfolio_sealed_id ON public.portfolio_items USING btree (sealed_product_id);

CREATE INDEX idx_portfolio_user_id ON public.portfolio_items USING btree (user_id);

CREATE INDEX idx_portfolio_wishlist ON public.portfolio_items USING btree (user_id, is_wishlist) WHERE (is_wishlist = true);

CREATE INDEX idx_price_history_card ON public.price_history USING btree (card_id, recorded_at DESC);

CREATE INDEX idx_price_history_date ON public.price_history USING btree (recorded_at DESC);

CREATE INDEX idx_price_history_sealed ON public.price_history USING btree (sealed_product_id, recorded_at DESC);

CREATE UNIQUE INDEX population_sync_log_pkey ON public.population_sync_log USING btree (id);

CREATE UNIQUE INDEX portfolio_items_pkey ON public.portfolio_items USING btree (id);

CREATE UNIQUE INDEX price_history_pkey ON public.price_history USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX profiles_username_key ON public.profiles USING btree (username);

CREATE UNIQUE INDEX sealed_products_pkey ON public.sealed_products USING btree (id);

CREATE UNIQUE INDEX sets_code_key ON public.sets USING btree (code);

CREATE UNIQUE INDEX sets_pkey ON public.sets USING btree (id);

alter table "public"."cards" add constraint "cards_pkey" PRIMARY KEY using index "cards_pkey";

alter table "public"."grading_population" add constraint "grading_population_pkey" PRIMARY KEY using index "grading_population_pkey";

alter table "public"."population_sync_log" add constraint "population_sync_log_pkey" PRIMARY KEY using index "population_sync_log_pkey";

alter table "public"."portfolio_items" add constraint "portfolio_items_pkey" PRIMARY KEY using index "portfolio_items_pkey";

alter table "public"."price_history" add constraint "price_history_pkey" PRIMARY KEY using index "price_history_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."sealed_products" add constraint "sealed_products_pkey" PRIMARY KEY using index "sealed_products_pkey";

alter table "public"."sets" add constraint "sets_pkey" PRIMARY KEY using index "sets_pkey";

alter table "public"."cards" add constraint "cards_external_id_key" UNIQUE using index "cards_external_id_key";

alter table "public"."cards" add constraint "cards_set_id_card_number_key" UNIQUE using index "cards_set_id_card_number_key";

alter table "public"."cards" add constraint "cards_set_id_fkey" FOREIGN KEY (set_id) REFERENCES public.sets(id) not valid;

alter table "public"."cards" validate constraint "cards_set_id_fkey";

alter table "public"."cards" add constraint "cards_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) not valid;

alter table "public"."cards" validate constraint "cards_submitted_by_fkey";

alter table "public"."grading_population" add constraint "grading_population_card_id_fkey" FOREIGN KEY (card_id) REFERENCES public.cards(id) ON DELETE CASCADE not valid;

alter table "public"."grading_population" validate constraint "grading_population_card_id_fkey";

alter table "public"."grading_population" add constraint "grading_population_card_id_grading_company_grade_key" UNIQUE using index "grading_population_card_id_grading_company_grade_key";

alter table "public"."portfolio_items" add constraint "grading_only_for_cards" CHECK (((is_graded = false) OR (item_type = 'card'::public.portfolio_item_type))) not valid;

alter table "public"."portfolio_items" validate constraint "grading_only_for_cards";

alter table "public"."portfolio_items" add constraint "portfolio_items_card_id_fkey" FOREIGN KEY (card_id) REFERENCES public.cards(id) not valid;

alter table "public"."portfolio_items" validate constraint "portfolio_items_card_id_fkey";

alter table "public"."portfolio_items" add constraint "portfolio_items_sealed_product_id_fkey" FOREIGN KEY (sealed_product_id) REFERENCES public.sealed_products(id) not valid;

alter table "public"."portfolio_items" validate constraint "portfolio_items_sealed_product_id_fkey";

alter table "public"."portfolio_items" add constraint "portfolio_items_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE not valid;

alter table "public"."portfolio_items" validate constraint "portfolio_items_user_id_fkey";

alter table "public"."portfolio_items" add constraint "valid_item_reference" CHECK ((((item_type = 'card'::public.portfolio_item_type) AND (card_id IS NOT NULL) AND (sealed_product_id IS NULL)) OR ((item_type = 'sealed'::public.portfolio_item_type) AND (sealed_product_id IS NOT NULL) AND (card_id IS NULL)))) not valid;

alter table "public"."portfolio_items" validate constraint "valid_item_reference";

alter table "public"."price_history" add constraint "price_history_card_id_fkey" FOREIGN KEY (card_id) REFERENCES public.cards(id) not valid;

alter table "public"."price_history" validate constraint "price_history_card_id_fkey";

alter table "public"."price_history" add constraint "price_history_recorded_by_fkey" FOREIGN KEY (recorded_by) REFERENCES public.profiles(id) not valid;

alter table "public"."price_history" validate constraint "price_history_recorded_by_fkey";

alter table "public"."price_history" add constraint "price_history_sealed_product_id_fkey" FOREIGN KEY (sealed_product_id) REFERENCES public.sealed_products(id) not valid;

alter table "public"."price_history" validate constraint "price_history_sealed_product_id_fkey";

alter table "public"."price_history" add constraint "valid_price_item" CHECK ((((item_type = 'card'::public.portfolio_item_type) AND (card_id IS NOT NULL) AND (sealed_product_id IS NULL)) OR ((item_type = 'sealed'::public.portfolio_item_type) AND (sealed_product_id IS NOT NULL) AND (card_id IS NULL)))) not valid;

alter table "public"."price_history" validate constraint "valid_price_item";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_username_key" UNIQUE using index "profiles_username_key";

alter table "public"."sealed_products" add constraint "sealed_products_set_id_fkey" FOREIGN KEY (set_id) REFERENCES public.sets(id) not valid;

alter table "public"."sealed_products" validate constraint "sealed_products_set_id_fkey";

alter table "public"."sealed_products" add constraint "sealed_products_submitted_by_fkey" FOREIGN KEY (submitted_by) REFERENCES public.profiles(id) not valid;

alter table "public"."sealed_products" validate constraint "sealed_products_submitted_by_fkey";

alter table "public"."sets" add constraint "sets_code_key" UNIQUE using index "sets_code_key";

set check_function_bodies = off;

create or replace view "public"."current_prices" as  SELECT DISTINCT ON (item_type, card_id, sealed_product_id, condition, is_graded, grade) id,
    item_type,
    card_id,
    sealed_product_id,
    price,
    source,
    condition,
    is_graded,
    grade,
    recorded_at
   FROM public.price_history
  ORDER BY item_type, card_id, sealed_product_id, condition, is_graded, grade, recorded_at DESC;


CREATE OR REPLACE FUNCTION public.get_card_population(p_card_id bigint)
 RETURNS TABLE(grading_company public.grading_company, grade numeric, population integer, population_higher integer, recorded_at timestamp with time zone)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select
    gp.grading_company,
    gp.grade,
    gp.population,
    gp.population_higher,
    gp.recorded_at
  from public.grading_population gp
  where gp.card_id = p_card_id
  order by gp.grading_company, gp.grade desc;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_portfolio_value(p_user_id uuid)
 RETURNS TABLE(total_value numeric, total_cost numeric, total_gain_loss numeric, item_count bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select
    coalesce(sum(
      case
        when pi.is_graded then
          (select cp.price from public.current_prices cp
           where cp.card_id = pi.card_id
           and cp.is_graded = true
           and cp.grade = pi.grade
           limit 1)
        else
          (select cp.price from public.current_prices cp
           where (cp.card_id = pi.card_id or cp.sealed_product_id = pi.sealed_product_id)
           and cp.condition = pi.condition
           limit 1)
      end * pi.quantity
    ), 0) as total_value,
    coalesce(sum(pi.purchase_price * pi.quantity), 0) as total_cost,
    coalesce(sum(
      case
        when pi.is_graded then
          (select cp.price from public.current_prices cp
           where cp.card_id = pi.card_id
           and cp.is_graded = true
           and cp.grade = pi.grade
           limit 1)
        else
          (select cp.price from public.current_prices cp
           where (cp.card_id = pi.card_id or cp.sealed_product_id = pi.sealed_product_id)
           and cp.condition = pi.condition
           limit 1)
      end * pi.quantity
    ), 0) - coalesce(sum(pi.purchase_price * pi.quantity), 0) as total_gain_loss,
    count(*) as item_count
  from public.portfolio_items pi
  where pi.user_id = p_user_id
  and pi.is_wishlist = false;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_set_completion(p_user_id uuid, p_set_id bigint)
 RETURNS TABLE(total_cards bigint, owned_cards bigint, completion_percentage numeric)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select
    (select count(*) from public.cards where public.cards.set_id = p_set_id) as total_cards,
    count(distinct pi.card_id) as owned_cards,
    round(
      count(distinct pi.card_id)::numeric /
      nullif((select count(*) from public.cards where public.cards.set_id = p_set_id), 0) * 100,
      2
    ) as completion_percentage
  from public.portfolio_items pi
  join public.cards c on c.id = pi.card_id
  where pi.user_id = p_user_id
  and c.set_id = p_set_id
  and pi.is_wishlist = false;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.get_total_population(p_card_id bigint)
 RETURNS TABLE(grading_company public.grading_company, total_graded bigint, gem_mint_count bigint, mint_count bigint)
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select
    gp.grading_company,
    sum(gp.population)::bigint as total_graded,
    sum(case when gp.grade = 10 then gp.population else 0 end)::bigint as gem_mint_count,
    sum(case when gp.grade >= 9 then gp.population else 0 end)::bigint as mint_count
  from public.grading_population gp
  where gp.card_id = p_card_id
  group by gp.grading_company
  order by gp.grading_company;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
begin
  insert into public.profiles (id, username, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)),
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_updated_at()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  new.updated_at = now();
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.search_cards(search_query text)
 RETURNS SETOF public.cards
 LANGUAGE plpgsql
 SET search_path TO ''
AS $function$
begin
  return query
  select *
  from public.cards
  where
    public.cards.approved = true
    and (
      public.cards.name ilike '%' || search_query || '%'
      or public.cards.card_number ilike '%' || search_query || '%'
      or to_tsvector('english', public.cards.name) @@ plainto_tsquery('english', search_query)
    )
  order by public.cards.name
  limit 50;
end;
$function$
;

grant delete on table "public"."cards" to "anon";

grant insert on table "public"."cards" to "anon";

grant references on table "public"."cards" to "anon";

grant select on table "public"."cards" to "anon";

grant trigger on table "public"."cards" to "anon";

grant truncate on table "public"."cards" to "anon";

grant update on table "public"."cards" to "anon";

grant delete on table "public"."cards" to "authenticated";

grant insert on table "public"."cards" to "authenticated";

grant references on table "public"."cards" to "authenticated";

grant select on table "public"."cards" to "authenticated";

grant trigger on table "public"."cards" to "authenticated";

grant truncate on table "public"."cards" to "authenticated";

grant update on table "public"."cards" to "authenticated";

grant delete on table "public"."cards" to "service_role";

grant insert on table "public"."cards" to "service_role";

grant references on table "public"."cards" to "service_role";

grant select on table "public"."cards" to "service_role";

grant trigger on table "public"."cards" to "service_role";

grant truncate on table "public"."cards" to "service_role";

grant update on table "public"."cards" to "service_role";

grant delete on table "public"."grading_population" to "anon";

grant insert on table "public"."grading_population" to "anon";

grant references on table "public"."grading_population" to "anon";

grant select on table "public"."grading_population" to "anon";

grant trigger on table "public"."grading_population" to "anon";

grant truncate on table "public"."grading_population" to "anon";

grant update on table "public"."grading_population" to "anon";

grant delete on table "public"."grading_population" to "authenticated";

grant insert on table "public"."grading_population" to "authenticated";

grant references on table "public"."grading_population" to "authenticated";

grant select on table "public"."grading_population" to "authenticated";

grant trigger on table "public"."grading_population" to "authenticated";

grant truncate on table "public"."grading_population" to "authenticated";

grant update on table "public"."grading_population" to "authenticated";

grant delete on table "public"."grading_population" to "service_role";

grant insert on table "public"."grading_population" to "service_role";

grant references on table "public"."grading_population" to "service_role";

grant select on table "public"."grading_population" to "service_role";

grant trigger on table "public"."grading_population" to "service_role";

grant truncate on table "public"."grading_population" to "service_role";

grant update on table "public"."grading_population" to "service_role";

grant delete on table "public"."population_sync_log" to "anon";

grant insert on table "public"."population_sync_log" to "anon";

grant references on table "public"."population_sync_log" to "anon";

grant select on table "public"."population_sync_log" to "anon";

grant trigger on table "public"."population_sync_log" to "anon";

grant truncate on table "public"."population_sync_log" to "anon";

grant update on table "public"."population_sync_log" to "anon";

grant delete on table "public"."population_sync_log" to "authenticated";

grant insert on table "public"."population_sync_log" to "authenticated";

grant references on table "public"."population_sync_log" to "authenticated";

grant select on table "public"."population_sync_log" to "authenticated";

grant trigger on table "public"."population_sync_log" to "authenticated";

grant truncate on table "public"."population_sync_log" to "authenticated";

grant update on table "public"."population_sync_log" to "authenticated";

grant delete on table "public"."population_sync_log" to "service_role";

grant insert on table "public"."population_sync_log" to "service_role";

grant references on table "public"."population_sync_log" to "service_role";

grant select on table "public"."population_sync_log" to "service_role";

grant trigger on table "public"."population_sync_log" to "service_role";

grant truncate on table "public"."population_sync_log" to "service_role";

grant update on table "public"."population_sync_log" to "service_role";

grant delete on table "public"."portfolio_items" to "anon";

grant insert on table "public"."portfolio_items" to "anon";

grant references on table "public"."portfolio_items" to "anon";

grant select on table "public"."portfolio_items" to "anon";

grant trigger on table "public"."portfolio_items" to "anon";

grant truncate on table "public"."portfolio_items" to "anon";

grant update on table "public"."portfolio_items" to "anon";

grant delete on table "public"."portfolio_items" to "authenticated";

grant insert on table "public"."portfolio_items" to "authenticated";

grant references on table "public"."portfolio_items" to "authenticated";

grant select on table "public"."portfolio_items" to "authenticated";

grant trigger on table "public"."portfolio_items" to "authenticated";

grant truncate on table "public"."portfolio_items" to "authenticated";

grant update on table "public"."portfolio_items" to "authenticated";

grant delete on table "public"."portfolio_items" to "service_role";

grant insert on table "public"."portfolio_items" to "service_role";

grant references on table "public"."portfolio_items" to "service_role";

grant select on table "public"."portfolio_items" to "service_role";

grant trigger on table "public"."portfolio_items" to "service_role";

grant truncate on table "public"."portfolio_items" to "service_role";

grant update on table "public"."portfolio_items" to "service_role";

grant delete on table "public"."price_history" to "anon";

grant insert on table "public"."price_history" to "anon";

grant references on table "public"."price_history" to "anon";

grant select on table "public"."price_history" to "anon";

grant trigger on table "public"."price_history" to "anon";

grant truncate on table "public"."price_history" to "anon";

grant update on table "public"."price_history" to "anon";

grant delete on table "public"."price_history" to "authenticated";

grant insert on table "public"."price_history" to "authenticated";

grant references on table "public"."price_history" to "authenticated";

grant select on table "public"."price_history" to "authenticated";

grant trigger on table "public"."price_history" to "authenticated";

grant truncate on table "public"."price_history" to "authenticated";

grant update on table "public"."price_history" to "authenticated";

grant delete on table "public"."price_history" to "service_role";

grant insert on table "public"."price_history" to "service_role";

grant references on table "public"."price_history" to "service_role";

grant select on table "public"."price_history" to "service_role";

grant trigger on table "public"."price_history" to "service_role";

grant truncate on table "public"."price_history" to "service_role";

grant update on table "public"."price_history" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."sealed_products" to "anon";

grant insert on table "public"."sealed_products" to "anon";

grant references on table "public"."sealed_products" to "anon";

grant select on table "public"."sealed_products" to "anon";

grant trigger on table "public"."sealed_products" to "anon";

grant truncate on table "public"."sealed_products" to "anon";

grant update on table "public"."sealed_products" to "anon";

grant delete on table "public"."sealed_products" to "authenticated";

grant insert on table "public"."sealed_products" to "authenticated";

grant references on table "public"."sealed_products" to "authenticated";

grant select on table "public"."sealed_products" to "authenticated";

grant trigger on table "public"."sealed_products" to "authenticated";

grant truncate on table "public"."sealed_products" to "authenticated";

grant update on table "public"."sealed_products" to "authenticated";

grant delete on table "public"."sealed_products" to "service_role";

grant insert on table "public"."sealed_products" to "service_role";

grant references on table "public"."sealed_products" to "service_role";

grant select on table "public"."sealed_products" to "service_role";

grant trigger on table "public"."sealed_products" to "service_role";

grant truncate on table "public"."sealed_products" to "service_role";

grant update on table "public"."sealed_products" to "service_role";

grant delete on table "public"."sets" to "anon";

grant insert on table "public"."sets" to "anon";

grant references on table "public"."sets" to "anon";

grant select on table "public"."sets" to "anon";

grant trigger on table "public"."sets" to "anon";

grant truncate on table "public"."sets" to "anon";

grant update on table "public"."sets" to "anon";

grant delete on table "public"."sets" to "authenticated";

grant insert on table "public"."sets" to "authenticated";

grant references on table "public"."sets" to "authenticated";

grant select on table "public"."sets" to "authenticated";

grant trigger on table "public"."sets" to "authenticated";

grant truncate on table "public"."sets" to "authenticated";

grant update on table "public"."sets" to "authenticated";

grant delete on table "public"."sets" to "service_role";

grant insert on table "public"."sets" to "service_role";

grant references on table "public"."sets" to "service_role";

grant select on table "public"."sets" to "service_role";

grant trigger on table "public"."sets" to "service_role";

grant truncate on table "public"."sets" to "service_role";

grant update on table "public"."sets" to "service_role";


  create policy "Cards are viewable by everyone"
  on "public"."cards"
  as permissive
  for select
  to authenticated, anon
using ((approved = true));



  create policy "Users can submit cards"
  on "public"."cards"
  as permissive
  for insert
  to authenticated
with check (((is_user_submitted = true) AND (submitted_by = ( SELECT auth.uid() AS uid)) AND (approved = false)));



  create policy "Only service role can modify population"
  on "public"."grading_population"
  as permissive
  for all
  to service_role
using (true);



  create policy "Population data is viewable by everyone"
  on "public"."grading_population"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Sync logs viewable by authenticated"
  on "public"."population_sync_log"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Public portfolios are viewable"
  on "public"."portfolio_items"
  as permissive
  for select
  to authenticated, anon
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = portfolio_items.user_id) AND (profiles.is_public = true)))));



  create policy "Users can delete own portfolio items"
  on "public"."portfolio_items"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can insert own portfolio items"
  on "public"."portfolio_items"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update own portfolio items"
  on "public"."portfolio_items"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view own portfolio"
  on "public"."portfolio_items"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Authenticated users can add prices"
  on "public"."price_history"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = recorded_by));



  create policy "Price history is viewable by everyone"
  on "public"."price_history"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Profiles are viewable by everyone"
  on "public"."profiles"
  as permissive
  for select
  to authenticated, anon
using (true);



  create policy "Users can insert own profile"
  on "public"."profiles"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Users can update own profile"
  on "public"."profiles"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));



  create policy "Sealed products are viewable by everyone"
  on "public"."sealed_products"
  as permissive
  for select
  to authenticated, anon
using ((approved = true));



  create policy "Sets are viewable by everyone"
  on "public"."sets"
  as permissive
  for select
  to authenticated, anon
using (true);


CREATE TRIGGER on_card_updated BEFORE UPDATE ON public.cards FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_portfolio_item_updated BEFORE UPDATE ON public.portfolio_items FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_profile_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_sealed_product_updated BEFORE UPDATE ON public.sealed_products FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


