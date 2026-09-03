-- ============================================================================
-- ROW LEVEL SECURITY
--
-- The rules, stated plainly:
--
--  * anon (the public website) reads published, non-deleted content and nothing
--    else. It cannot read enquiries, customers, users or the audit log.
--  * anon cannot INSERT anywhere. Enquiries arrive through a server action
--    holding the service-role key, which bypasses RLS deliberately — that keeps
--    the public key from being able to write to the database at all.
--  * Portal members read everything in the portal. Editors and above write
--    content. Only admins and owners touch users, settings and enquiry records.
--  * Nobody can write to audit_log. It is append-only by trigger.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Content tables
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  tables text[] := array[
    'content_services', 'content_fleet', 'content_industries', 'content_projects',
    'content_testimonials', 'content_faqs', 'content_gallery',
    'content_clients', 'content_documents', 'content_news',
    'content_careers', 'content_departments', 'content_staff',
    'content_divisions'
  ];
begin
  foreach t in array tables loop
    execute format('alter table %I enable row level security;', t);

    execute format('drop policy if exists %I on %I;', t || '_public_read', t);
    execute format($p$
      create policy %I on %I
        for select
        to anon, authenticated
        using (deleted_at is null and status = 'published');
    $p$, t || '_public_read', t);

    execute format('drop policy if exists %I on %I;', t || '_member_read', t);
    execute format($p$
      create policy %I on %I
        for select
        to authenticated
        using (is_portal_member());
    $p$, t || '_member_read', t);

    execute format('drop policy if exists %I on %I;', t || '_editor_insert', t);
    execute format($p$
      create policy %I on %I
        for insert
        to authenticated
        with check (can_edit_content());
    $p$, t || '_editor_insert', t);

    execute format('drop policy if exists %I on %I;', t || '_editor_update', t);
    execute format($p$
      create policy %I on %I
        for update
        to authenticated
        using (can_edit_content())
        with check (can_edit_content());
    $p$, t || '_editor_update', t);

    -- Hard deletes are reserved for admins. Editors set deleted_at instead,
    -- which the update policy already permits.
    execute format('drop policy if exists %I on %I;', t || '_admin_delete', t);
    execute format($p$
      create policy %I on %I
        for delete
        to authenticated
        using (is_portal_admin());
    $p$, t || '_admin_delete', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Singletons
-- ---------------------------------------------------------------------------

alter table content_singletons enable row level security;

drop policy if exists content_singletons_public_read on content_singletons;
create policy content_singletons_public_read on content_singletons
  for select to anon, authenticated using (true);

drop policy if exists content_singletons_editor_write on content_singletons;
create policy content_singletons_editor_write on content_singletons
  for all to authenticated
  using (can_edit_content())
  with check (can_edit_content());

-- ---------------------------------------------------------------------------
-- Media
-- ---------------------------------------------------------------------------

alter table media_assets enable row level security;

drop policy if exists media_assets_public_read on media_assets;
create policy media_assets_public_read on media_assets
  for select to anon, authenticated using (deleted_at is null);

drop policy if exists media_assets_editor_write on media_assets;
create policy media_assets_editor_write on media_assets
  for all to authenticated
  using (can_edit_content())
  with check (can_edit_content());

-- ---------------------------------------------------------------------------
-- Enquiries — portal only, never public
-- ---------------------------------------------------------------------------

do $$
declare
  t text;
  tables text[] := array['quote_requests', 'contact_messages', 'job_applications'];
begin
  foreach t in array tables loop
    execute format('alter table %I enable row level security;', t);

    execute format('drop policy if exists %I on %I;', t || '_member_read', t);
    execute format($p$
      create policy %I on %I
        for select to authenticated
        using (is_portal_member());
    $p$, t || '_member_read', t);

    execute format('drop policy if exists %I on %I;', t || '_editor_update', t);
    execute format($p$
      create policy %I on %I
        for update to authenticated
        using (can_edit_content())
        with check (can_edit_content());
    $p$, t || '_editor_update', t);

    execute format('drop policy if exists %I on %I;', t || '_admin_delete', t);
    execute format($p$
      create policy %I on %I
        for delete to authenticated
        using (is_portal_admin());
    $p$, t || '_admin_delete', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
-- Customers
-- ---------------------------------------------------------------------------

alter table customers enable row level security;

drop policy if exists customers_member_read on customers;
create policy customers_member_read on customers
  for select to authenticated using (is_portal_member());

drop policy if exists customers_editor_write on customers;
create policy customers_editor_write on customers
  for all to authenticated
  using (can_edit_content())
  with check (can_edit_content());

-- ---------------------------------------------------------------------------
-- Settings
-- ---------------------------------------------------------------------------

alter table site_settings enable row level security;

drop policy if exists site_settings_public_read on site_settings;
create policy site_settings_public_read on site_settings
  for select to anon, authenticated using (true);

drop policy if exists site_settings_admin_write on site_settings;
create policy site_settings_admin_write on site_settings
  for all to authenticated
  using (is_portal_admin())
  with check (is_portal_admin());

-- ---------------------------------------------------------------------------
-- Portal users
--
-- A member may always read their own row, which is what the portal uses to
-- resolve the current user's role without needing elevated access.
-- ---------------------------------------------------------------------------

alter table portal_users enable row level security;

drop policy if exists portal_users_self_read on portal_users;
create policy portal_users_self_read on portal_users
  for select to authenticated using (id = auth.uid());

drop policy if exists portal_users_member_read on portal_users;
create policy portal_users_member_read on portal_users
  for select to authenticated using (is_portal_member());

drop policy if exists portal_users_admin_write on portal_users;
create policy portal_users_admin_write on portal_users
  for all to authenticated
  using (is_portal_admin())
  with check (is_portal_admin());

-- ---------------------------------------------------------------------------
-- Audit log — readable by admins, writable by nobody
-- ---------------------------------------------------------------------------

alter table audit_log enable row level security;

drop policy if exists audit_log_admin_read on audit_log;
create policy audit_log_admin_read on audit_log
  for select to authenticated using (is_portal_admin());

-- No insert/update/delete policies exist, so the only writer is the
-- security-definer trigger. That is the point.
