-- Fix Storage 403: ensure bucket + admin upload policies

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Remove legacy/conflicting storage policies
DROP POLICY IF EXISTS "products_select_public" ON storage.objects;
DROP POLICY IF EXISTS "products_insert_auth" ON storage.objects;
DROP POLICY IF EXISTS "products_update_auth" ON storage.objects;
DROP POLICY IF EXISTS "products_delete_auth" ON storage.objects;
DROP POLICY IF EXISTS "products_insert_admin" ON storage.objects;
DROP POLICY IF EXISTS "products_update_admin" ON storage.objects;
DROP POLICY IF EXISTS "products_delete_admin" ON storage.objects;

-- Public read (needed to display images on the website)
CREATE POLICY "products_select_public"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Admin write (articles/, categories/, site/ folders)
CREATE POLICY "products_insert_admin"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "products_update_admin"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'products' AND public.is_admin());

CREATE POLICY "products_delete_admin"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'products' AND public.is_admin());
