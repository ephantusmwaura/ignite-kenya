-- Migration: Add ticket capacity tracking to events table
-- Run this in your Supabase SQL Editor

-- Add max_tickets and tickets_sold columns to events table
ALTER TABLE public.events 
ADD COLUMN IF NOT EXISTS max_tickets integer,
ADD COLUMN IF NOT EXISTS tickets_sold integer DEFAULT 0;

-- Update existing events to have tickets_sold = 0 if NULL
UPDATE public.events 
SET tickets_sold = 0 
WHERE tickets_sold IS NULL;
