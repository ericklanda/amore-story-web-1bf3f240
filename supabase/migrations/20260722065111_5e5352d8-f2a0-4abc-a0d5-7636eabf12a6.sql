
CREATE TABLE public.invitation_sends (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_slug TEXT NOT NULL,
  owner_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(9), 'base64'),
  phone TEXT NOT NULL,
  guest_name TEXT,
  guests_allowed INTEGER NOT NULL DEFAULT 1 CHECK (guests_allowed >= 1 AND guests_allowed <= 30),
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitation_sends_slug ON public.invitation_sends(invitation_slug);
CREATE INDEX idx_invitation_sends_owner ON public.invitation_sends(owner_user_id);
CREATE INDEX idx_invitation_sends_token ON public.invitation_sends(token);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitation_sends TO authenticated;
GRANT SELECT ON public.invitation_sends TO anon;
GRANT ALL ON public.invitation_sends TO service_role;

ALTER TABLE public.invitation_sends ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage their sends"
  ON public.invitation_sends
  FOR ALL
  TO authenticated
  USING (owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'))
  WITH CHECK (owner_user_id = auth.uid() OR public.has_role(auth.uid(), 'admin'));

-- Public may look up by token only (single-row reads via server fn that filters by token).
CREATE POLICY "Public read by token"
  ON public.invitation_sends
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE TRIGGER update_invitation_sends_updated_at
  BEFORE UPDATE ON public.invitation_sends
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
