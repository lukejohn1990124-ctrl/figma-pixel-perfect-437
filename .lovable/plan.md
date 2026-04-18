
The user authorized PayPal but landed on `/dashboard` (not `/connections` or `/connections/paypal/callback`). This means PayPal's app Return URL is set to `/dashboard`, so the OAuth `?code=` arrives there and nothing handles it.

Two issues:
1. `/dashboard` doesn't read the `?code=` param.
2. Even if we add handling on `/dashboard`, the `redirect_uri` passed to PayPal during token exchange must EXACTLY match the one registered/used at authorize time. Currently `handleConnectPayPal` sends `${origin}/connections/paypal/callback` as `redirect_uri`, but PayPal is redirecting to `/dashboard` — meaning PayPal's app config overrides ours OR the user manually changed it.

Robust fix: make the OAuth callback handler universal — detect `?code=` on ANY landing page (Dashboard, Connections, Callback) and reconstruct the exact `redirect_uri` PayPal used (which is `window.location.origin + window.location.pathname` at the moment of callback). Also send the SAME `redirect_uri` when first generating the auth URL by storing it in sessionStorage, so token exchange matches.

## Plan

1. **Create `src/hooks/usePayPalOAuthCallback.tsx`** — a reusable hook that:
   - Reads `?code=` / `?error=` / `?state=` from URL
   - Reads stored `redirect_uri` from sessionStorage (saved when Connect was clicked)
   - Calls `paypal-oauth` with `action: exchange_code` using stored URI
   - Shows toast, cleans URL params, optionally calls a refresh callback
   - Uses ref to run once

2. **Update `src/pages/Connections.tsx`**:
   - Replace inline OAuth handling with the hook
   - Save `redirect_uri` to sessionStorage before redirecting to PayPal
   - Use current registered URI: `${origin}/connections` (most likely registered)

3. **Update `src/pages/Dashboard.tsx`**: mount the hook so if PayPal redirects there, the code is exchanged and a toast shown, then user can navigate to Connections.

4. **Tell the user**: in PayPal Developer Dashboard → app → set Return URL to exactly `https://figma-pixel-perfect-437.lovable.app/connections` (and remove `/dashboard` if present). The new code will tolerate either, but matching is cleaner.

5. **Verify** by reconnecting end-to-end.

Files touched:
- `src/hooks/usePayPalOAuthCallback.tsx` (new)
- `src/pages/Connections.tsx`
- `src/pages/Dashboard.tsx`
