-- Add selected_cuisines column to selections table
ALTER TABLE selections 
ADD COLUMN IF NOT EXISTS selected_cuisines TEXT[] DEFAULT '{}';

