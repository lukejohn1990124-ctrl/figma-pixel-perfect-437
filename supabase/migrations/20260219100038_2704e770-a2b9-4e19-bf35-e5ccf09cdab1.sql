
-- Recreate views with SECURITY INVOKER to respect RLS of the querying user
DROP VIEW IF EXISTS public.integrations_safe;
DROP VIEW IF EXISTS public.email_provider_config_safe;

CREATE VIEW public.integrations_safe
WITH (security_invoker = true) AS
SELECT id, user_id, provider, is_connected, last_synced_at,
       user_identifier, created_at, updated_at
FROM public.integrations;

CREATE VIEW public.email_provider_config_safe
WITH (security_invoker = true) AS
SELECT id, user_id, provider, from_email, from_name,
       is_configured, created_at, updated_at
FROM public.email_provider_config;

-- Re-grant SELECT on the safe views
GRANT SELECT ON public.integrations_safe TO anon, authenticated;
GRANT SELECT ON public.email_provider_config_safe TO anon, authenticated;
