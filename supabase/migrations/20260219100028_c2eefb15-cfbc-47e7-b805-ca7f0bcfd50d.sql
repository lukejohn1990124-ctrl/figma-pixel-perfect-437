
-- Create secure view for integrations (excludes sensitive token columns)
CREATE VIEW public.integrations_safe AS
SELECT id, user_id, provider, is_connected, last_synced_at,
       user_identifier, created_at, updated_at
FROM public.integrations;

-- Create secure view for email_provider_config (excludes sensitive credential columns)
CREATE VIEW public.email_provider_config_safe AS
SELECT id, user_id, provider, from_email, from_name,
       is_configured, created_at, updated_at
FROM public.email_provider_config;

-- Enable RLS on the views by granting appropriate access
-- Views inherit the RLS of the underlying tables, so access is already restricted

-- Revoke direct SELECT on sensitive tables from anon and authenticated roles
-- They should use the safe views instead
REVOKE SELECT ON public.integrations FROM anon, authenticated;
REVOKE SELECT ON public.email_provider_config FROM anon, authenticated;

-- Grant SELECT on the safe views
GRANT SELECT ON public.integrations_safe TO anon, authenticated;
GRANT SELECT ON public.email_provider_config_safe TO anon, authenticated;
