-- Add consent field to profiles table
ALTER TABLE public.profiles
ADD COLUMN consent_given BOOLEAN DEFAULT FALSE,
ADD COLUMN consent_date TIMESTAMP WITH TIME ZONE;

-- Add comment
COMMENT ON COLUMN public.profiles.consent_given IS 'Whether the user has given consent for data processing';
COMMENT ON COLUMN public.profiles.consent_date IS 'Date when consent was given';
