-- Ready Bikes Shop — Initial Schema
-- Run in Supabase SQL Editor or via supabase db push

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Categories ───────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  image_url   TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories (slug);

-- ─── Articles ─────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS public.articles (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  description   TEXT,
  price         NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
  category_id   UUID REFERENCES public.categories (id) ON DELETE SET NULL,
  on_sale       BOOLEAN NOT NULL DEFAULT false,
  image_url     TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles (category_id);
CREATE INDEX IF NOT EXISTS idx_articles_on_sale   ON public.articles (on_sale);
CREATE INDEX IF NOT EXISTS idx_articles_price     ON public.articles (price);

-- ─── updated_at trigger ───────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ─── Row Level Security ───────────────────────────────────────────────────────

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles   ENABLE ROW LEVEL SECURITY;

-- Public read (anonymous + authenticated)
CREATE POLICY "categories_select_public"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "articles_select_public"
  ON public.articles FOR SELECT
  USING (true);

-- Authenticated write
CREATE POLICY "categories_insert_auth"
  ON public.categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "categories_update_auth"
  ON public.categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "categories_delete_auth"
  ON public.categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "articles_insert_auth"
  ON public.articles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "articles_update_auth"
  ON public.articles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "articles_delete_auth"
  ON public.articles FOR DELETE
  TO authenticated
  USING (true);

-- ─── Storage bucket ───────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "products_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

CREATE POLICY "products_insert_auth"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products');

CREATE POLICY "products_update_auth"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products');

CREATE POLICY "products_delete_auth"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products');

-- ─── Seed data (optional) ─────────────────────────────────────────────────────

INSERT INTO public.categories (name, slug) VALUES
  ('Accesorios',  'accesorios'),
  ('Recambios',   'recambios'),
  ('Equipamiento','equipamiento'),
  ('Outlet',      'outlet')
ON CONFLICT (slug) DO NOTHING;
