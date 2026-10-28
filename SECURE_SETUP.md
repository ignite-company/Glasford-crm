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

## Activation: email/password without SMTP

Email/password authentication is already active on Ignite's Supabase project. There is no requirement for an outgoing SMTP setup or magic-link redirect for this temporary login method.

1. In the Ignite Supabase Dashboard, open **Authentication > Users > Add user**.
2. Select **Create new user** rather than **Send invite**. Use the verified Glasford customer email, set a random temporary password, and mark the email as confirmed if the form asks. Do not place the password in source control or chat history.
3. Share the one-time temporary password directly via a private channel. The customer signs in at `https://glasford-crm.vercel.app` and changes their password immediately using the CRM **Settings > Change your password** form.
4. Confirm the customer can see an empty workspace, add a lead on phone, see it on desktop, and update a job.
5. Verify an unrelated email account cannot access `glasford_workspace`. Do not add the customer to the Supabase project organization or Vercel team.
6. Update **Vercel Deployment Protection** from all to preview-only *after* the authenticated login page is deployed and verified. The CRM's own Supabase auth and RLS are the customer security layer.
7. Confirm Ignite's other CRM and client apps remain functional. The existing contact@ignitellc.co admin user is allowlisted for Glasford, and may use its current Supabase password.

If the customer forgets the password before SMTP is set up, the Supabase admin can reset it in the dashboard. Do not disable email confirmations for the entire shared Ignite project.

## Status

- Glasford isolated database schema and workspace: created.
- Approved-user allowlist: created.
- Mobile login and shared-record code: staged on GitHub.
- Production deployment: pending (do not claim that an untested user account was created).
- Customer Auth user: still needs to be created through Supabase Dashboard.

## After the client's final payment

The Ignite Supabase **project cannot be transferred to Glasford**, because it also hosts Ignite's other clients and internal tools. Transfer **only Glasford's schema and data**:

1. Ask Glasford to create his own Supabase organization and new project.
2. Apply the same `supabase/glasford_setup.sql` on the new project, and create private approved email entries there.
3. Export/import the single `public.glasford_workspace` row (and any later Glasford-specific tables only). Recreate RLS, grants, and realtime settings.
4. Configure the new project's Auth and verified SMTP/redirects. Have Glasford and Ignite log in to the **new** Auth tenant. Existing Ignite Auth sessions do not automatically transfer. No shared auth.users or Ignite customer data should be copied.
5. Update `config.js` to the new project URL and publishable key; deploy, test data counts and operations, then disable access to the old Glasford workspace on Ignite and archive/clean up the old row after verifying cutover.
6. Transfer the Vercel project/repository only if explicitly included in the agreement; that is separate from data migration. Prefer keeping the app code under Ignite management if maintenance continues.

This approach keeps Ignite in control during implementation and makes the client's later migration isolated and auditable.
