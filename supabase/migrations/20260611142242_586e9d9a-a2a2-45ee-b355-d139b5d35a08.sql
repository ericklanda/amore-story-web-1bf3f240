DROP POLICY IF EXISTS "Public can view published invitations" ON public.invitations;
REVOKE SELECT ON public.invitations FROM anon;