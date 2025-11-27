-- Add public read access to navigation items
-- This allows the landing page navigation to display menu items without authentication

CREATE POLICY "Public users can view all navigation items"
    ON nwp_navigation FOR SELECT
    TO anon
    USING (true);
