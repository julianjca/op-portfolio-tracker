create policy "Profiles are viewable by everyone"
  on public.profiles
  for select
  to authenticated, anon
  using (true);

create policy "Users can update own profile"
  on public.profiles
  for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  to authenticated
  with check ((select auth.uid()) = id);

create policy "Sets are viewable by everyone"
  on public.sets
  for select
  to authenticated, anon
  using (true);

create policy "Cards are viewable by everyone"
  on public.cards
  for select
  to authenticated, anon
  using (approved = true);

create policy "Users can submit cards"
  on public.cards
  for insert
  to authenticated
  with check (
    is_user_submitted = true
    and submitted_by = (select auth.uid())
    and approved = false
  );

create policy "Sealed products are viewable by everyone"
  on public.sealed_products
  for select
  to authenticated, anon
  using (approved = true);

create policy "Users can view own portfolio"
  on public.portfolio_items
  for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Users can insert own portfolio items"
  on public.portfolio_items
  for insert
  to authenticated
  with check ((select auth.uid()) = user_id);

create policy "Users can update own portfolio items"
  on public.portfolio_items
  for update
  to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

create policy "Users can delete own portfolio items"
  on public.portfolio_items
  for delete
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "Public portfolios are viewable"
  on public.portfolio_items
  for select
  to authenticated, anon
  using (
    exists (
      select 1 from public.profiles
      where public.profiles.id = public.portfolio_items.user_id
      and public.profiles.is_public = true
    )
  );

create policy "Price history is viewable by everyone"
  on public.price_history
  for select
  to authenticated, anon
  using (true);

create policy "Authenticated users can add prices"
  on public.price_history
  for insert
  to authenticated
  with check ((select auth.uid()) = recorded_by);
