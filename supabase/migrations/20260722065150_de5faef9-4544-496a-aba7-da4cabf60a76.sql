
DROP POLICY IF EXISTS "Public read by token" ON public.invitation_sends;
REVOKE SELECT ON public.invitation_sends FROM anon;
