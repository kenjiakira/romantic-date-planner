    -- Add plan_day column to selections table
    -- plan_day can be: 'saturday', 'sunday', or 'both'
    ALTER TABLE selections 
    ADD COLUMN IF NOT EXISTS plan_day TEXT;

    -- Update existing records based on selected_locations
    UPDATE selections
    SET plan_day = CASE
    WHEN selected_locations->'saturday' IS NOT NULL 
        AND jsonb_array_length(selected_locations->'saturday') > 0
        AND selected_locations->'sunday' IS NOT NULL 
        AND jsonb_array_length(selected_locations->'sunday') > 0
    THEN 'both'
    WHEN selected_locations->'saturday' IS NOT NULL 
        AND jsonb_array_length(selected_locations->'saturday') > 0
    THEN 'saturday'
    WHEN selected_locations->'sunday' IS NOT NULL 
        AND jsonb_array_length(selected_locations->'sunday') > 0
    THEN 'sunday'
    ELSE NULL
    END;

    -- Create index for plan_day to improve query performance
    CREATE INDEX IF NOT EXISTS selections_plan_day_idx ON selections(plan_day);

    -- Add constraint to ensure plan_day is one of the valid values
    ALTER TABLE selections
    ADD CONSTRAINT check_plan_day 
    CHECK (plan_day IS NULL OR plan_day IN ('saturday', 'sunday', 'both'));

