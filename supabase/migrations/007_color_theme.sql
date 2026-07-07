-- Brand color theme selection (classic | garage | racing)

INSERT INTO public.site_settings (key, value) VALUES
  ('color_theme', 'classic')
ON CONFLICT (key) DO NOTHING;
