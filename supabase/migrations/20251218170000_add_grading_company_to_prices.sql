-- Add grading_company column to price_history for tracking PSA/BGS/etc prices
alter table public.price_history 
add column grading_company public.grading_company;

-- Recreate current_prices view to include grading_company
drop view if exists public.current_prices;

create view public.current_prices as
select distinct on (item_type, card_id, sealed_product_id, condition, is_graded, grading_company, grade)
  id,
  item_type,
  card_id,
  sealed_product_id,
  price,
  source,
  condition,
  is_graded,
  grading_company,
  grade,
  recorded_at
from public.price_history
order by item_type, card_id, sealed_product_id, condition, is_graded, grading_company, grade, recorded_at desc;

-- Add index for graded price lookups
create index idx_price_history_graded on public.price_history(card_id, grading_company, grade, recorded_at desc) 
where is_graded = true;
