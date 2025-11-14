/*
  Add avatar_url column to profiles table

  This migration adds the avatar_url field to support user profile pictures.
  The field is nullable to accommodate users who don't have profile pictures.
*/

-- Add avatar_url column to profiles table
ALTER TABLE profiles
ADD COLUMN avatar_url text;

-- Add comment to document the change
COMMENT ON TABLE profiles IS 'Add avatar_url column for user profile picture support';

-- Create index for avatar_url queries
CREATE INDEX IF NOT EXISTS idx_profiles_avatar_url ON profiles(avatar_url);

-- Update existing profiles to have default avatar_url based on avatar_character
UPDATE profiles
SET avatar_url = CASE
  WHEN avatar_character = 'sky' THEN 'https://ui-avatars.com/api/?name=sky&background=linear-gradient(to%20bottom,%20rgb(99,102,241)%20from%20rgb(59,130,246))&color=fff'
  WHEN avatar_character = 'sun' THEN 'https://ui-avatars.com/api/?name=sun&background=linear-gradient(to%20right,%20rgb(255,94,77)%20from%20rgb(255,154,0))&color=fff'
  WHEN avatar_character = 'moon' THEN 'https://ui-avatars.com/api/?name=moon&background=linear-gradient(to%20bottom,%20rgb(30,30,30))&color=fff'
  WHEN avatar_character = 'star' THEN 'https://ui-avatars.com/api/?name=star&background=linear-gradient(to%20bottom,%20rgb(255,200,87))&color=fff'
  WHEN avatar_character = 'cloud' THEN 'https://ui-avatars.com/api/?name=cloud&background=linear-gradient(to%20bottom,%20rgb(147,197,253))&color=fff'
  WHEN avatar_character = 'rainbow' THEN 'https://ui-avatars.com/api/?name=rainbow&background=linear-gradient(to%20bottom,%20rgb(238,130,238))&color=fff'
  ELSE NULL
END
WHERE avatar_url IS NULL;

-- Create storage policy for avatars if it doesn't exist
INSERT INTO storage.policies (
  name,
  definition,
  description
) VALUES (
  'avatars',
  '{"bucket": "avatars", "allowedMimeTypes": ["image/*"], "maxSize": 5242880, "transformations": []}',
  'Policy for avatar image uploads - allows images up to 5MB'
) ON CONFLICT (name) DO NOTHING;

-- Create RLS policy for avatars
CREATE POLICY "Users can upload their own avatars" ON storage.buckets
FOR INSERT
WITH CHECK (
  auth.role() = 'authenticated'
)
AS PERMISSIVE FOR SELECT
AS PERMISSIVE FOR INSERT
AS PERMISSIVE FOR UPDATE
USING (
  bucket_id = 'avatars',
  (storage.foldername()) = (auth.uid())::text
);

-- Grant access to authenticated users
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

SELECT 'Successfully added avatar_url column and default avatars' as migration_result;