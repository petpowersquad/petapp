-- Create a public bucket for pet images
insert into storage.buckets (id, name, public)
values ('pet-images', 'pet-images', true)
on conflict (id) do nothing;

-- Note: RLS on storage.objects is managed by Supabase internally.
-- Attempting to ALTER TABLE storage.objects requires owner privileges
-- that the migration runner does not have and is not needed here.

-- 1. Allow authenticated users to upload images into their own folder name path
create policy "Authenticated users can upload pet images"
on storage.objects
for insert
with check (
  bucket_id = 'pet-images' and
  auth.role() = 'authenticated' and
  (storage.foldername(name))[1] = public.get_my_id()
);

-- 2. Allow owners to update/delete their own images
create policy "Users can update their own images"
on storage.objects
for update
using (
  bucket_id = 'pet-images' and
  auth.role() = 'authenticated' and
  owner_id = public.get_my_id()
)
with check (
  bucket_id = 'pet-images' and
  owner_id = public.get_my_id()
);

create policy "Users can delete their own images"
on storage.objects
for delete
using (
  bucket_id = 'pet-images' and
  auth.role() = 'authenticated' and
  owner_id = public.get_my_id()
);

-- 3. Public read access (images are publicly viewable via direct URL)
create policy "Anyone can view pet images"
on storage.objects
for select
using ( bucket_id = 'pet-images' );

-- 4. Support and admin roles can manage all images
create policy "Support and admins can manage all pet images"
on storage.objects
for all
using (
  bucket_id = 'pet-images' and
  public.get_my_role() in ('support', 'admin')
)
with check (
  bucket_id = 'pet-images' and
  public.get_my_role() in ('support', 'admin')
);
