-- SQL Migration Script for Event Times
-- Run this in your Supabase SQL Editor to fix the "missing end_time column" error

-- 1. Remove old columns if they still exist
ALTER TABLE public.events 
DROP COLUMN IF EXISTS event_time,
DROP COLUMN IF EXISTS max_tickets,
DROP COLUMN IF EXISTS tickets_sold;

-- 2. Add new columns as nullable first
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS start_time TIME,
ADD COLUMN IF NOT EXISTS end_time TIME;

-- 3. Populate existing rows with default values so NOT NULL constraint doesn't fail
UPDATE public.events 
SET start_time = '09:00:00' 
WHERE start_time IS NULL;

UPDATE public.events 
SET end_time = '17:00:00' 
WHERE end_time IS NULL;

-- 4. Set the columns to NOT NULL as required by the schema
ALTER TABLE public.events 
ALTER COLUMN start_time SET NOT NULL,
ALTER COLUMN end_time SET NOT NULL;

-- 5. Notify the schema cache (happens automatically in Supabase but good for luck)
NOTIFY pgrst, 'reload schema';
