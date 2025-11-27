-- Migration: Create nwp_documentation table
-- Description: This table stores all documentation content and links to nwp_accounts via author_uid
-- Created: 2025-11-22

-- Create nwp_documentation table
CREATE TABLE IF NOT EXISTS public.nwp_documentation (
    id BIGSERIAL PRIMARY KEY,
    doc_uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    author_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content JSONB,
    excerpt TEXT,
    featured_image_url TEXT,
    doc_type VARCHAR(50) DEFAULT 'doc' CHECK (doc_type IN ('doc', 'guide', 'tutorial', 'reference', 'custom')),
    doc_status VARCHAR(50) DEFAULT 'draft' CHECK (doc_status IN ('draft', 'published', 'scheduled', 'private', 'trash')),
    comment_status VARCHAR(20) DEFAULT 'open' CHECK (comment_status IN ('open', 'closed')),
    ping_status VARCHAR(20) DEFAULT 'open' CHECK (ping_status IN ('open', 'closed')),
    password VARCHAR(255),
    doc_parent BIGINT REFERENCES public.nwp_documentation(id) ON DELETE SET NULL,
    menu_order INTEGER DEFAULT 0,
    view_count BIGINT DEFAULT 0,
    like_count BIGINT DEFAULT 0,
    comment_count BIGINT DEFAULT 0,
    meta_title VARCHAR(255),
    meta_description TEXT,
    meta_keywords TEXT,
    og_image_url TEXT,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    content_live JSONB,
    featured_video_url TEXT
);

-- Create indexes for better query performance
CREATE INDEX idx_nwp_documentation_doc_uid ON public.nwp_documentation(doc_uid);
CREATE INDEX idx_nwp_documentation_author_uid ON public.nwp_documentation(author_uid);
CREATE INDEX idx_nwp_documentation_slug ON public.nwp_documentation(slug);
CREATE INDEX idx_nwp_documentation_doc_type ON public.nwp_documentation(doc_type);
CREATE INDEX idx_nwp_documentation_doc_status ON public.nwp_documentation(doc_status);
CREATE INDEX idx_nwp_documentation_published_at ON public.nwp_documentation(published_at);
CREATE INDEX idx_nwp_documentation_created_at ON public.nwp_documentation(created_at);
CREATE INDEX idx_nwp_documentation_parent ON public.nwp_documentation(doc_parent);
CREATE INDEX idx_nwp_documentation_scheduled_at ON public.nwp_documentation(scheduled_at);

-- Full-text search index
CREATE INDEX idx_nwp_documentation_title_search ON public.nwp_documentation USING gin(to_tsvector('english', title));
CREATE INDEX idx_nwp_documentation_content_search ON public.nwp_documentation USING gin(to_tsvector('english', content));

-- Apply updated_at trigger to nwp_documentation
CREATE TRIGGER update_nwp_documentation_updated_at
    BEFORE UPDATE ON public.nwp_documentation
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically set published_at when status changes to published
CREATE OR REPLACE FUNCTION public.set_documentation_published_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Set published_at when doc status changes to published and published_at is not set
    IF NEW.doc_status = 'published' AND OLD.doc_status != 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;

    -- Clear published_at if status changes from published to something else
    IF NEW.doc_status != 'published' AND OLD.doc_status = 'published' THEN
        NEW.published_at = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_documentation_published_at
    BEFORE UPDATE ON public.nwp_documentation
    FOR EACH ROW
    EXECUTE FUNCTION public.set_documentation_published_at();

-- Function to automatically set published_at on insert if status is published
CREATE OR REPLACE FUNCTION public.set_documentation_published_at_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.doc_status = 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_documentation_published_at_on_insert
    BEFORE INSERT ON public.nwp_documentation
    FOR EACH ROW
    EXECUTE FUNCTION public.set_documentation_published_at_on_insert();

-- Enable Row Level Security (RLS)
ALTER TABLE public.nwp_documentation ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Anyone can view published documentation
CREATE POLICY "Anyone can view published documentation" ON public.nwp_documentation
    FOR SELECT
    USING (doc_status = 'published');

-- Policy: Users can view their own documentation
CREATE POLICY "Users can view own documentation" ON public.nwp_documentation
    FOR SELECT
    USING (auth.uid() = author_uid);

-- Policy: Users can create documentation
CREATE POLICY "Users can create documentation" ON public.nwp_documentation
    FOR INSERT
    WITH CHECK (auth.uid() = author_uid);

-- Policy: Users can update their own documentation
CREATE POLICY "Users can update own documentation" ON public.nwp_documentation
    FOR UPDATE
    USING (auth.uid() = author_uid);

-- Policy: Users can delete their own documentation
CREATE POLICY "Users can delete own documentation" ON public.nwp_documentation
    FOR DELETE
    USING (auth.uid() = author_uid);

-- Policy: Administrators and Editors can view all documentation
CREATE POLICY "Admins and editors can view all documentation" ON public.nwp_documentation
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role IN ('administrator', 'editor')
        )
    );

-- Policy: Administrators and Editors can update all documentation
CREATE POLICY "Admins and editors can update all documentation" ON public.nwp_documentation
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role IN ('administrator', 'editor')
        )
    );

-- Policy: Administrators can delete all documentation
CREATE POLICY "Admins can delete all documentation" ON public.nwp_documentation
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role = 'administrator'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nwp_documentation TO authenticated;
GRANT SELECT ON public.nwp_documentation TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.nwp_documentation_id_seq TO authenticated;
