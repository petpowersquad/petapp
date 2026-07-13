-- Drop the unrestricted SELECT policy on storage.objects for pet-images.
--
-- Direct URL access for public buckets is served by Supabase Storage's CDN
-- and does not evaluate RLS on storage.objects at all, so this policy is not
-- needed for image viewing. Keeping it allows unauthenticated clients to
-- enumerate all rows in storage.objects (exposing Clerk user IDs and pet IDs)
-- via a SELECT query against the storage API.
drop policy if exists "Anyone can view pet images" on storage.objects;
