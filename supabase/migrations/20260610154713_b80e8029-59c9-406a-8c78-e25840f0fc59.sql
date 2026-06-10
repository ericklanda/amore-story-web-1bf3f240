
-- Public read for invitation photos
DROP POLICY IF EXISTS "Public read invitation-photos" ON storage.objects;
CREATE POLICY "Public read invitation-photos"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'invitation-photos');

-- Authenticated users (owner or admin) can upload to their slug folder
-- Path convention: <slug>/<filename>
DROP POLICY IF EXISTS "Owners/admins upload invitation-photos" ON storage.objects;
CREATE POLICY "Owners/admins upload invitation-photos"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'invitation-photos'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.slug = split_part(name, '/', 1)
          AND i.owner_user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Owners/admins update invitation-photos" ON storage.objects;
CREATE POLICY "Owners/admins update invitation-photos"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'invitation-photos'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.slug = split_part(name, '/', 1)
          AND i.owner_user_id = auth.uid()
      )
    )
  );

DROP POLICY IF EXISTS "Owners/admins delete invitation-photos" ON storage.objects;
CREATE POLICY "Owners/admins delete invitation-photos"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'invitation-photos'
    AND (
      public.has_role(auth.uid(), 'admin'::public.app_role)
      OR EXISTS (
        SELECT 1 FROM public.invitations i
        WHERE i.slug = split_part(name, '/', 1)
          AND i.owner_user_id = auth.uid()
      )
    )
  );
