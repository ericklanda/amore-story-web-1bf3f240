GRANT UPDATE ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

CREATE POLICY "Owners can update rsvps for their invitation"
ON public.rsvps
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.invitations i
    WHERE i.slug = rsvps.invitation_slug AND i.owner_user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.invitations i
    WHERE i.slug = rsvps.invitation_slug AND i.owner_user_id = auth.uid()
  )
);

CREATE POLICY "Admins can update all rsvps"
ON public.rsvps
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));