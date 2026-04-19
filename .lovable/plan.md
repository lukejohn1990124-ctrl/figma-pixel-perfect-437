
PayPal returns "invalid client_id or redirect_uri". The client_id matches what was configured, so the issue is the redirect_uri. PayPal requires the **exact** redirect_uri (the "Return URL") to be registered in the app's "Log in with PayPal" settings — not just whitelisted as a generic Return URL.

Two common causes:
1. The Return URL registered in the PayPal app doesn't exactly match `https://figma-pixel-perfect-437.lovable.app/connections` (trailing slash, http vs https, www, or different path).
2. The "Log in with PayPal" feature isn't enabled on the app, or the required scopes (openid, profile, email, invoicing) aren't checked. Without "Log in with PayPal" enabled, the `/connect` endpoint rejects the client_id.

## Fix (user action in PayPal Developer Dashboard)

Go to developer.paypal.com → Apps & Credentials → Sandbox → open the app with client_id starting `Af8gOHUyk...`:

1. Scroll to **"Log in with PayPal"** → click the checkbox to enable it → click **Advanced Settings**.
2. Under **Return URL**, enter exactly: `https://figma-pixel-perfect-437.lovable.app/connections` (no trailing slash, https, exact case).
3. Check the scopes: **Full Name**, **Email**, and any "Personal info" needed.
4. Save.
5. Also confirm under app features: **Invoicing** is enabled.
6. Wait ~30 seconds for PayPal to propagate, then retry Connect.

## Code-side safety improvement

To make the client send a redirect_uri that always matches what's registered, no change is strictly required — `${origin}/connections` already produces the correct URL on production. But to be defensive against preview vs production domains, I'll:

1. **Add a constant `PAYPAL_REDIRECT_URI`** in `src/pages/Connections.tsx` that uses the published domain explicitly when running on a Lovable preview subdomain, so the URI sent to PayPal always matches what's registered (`https://figma-pixel-perfect-437.lovable.app/connections`). Otherwise use `${origin}/connections`.

2. Pass this same constant to both `get_auth_url` and `savePayPalRedirectUri`, so the token exchange uses the identical value.

Files touched:
- `src/pages/Connections.tsx` (compute canonical redirect URI)

No DB or edge function changes.

After the user updates the PayPal app settings, the Connect flow should land on PayPal's consent screen (not the error), then redirect back with `?code=`, which the existing `usePayPalOAuthCallback` hook will exchange.
