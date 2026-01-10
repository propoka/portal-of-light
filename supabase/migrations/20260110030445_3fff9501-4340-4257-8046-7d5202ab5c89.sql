-- Create storage bucket for sound effects
INSERT INTO storage.buckets (id, name, public)
VALUES ('sounds', 'sounds', true);

-- Allow public read access to sounds
CREATE POLICY "Public can read sounds"
ON storage.objects
FOR SELECT
USING (bucket_id = 'sounds');

-- Allow authenticated and anon users to upload sounds
CREATE POLICY "Anyone can upload sounds"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'sounds');
