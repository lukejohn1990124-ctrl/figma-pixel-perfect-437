
The user signed in to PayPal sandbox but landed back at `/connections` with no "connected" indicator. The expected flow is PayPal → `/connections/paypal/callback` → exchange code → redirect to `/paypal`. Since they ended on `/connections`, the callback route likely never fired, OR it fired but the exchange failed silently, OR the redirect URI in the PayPal app is set to `/connections` instead of `/connections/paypal/callback`.

Looking at edge function logs: only Boot/Shutdown events — no actual invocation logs for `paypal-oauth` exchange_code. This strongly suggests PayPal redirected to `/connections` (not `/connections/paypal/callback`), so the callback page never ran and no exchange happened.

Root cause: the PayPal sandbox app's Return URL is set to `/connections` instead of `/connections/paypal/callback`. We can fix this two ways:
1. User updates the Return URL in PayPal dashboard
2. We make `/connections` itself detect a `?code=` param and handle the exchange (more robust — works regardless of which URL is registered)

Option 2 is more user-friendly. I'll do both: handle the code on `/connections` AND keep the dedicated callback route as a backup.

## Plan

1. **Update `src/pages/Connections.tsx`** to:
   - On mount, check `useSearchParams` for `?code=` and `?state=`
   - If present, call `paypal-oauth` with `action: exchange_code` using `${origin}/connections` as `redirect_uri`
   - Show a loading toast, then success/error toast
   - Clean URL params and reload integration list to show connected state
   - Keep existing connect/disconnect/sync logic unchanged

2. **Update `supabase/functions/paypal-oauth/index.ts`** — no changes needed; it already accepts any redirect_uri the client passes.

3. **Tell the user** to also add `/connections` as a valid Return URL in their PayPal app (or alternatively fix it to `/connections/paypal/callback`). Either now works.

4. **Verify** by clicking Connect → authorize → land on `/connections` → see green checkmark + "Connected as ..." + sync button.

Files touched:
- `src/pages/Connections.tsx` (handle inline OAuth callback)

No DB or edge function changes required.
