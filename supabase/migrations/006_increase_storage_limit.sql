-- Increase storage limit for hero/banner images (Gemini exports can be >5 MB)

UPDATE storage.buckets
SET file_size_limit = 20971520  -- 20 MB
WHERE id = 'products';
