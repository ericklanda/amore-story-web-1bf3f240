
CREATE TABLE public.rsvps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_slug TEXT NOT NULL,
  name TEXT NOT NULL,
  attending TEXT NOT NULL CHECK (attending IN ('yes','no')),
  guests INTEGER NOT NULL DEFAULT 1,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX rsvps_invitation_slug_idx ON public.rsvps (invitation_slug, created_at DESC);

GRANT SELECT ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

ALTER TABLE public.rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can view rsvps"
  ON public.rsvps FOR SELECT
  TO authenticated
  USING (true);
