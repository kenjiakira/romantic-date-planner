-- Create selections table
CREATE TABLE IF NOT EXISTS selections (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  feeling TEXT,
  selected_moods TEXT[] DEFAULT '{}',
  custom_ideas TEXT[] DEFAULT '{}',
  selected_locations JSONB NOT NULL DEFAULT '{"saturday": [], "sunday": []}'::jsonb,
  checklist JSONB DEFAULT '{"items": [], "checkedItems": []}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS selections_created_at_idx ON selections(created_at DESC);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc'::text, NOW());
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_selections_updated_at
  BEFORE UPDATE ON selections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE selections ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations on selections"
  ON selections
  FOR ALL
  USING (true)
  WITH CHECK (true);

