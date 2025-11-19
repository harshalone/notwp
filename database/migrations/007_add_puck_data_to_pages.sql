-- Migration: Add puck_data column to nwp_pages table
-- Description: This adds a JSONB column to store Puck editor data
-- Created: 2025-11-19

-- Add puck_data column to store Puck editor content
ALTER TABLE public.nwp_pages
ADD COLUMN IF NOT EXISTS puck_data JSONB;

-- Create index for puck_data for better query performance
CREATE INDEX IF NOT EXISTS idx_nwp_pages_puck_data ON public.nwp_pages USING gin(puck_data);
