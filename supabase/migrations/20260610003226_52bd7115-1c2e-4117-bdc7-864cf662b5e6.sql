
-- 1. Roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 2. Invitations
CREATE TABLE public.invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  owner_email text NOT NULL,
  owner_user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  couple_names text NOT NULL,
  event_date date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_invitations_owner_user ON public.invitations(owner_user_id);
CREATE INDEX idx_invitations_owner_email ON public.invitations(lower(owner_email));

GRANT SELECT, INSERT, UPDATE, DELETE ON public.invitations TO authenticated;
GRANT SELECT ON public.invitations TO anon;
GRANT ALL ON public.invitations TO service_role;

ALTER TABLE public.invitations ENABLE ROW LEVEL SECURITY;

-- Anyone can read invitation public data (needed to render the public page)
CREATE POLICY "Public can view invitations"
  ON public.invitations FOR SELECT
  TO anon, authenticated
  USING (true);

-- Owners can update their own
CREATE POLICY "Owners can update their invitations"
  ON public.invitations FOR UPDATE
  TO authenticated
  USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);

-- Admins can do anything
CREATE POLICY "Admins manage all invitations"
  ON public.invitations FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Rewrite RSVPs RLS so only owners + admins see them
DROP POLICY IF EXISTS "Authenticated users can view rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can insert rsvps" ON public.rsvps;

-- Public insert (guests submit confirmations)
CREATE POLICY "Anyone can insert rsvps"
  ON public.rsvps FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

GRANT INSERT ON public.rsvps TO anon, authenticated;
GRANT SELECT ON public.rsvps TO authenticated;
GRANT ALL ON public.rsvps TO service_role;

-- Owners see rsvps of their invitations
CREATE POLICY "Owners view their rsvps"
  ON public.rsvps FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.invitations i
      WHERE i.slug = rsvps.invitation_slug
        AND i.owner_user_id = auth.uid()
    )
  );

-- Admins see all
CREATE POLICY "Admins view all rsvps"
  ON public.rsvps FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- 4. Trigger on new auth users: claim invitations + assign admin role
CREATE OR REPLACE FUNCTION public.handle_new_user_claim()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Claim any invitations registered with this email
  UPDATE public.invitations
  SET owner_user_id = NEW.id
  WHERE lower(owner_email) = lower(NEW.email)
    AND owner_user_id IS NULL;

  -- Auto-assign admin to super admin email
  IF lower(NEW.email) = 'erick.gz.landa@gmail.com' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_claim
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_claim();

-- 5. Seed Luis & Leo invitation
INSERT INTO public.invitations (slug, owner_email, couple_names, event_date)
VALUES ('luis-leo', 'luisca20delgado@gmail.com', 'Luis & Leo', NULL)
ON CONFLICT (slug) DO UPDATE SET owner_email = EXCLUDED.owner_email;
