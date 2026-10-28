# Glasford CRM: temporary Ignite hosting and client handover

## Current status

A separate, RLS-protected Glasford workspace was created in the existing **Ignite Client Hub Supabase project** (project ref `ujvuqbgheewbyvfusqvz`), and the database migration was applied successfully on October 28, 2026.

The working CRM has cloud sign-in and snapshot synchronization staged on GitHub in `feature/secure-shared-crm`. **Production is not deployed and a client login has not yet been tested.** Do not claim customer access is active.

## Temporary hosting

- Only a new `public.glasford_workspace` row/table and `glasford_private` schema/function/member allowlist were added; unrelated Ignite tables were left unchanged.
- Workspace is empty by design; fictional browser preview records must never automatically enter production.
- Only the approved customer email and Ignite admin email were added to the private allowlist using a privileged SQL operation. Do not commit those email strings in this public GitHub repository.
- RLS uses a server-side verified Supabase `auth.users` email and approved allowlist. Nonmembers do not receive permissions to Glasford data.
- The browser uses the **publishable** key (not a secret). All personal CRM data must be protected by the database RLS and not hidden only by the frontend.
- Record changes sync through Supabase Realtime and refresh-on-focus. Simultaneous conflicting saves are rejected using a workspace revision.

## Steps required BEFORE production

1. **Configure Supabase Auth redirect URLs** under the Ignite Supabase project Authentication settings: add `https://glasford-crm.vercel.app/**` and keep existing Ignite redirect URLs intact. Set any needed SMTP sender settings without disrupting existing Ignite user logins.
2. **Configure production email delivery** for the Supabase project if not already configured (custom SMTP is necessary for reliably sending email sign-in links to outside clients).
3. Confirm the Glasford customer can receive an email magic link and reach the CRM with a valid session. Verify an unrelated email cannot see or edit records.
4. Test mobile lead creation, estimates, jobs, payments, follow-ups, persistence on two devices, changing records and conflict warning. Check all current Ignite apps remain functional.
5. Vercel currently has team SSO protection enabled on the Glasford project. Ensure client access to the **application's own authentication screen** without granting project-level Vercel access, only once app login security is functioning.
6. Merge the PR and deploy production after all checks. Do not expose a broken or bypassable login to a client.

## After the client's final payment

The Ignite Supabase **project cannot be transferred to Glasford**, because it also hosts Ignite's other clients and internal tools. Transfer **only Glasford's schema and data**:

1. Ask Glasford to create his own Supabase organization and new project.
2. Apply the same `supabase/glasford_setup.sql` on the new project, and create private approved email entries there.
3. Export/import the single `public.glasford_workspace` row (and any later Glasford-specific tables only). Recreate RLS, grants, and realtime settings.
4. Configure the new project's Auth and verified SMTP/redirects. Have Glasford and Ignite log in to the **new** Auth tenant. Existing Ignite Auth sessions do not automatically transfer. No shared auth.users or Ignite customer data should be copied.
5. Update `config.js` to the new project URL and publishable key; deploy, test data counts and operations, then disable access to the old Glasford workspace on Ignite and archive/clean up the old row after verifying cutover.
6. Transfer the Vercel project/repository only if explicitly included in the agreement; that is separate from data migration. Prefer keeping the app code under Ignite management if maintenance continues.

This approach keeps Ignite in control during implementation and makes the client's later migration isolated and auditable.
