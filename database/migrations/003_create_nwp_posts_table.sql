-- Migration: Create nwp_posts table
-- Description: This table stores all posts/content and links to nwp_accounts via author_uid
-- Created: 2025-11-14

-- Create nwp_posts table
CREATE TABLE IF NOT EXISTS public.nwp_posts (
    id BIGSERIAL PRIMARY KEY,
    post_uid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    author_uid UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT,
    excerpt TEXT,
    featured_image_url TEXT,
    post_type VARCHAR(50) DEFAULT 'post' CHECK (post_type IN ('post', 'page', 'draft', 'custom')),
    post_status VARCHAR(50) DEFAULT 'draft' CHECK (post_status IN ('draft', 'published', 'scheduled', 'private', 'trash')),
    comment_status VARCHAR(20) DEFAULT 'open' CHECK (comment_status IN ('open', 'closed')),
    ping_status VARCHAR(20) DEFAULT 'open' CHECK (ping_status IN ('open', 'closed')),
    password VARCHAR(255),
    post_parent BIGINT REFERENCES public.nwp_posts(id) ON DELETE SET NULL,
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
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_nwp_posts_post_uid ON public.nwp_posts(post_uid);
CREATE INDEX idx_nwp_posts_author_uid ON public.nwp_posts(author_uid);
CREATE INDEX idx_nwp_posts_slug ON public.nwp_posts(slug);
CREATE INDEX idx_nwp_posts_post_type ON public.nwp_posts(post_type);
CREATE INDEX idx_nwp_posts_post_status ON public.nwp_posts(post_status);
CREATE INDEX idx_nwp_posts_published_at ON public.nwp_posts(published_at);
CREATE INDEX idx_nwp_posts_created_at ON public.nwp_posts(created_at);
CREATE INDEX idx_nwp_posts_parent ON public.nwp_posts(post_parent);
CREATE INDEX idx_nwp_posts_scheduled_at ON public.nwp_posts(scheduled_at);

-- Full-text search index
CREATE INDEX idx_nwp_posts_title_search ON public.nwp_posts USING gin(to_tsvector('english', title));
CREATE INDEX idx_nwp_posts_content_search ON public.nwp_posts USING gin(to_tsvector('english', content));

-- Apply updated_at trigger to nwp_posts
CREATE TRIGGER update_nwp_posts_updated_at
    BEFORE UPDATE ON public.nwp_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Function to automatically set published_at when status changes to published
CREATE OR REPLACE FUNCTION public.set_published_at()
RETURNS TRIGGER AS $$
BEGIN
    -- Set published_at when post status changes to published and published_at is not set
    IF NEW.post_status = 'published' AND OLD.post_status != 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;

    -- Clear published_at if status changes from published to something else
    IF NEW.post_status != 'published' AND OLD.post_status = 'published' THEN
        NEW.published_at = NULL;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_published_at
    BEFORE UPDATE ON public.nwp_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_published_at();

-- Function to automatically set published_at on insert if status is published
CREATE OR REPLACE FUNCTION public.set_published_at_on_insert()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.post_status = 'published' AND NEW.published_at IS NULL THEN
        NEW.published_at = NOW();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_published_at_on_insert
    BEFORE INSERT ON public.nwp_posts
    FOR EACH ROW
    EXECUTE FUNCTION public.set_published_at_on_insert();

-- Enable Row Level Security (RLS)
ALTER TABLE public.nwp_posts ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Policy: Anyone can view published posts
CREATE POLICY "Anyone can view published posts" ON public.nwp_posts
    FOR SELECT
    USING (post_status = 'published');

-- Policy: Users can view their own posts
CREATE POLICY "Users can view own posts" ON public.nwp_posts
    FOR SELECT
    USING (auth.uid() = author_uid);

-- Policy: Users can create posts
CREATE POLICY "Users can create posts" ON public.nwp_posts
    FOR INSERT
    WITH CHECK (auth.uid() = author_uid);

-- Policy: Users can update their own posts
CREATE POLICY "Users can update own posts" ON public.nwp_posts
    FOR UPDATE
    USING (auth.uid() = author_uid);

-- Policy: Users can delete their own posts
CREATE POLICY "Users can delete own posts" ON public.nwp_posts
    FOR DELETE
    USING (auth.uid() = author_uid);

-- Policy: Administrators and Editors can view all posts
CREATE POLICY "Admins and editors can view all posts" ON public.nwp_posts
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role IN ('administrator', 'editor')
        )
    );

-- Policy: Administrators and Editors can update all posts
CREATE POLICY "Admins and editors can update all posts" ON public.nwp_posts
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role IN ('administrator', 'editor')
        )
    );

-- Policy: Administrators can delete all posts
CREATE POLICY "Admins can delete all posts" ON public.nwp_posts
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.nwp_accounts
            WHERE user_uid = auth.uid()
            AND role = 'administrator'
        )
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON public.nwp_posts TO authenticated;
GRANT SELECT ON public.nwp_posts TO anon;
GRANT USAGE, SELECT ON SEQUENCE public.nwp_posts_id_seq TO authenticated;
