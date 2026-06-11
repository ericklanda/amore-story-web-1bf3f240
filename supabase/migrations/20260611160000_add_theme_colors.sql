-- Add theme_colors (3 hex colors) for invitation customization
ALTER TABLE public.invitations
  ADD COLUMN IF NOT EXISTS theme_colors text[];
