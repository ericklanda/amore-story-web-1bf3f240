DROP POLICY IF EXISTS "Anyone can insert rsvps" ON public.rsvps;
DROP POLICY IF EXISTS "Anyone can submit a request" ON public.invitation_requests;
DROP POLICY IF EXISTS "Public read invitation-photos" ON storage.objects;
CREATE POLICY "Owners/admins read invitation-photos" ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'invitation-photos' AND (public.has_role(auth.uid(), 'admin'::public.app_role) OR EXISTS (SELECT 1 FROM public.invitations i WHERE i.slug = split_part(objects.name, '/', 1) AND i.owner_user_id = auth.uid())));

CREATE OR REPLACE FUNCTION public.handle_new_user_claim()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.invitations SET owner_user_id = NEW.id
  WHERE lower(owner_email) = lower(NEW.email) AND owner_user_id IS NULL;
  RETURN NEW;
END;
$function$;