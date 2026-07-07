-- Site-wide images & content editable from admin

CREATE TABLE IF NOT EXISTS public.site_settings (
  key         TEXT PRIMARY KEY,
  value       TEXT NOT NULL DEFAULT '',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER trg_site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "site_settings_select_public"
  ON public.site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "site_settings_insert_admin"
  ON public.site_settings FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());

CREATE POLICY "site_settings_update_admin"
  ON public.site_settings FOR UPDATE
  TO authenticated
  USING (public.is_admin());

-- Default keys (empty = gradient/icon fallback on frontend)
INSERT INTO public.site_settings (key, value) VALUES
  ('hero_image_url', ''),
  ('logo_url', ''),
  ('cta_image_url', ''),
  ('catalog_banner_url', ''),
  ('about_image_url', ''),
  ('service_image_mechanics', ''),
  ('service_image_tyres', ''),
  ('service_image_electric', ''),
  ('service_image_itv', '')
ON CONFLICT (key) DO NOTHING;
