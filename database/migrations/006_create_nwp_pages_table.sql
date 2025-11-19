-- Migration: Create nwp_pages table
-- Description: This table stores all static pages (About, Contact, etc.) and links to nwp_accounts via author_uid
-- Created: 2025-11-19

-- Create nwp_pages table
CREATE TABLE IF NOT EXISTS public.nwp_pages (
    id BIGSERIAL PRIMARY KEY,
    page_uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    author_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content JSONB,
    excerpt TEXT,
    featured_image_url TEXT,
    page_status VARCHAR(50) DEFAULT 'draft' CHECK (page_status IN ('draft', 'published', 'private', 'trash')),
    comment_status VARCHAR(20) DEFAULT 'closed' CHECK (comment_status IN ('open', 'closed')),
    password VARCHAR(255),
    page_parent BIGINT REFERENCES public.nwp_pages(id) ON DELETE SET NULL,
    menu_order INTEGER DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_image_url TEXT,
    published_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    content_live JSONB
);

-- Create indexes for better query performance
CREATE INDEX idx_nwp_pages_page_uid ON public.nwp_pages(page_uid);
CREATE INDEX idx_nwp_pages_author_uid ON public.nwp_pages(author_uid);
CREATE INDEX idx_nwp_pages_slug ON public.nwp_pages(slug);
CREATE INDEX idx_nwp_pages_page_status ON public.nwp_pages(page_status);
CREATE INDEX idx_nwp_pages_published_at ON public.nwp_pages(published_at);
CREATE INDEX idx_nwp_pages_created_at ON public.nwp_pages(created_at);
CREATE INDEX idx_nwp_pages_parent ON public.nwp_pages(page_parent);

-- Full-text search index
CREATE INDEX idx_nwp_pages_title_search ON public.nwp_pages USING gin(to_tsvector('english', title));
CREATE INDEX idx_nwp_pages_content_search ON public.nwp_pages USING gin(to_tsvector('english', content));

-- Apply updated_at trigger to nwp_pages
CREATE TRIGGER update_nwp_pages_updated_at
    BEFORE UPDATE ON public.nwp_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically set published_at when status changes to published
CREATE OR REPLACE FUNCTION public.set_page_published_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Set published_at when page status changes to published and published_at is not set
    IF NEW.page_status = 'published' AND (OLD.page_status IS NULL OR OLD.page_status != 'published') AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;

    -- Clear published_at if status changes from published to something else
    IF NEW.page_status != 'published' AND OLD.page_status = 'published' THEN
        NEW.published_at = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_page_published_at
    BEFORE UPDATE ON public.nwp_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_page_published_at();

-- Function to automatically set published_at on insert if status is published
CREATE OR REPLACE FUNCTION public.set_page_published_at_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.page_status = 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_page_published_at_on_insert
    BEFORE INSERT ON public.nwp_pages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_page_published_at_on_insert();

-- Enable Row Level Security (RLS)
ALTER TABLE public.nwp_pages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Anyone can view published pages
CREATE POLICY "Anyone can view published pages" ON public.nwp_pages
    FOR SELECT
    USING (page_status = 'published');

-- Policy: Users can view their own pages
CREATE POLICY "Users can view own pages" ON public.nwp_pages
    FOR SELECT
    USING (auth.uid() = author_uid);

-- Policy: Users can create pages
CREATE POLICY "Users can create pages" ON public.nwp_pages
    FOR INSERT
    WITH CHECK (auth.uid() = author_uid);

-- Policy: Users can update their own pages
CREATE POLICY "Users can update own pages" ON public.nwp_pages
    FOR UPDATE
    USING (auth.uid() = author_uid);

-- Policy: Users can delete their own pages
CREATE POLICY "Users can delete own pages" ON public.nwp_pages
    FOR DELETE
    USING (auth.uid() = author_uid);

-- Policy: Administrators and Editors can view all pages
CREATE POLICY "Admins and editors can view all pages" ON public.nwp_pages
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role IN ('administrator', 'editor')
        )
    );

-- Policy: Administrators and Editors can update all pages
CREATE POLICY "Admins and editors can update all pages" ON public.nwp_pages
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role IN ('administrator', 'editor')
        )
    );

-- Policy: Administrators can delete all pages
CREATE POLICY "Admins can delete all pages" ON public.nwp_pages
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role = 'administrator'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nwp_pages TO authenticated;
GRANT SELECT ON public.nwp_pages TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.nwp_pages_id_seq TO authenticated;
