
-- Extend invitations with all editable template fields
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS groom_name TEXT,
  ADD COLUMN IF NOT EXISTS bride_name TEXT,
  ADD COLUMN IF NOT EXISTS event_datetime TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS city TEXT,
  ADD COLUMN IF NOT EXISTS hashtag TEXT,
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT,
  ADD COLUMN IF NOT EXISTS story_image_url TEXT,
  ADD COLUMN IF NOT EXISTS youtube_song_id TEXT,
  ADD COLUMN IF NOT EXISTS story_milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS parents JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS venue_name TEXT,
  ADD COLUMN IF NOT EXISTS venue_address TEXT,
  ADD COLUMN IF NOT EXISTS venue_maps_url TEXT,
  ADD COLUMN IF NOT EXISTS dress_code TEXT,
  ADD COLUMN IF NOT EXISTS dress_code_note TEXT,
  ADD COLUMN IF NOT EXISTS timeline JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS gift_registry JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS transportation_note TEXT,
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT,
  ADD COLUMN IF NOT EXISTS faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS welcome_message TEXT,
  ADD COLUMN IF NOT EXISTS thank_you_message TEXT,
  ADD COLUMN IF NOT EXISTS published BOOLEAN NOT NULL DEFAULT false;

-- Public can read only published invitations (for the public /{slug} page)
DROP POLICY IF EXISTS "Public can view published invitations" ON public.invitations;
CREATE POLICY "Public can view published invitations"
  ON public.invitations
  FOR SELECT
  TO anon, authenticated
  USING (published = true);

-- Allow anon to read published invitations via Data API
GRANT SELECT ON public.invitations TO anon;

-- updated_at trigger (in case it isn't there yet)
DROP TRIGGER IF EXISTS update_invitations_updated_at ON public.invitations;
CREATE TRIGGER update_invitations_updated_at
  BEFORE UPDATE ON public.invitations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
