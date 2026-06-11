CREATE TABLE public.invitation_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  package_tier text NOT NULL CHECK (package_tier IN ('plata','oro','diamante')),
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  couple_names text NOT NULL,
  event_date date,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.invitation_requests TO anon, authenticated;
GRANT SELECT, UPDATE, DELETE ON public.invitation_requests TO authenticated;
GRANT ALL ON public.invitation_requests TO service_role;

ALTER TABLE public.invitation_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a request"
  ON public.invitation_requests FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admins view all requests"
  ON public.invitation_requests FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins update requests"
  ON public.invitation_requests FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins delete requests"
  ON public.invitation_requests FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));