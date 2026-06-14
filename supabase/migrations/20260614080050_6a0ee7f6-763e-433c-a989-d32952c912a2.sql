ALTER TABLE public.invitation_requests
  ADD CONSTRAINT invitation_requests_contact_name_len CHECK (char_length(contact_name) BETWEEN 1 AND 200),
  ADD CONSTRAINT invitation_requests_contact_email_len CHECK (char_length(contact_email) BETWEEN 3 AND 320),
  ADD CONSTRAINT invitation_requests_contact_phone_len CHECK (char_length(contact_phone) BETWEEN 3 AND 40),
  ADD CONSTRAINT invitation_requests_couple_names_len CHECK (char_length(couple_names) BETWEEN 1 AND 200),
  ADD CONSTRAINT invitation_requests_package_tier_len CHECK (char_length(package_tier) BETWEEN 1 AND 50),
  ADD CONSTRAINT invitation_requests_payload_size CHECK (pg_column_size(payload) < 20000);