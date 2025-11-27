-- Create navigation menu items table
CREATE TABLE IF NOT EXISTS nwp_navigation (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    url TEXT NOT NULL,
    target TEXT DEFAULT '_self',
    "order" INTEGER DEFAULT 0,
    parent_id UUID REFERENCES nwp_navigation(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_nwp_navigation_user_id ON nwp_navigation(user_id);
CREATE INDEX IF NOT EXISTS idx_nwp_navigation_parent_id ON nwp_navigation(parent_id);
CREATE INDEX IF NOT EXISTS idx_nwp_navigation_order ON nwp_navigation("order");

-- Enable RLS
ALTER TABLE nwp_navigation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own navigation items"
    ON nwp_navigation FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own navigation items"
    ON nwp_navigation FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own navigation items"
    ON nwp_navigation FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own navigation items"
    ON nwp_navigation FOR DELETE
    USING (auth.uid() = user_id);

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_nwp_navigation_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_nwp_navigation_timestamp
    BEFORE UPDATE ON nwp_navigation
    FOR EACH ROW
    EXECUTE FUNCTION update_nwp_navigation_updated_at();
