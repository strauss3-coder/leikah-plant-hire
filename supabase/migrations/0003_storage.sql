-- ============================================================================
-- STORAGE BUCKETS
--
--  media               public   — site photography, served through next/image
--  documents           public   — brochures, certificates, technical sheets
--  enquiry-attachments private  — customer uploads; never publicly readable
--
-- Enquiry attachments are the sensitive one: they arrive from the public form,
-- so anon needs INSERT, but only portal members may read them back.
-- ============================================================================

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'media',
    'media',
    true,
    52428800, -- 50 MB
    array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml', 'video/mp4', 'video/webm']
  ),
  (
    'documents',
    'documents',
    true,
    52428800,
    array[
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'image/jpeg',
      'image/png'
    ]
  ),
  (
    'enquiry-attachments',
    'enquiry-attachments',
    false,
    20971520, -- 20 MB, matching the client-side limit
    array[
      'image/jpeg', 'image/png', 'image/webp', 'image/heic',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
  )
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

-- ---------------------------------------------------------------------------
-- media
-- ---------------------------------------------------------------------------

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'media');

drop policy if exists "media editor write" on storage.objects;
create policy "media editor write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and can_edit_content());

drop policy if exists "media editor update" on storage.objects;
create policy "media editor update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and can_edit_content());

drop policy if exists "media admin delete" on storage.objects;
create policy "media admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and is_portal_admin());

-- ---------------------------------------------------------------------------
-- documents
-- ---------------------------------------------------------------------------

drop policy if exists "documents public read" on storage.objects;
create policy "documents public read" on storage.objects
  for select to anon, authenticated
  using (bucket_id = 'documents');

drop policy if exists "documents editor write" on storage.objects;
create policy "documents editor write" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'documents' and can_edit_content());

drop policy if exists "documents editor update" on storage.objects;
create policy "documents editor update" on storage.objects
  for update to authenticated
  using (bucket_id = 'documents' and can_edit_content());

drop policy if exists "documents admin delete" on storage.objects;
create policy "documents admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'documents' and is_portal_admin());

-- ---------------------------------------------------------------------------
-- enquiry-attachments
--
-- anon may upload but may not list or read. Portal members may read. This is
-- what lets a customer attach a 20 MB photograph without it passing through a
-- serverless function body, while keeping the object private afterwards.
-- ---------------------------------------------------------------------------

drop policy if exists "enquiry upload" on storage.objects;
create policy "enquiry upload" on storage.objects
  for insert to anon, authenticated
  with check (bucket_id = 'enquiry-attachments');

drop policy if exists "enquiry member read" on storage.objects;
create policy "enquiry member read" on storage.objects
  for select to authenticated
  using (bucket_id = 'enquiry-attachments' and is_portal_member());

drop policy if exists "enquiry admin delete" on storage.objects;
create policy "enquiry admin delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'enquiry-attachments' and is_portal_admin());
