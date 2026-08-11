INSERT INTO public.invitations (slug, owner_email, couple_names, event_date, event_datetime, city, hashtag, package_tier, whatsapp_number, venue_name, venue_address, venue_maps_url, dress_code, gift_registry, welcome_message, published)
VALUES (
  'xv-krystel',
  'lucyu26@hotmail.com',
  'Tania Krystel',
  '2026-10-17',
  '2026-10-17T18:00:00-06:00',
  'Ejido Benito Juárez',
  '#Krystel2026',
  'oro',
  '6361121663',
  'Gimnasio Municipal Óscar Acosta',
  'Ejido Benito Juárez',
  'https://maps.app.goo.gl/EAGLpzJF63Ctrbku6?g_st=ac',
  'Semiformal',
  '["Buzón de dinero"]'::jsonb,
  'Con inmensa alegría y gratitud a Dios los invitamos a compartir la celebración de los XV años de nuestra hija.',
  true
)
ON CONFLICT (slug) DO NOTHING;

UPDATE public.invitations i
SET owner_user_id = u.id
FROM auth.users u
WHERE i.slug = 'xv-krystel' AND i.owner_user_id IS NULL AND lower(u.email) = 'lucyu26@hotmail.com';

UPDATE public.invitation_requests
SET status = 'completed'
WHERE contact_email = 'lucyu26@hotmail.com' AND status = 'pending';