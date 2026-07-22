
-- Register Karina/xv-isabella as owner
INSERT INTO public.invitations (slug, owner_email, couple_names, package_tier, published)
VALUES ('xv-isabella', 'saraim1908@gmail.com', 'XV Isabella', 'diamante', true)
ON CONFLICT (slug) DO UPDATE
SET owner_email = EXCLUDED.owner_email,
    package_tier = EXCLUDED.package_tier;

-- Change requests table: clients ask super admin for specific edits
CREATE TABLE public.change_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_slug TEXT NOT NULL REFERENCES public.invitations(slug) ON DELETE CASCADE,
  requester_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message TEXT NOT NULL CHECK (length(message) BETWEEN 1 AND 4000),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','in_progress','done','archived')),
  admin_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_change_requests_slug ON public.change_requests(invitation_slug);
CREATE INDEX idx_change_requests_status ON public.change_requests(status);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.change_requests TO authenticated;
GRANT ALL ON public.change_requests TO service_role;

ALTER TABLE public.change_requests ENABLE ROW LEVEL SECURITY;

-- Owners can see and create requests for their own invitation
CREATE POLICY "Owners read own change requests"
ON public.change_requests FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.invitations i
    WHERE i.slug = change_requests.invitation_slug
      AND i.owner_user_id = auth.uid()
  )
);

CREATE POLICY "Owners insert own change requests"
ON public.change_requests FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.invitations i
    WHERE i.slug = change_requests.invitation_slug
      AND i.owner_user_id = auth.uid()
  )
);

-- Admins manage all
CREATE POLICY "Admins manage all change requests"
ON public.change_requests FOR ALL
TO authenticated
USING (has_role(auth.uid(), 'admin'))
WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE TRIGGER update_change_requests_updated_at
BEFORE UPDATE ON public.change_requests
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
