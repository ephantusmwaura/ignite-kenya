-- Quick test to check if the events table has the new columns
-- Run this in Supabase SQL Editor to verify the schema

-- Check if columns exist
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'events' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- If you see max_tickets and tickets_sold in the results, the schema is updated correctly
-- If NOT, run this to add them:

-- ALTER TABLE public.events 
-- ADD COLUMN IF NOT EXISTS max_tickets integer,
-- ADD COLUMN IF NOT EXISTS tickets_sold integer DEFAULT 0;
