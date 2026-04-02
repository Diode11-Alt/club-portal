-- =============================================
-- STORAGE BUCKETS FOR PROFILES AND MESSAGES
-- =============================================
-- Create the buckets for user avatars and chat attachments if they don't exist

-- 1. Create team-avatars bucket (5MB limit, public)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'team-avatars', 
  'team-avatars', 
  true, 
  5242880, -- 5MB in bytes
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET 
  file_size_limit = 5242880,
  public = true;

-- 2. Create Public Access Policy for team-avatars
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'team-avatars');

-- 3. Create Authenticated Upload Policy for team-avatars
CREATE POLICY "Users can upload avatars" 
ON storage.objects FOR INSERT 
WITH CHECK (
  bucket_id = 'team-avatars' 
  AND auth.role() = 'authenticated'
);

-- 4. Create Authenticated Update Policy for team-avatars
CREATE POLICY "Users can update their avatars" 
ON storage.objects FOR UPDATE 
WITH CHECK (
  bucket_id = 'team-avatars' 
  AND auth.role() = 'authenticated'
);
