# Secure Glasford CRM rollout

This branch prepares secure mobile login, authenticated shared data and backups without altering the current live browser preview.

## Rollout blocker

On October 28, 2026, creating a dedicated Glasford Supabase project was blocked by the owner's **two active free project limit**. The existing Ignite Client Hub and Jamrock projects are both active and must not be paused or deleted without explicit authorization.

**Next action:** obtain another project slot via a plan change or approved account arrangement. Then create a dedicated project in us-east-1. Never store Glasford data in an unrelated client's project without explicit permission.

## Setup

1. Create the separate Supabase project.
2. Apply `supabase/glasford_setup.sql` to that project.
3. In Supabase SQL editor, insert the verified Glasford owner and Ignite administrator login email addresses into `glasford_private.approved_users`. Do not put the real addresses in GitHub. The SQL file includes the insert template with placeholders.
4. In Authentication > URL Configuration, set Site URL to `https://glasford-crm.vercel.app` and allow `https://glasford-crm.vercel.app/**`.
5. Configure **custom SMTP** in Supabase Auth. The built-in SMTP does not deliver authentication emails to a client who is not part of the Supabase organization's team. Verify sender SPF/DKIM and test email delivery.
6. Fill public `config.js` with the dedicated project URL and publishable key. Never use a secret or service-role key in browser code.
7. Test a permitted login on phone and desktop, a nonmember's denied read/update, lead editing, estimates, jobs, payments, concurrent write conflict behavior, and session sign-out.
8. Review Vercel deployment protection. Only after the dedicated Auth setup works, disable any Vercel team-login prompt that blocks the client from reaching the CRM.
9. Merge/deploy after testing. Do not automatically import fictional preview records. If necessary, export a real backup and restore it intentionally.

## Design

The client has a single JSON workspace row protected by Row Level Security. Authorized users are stored in an unexposed private schema, checked by a narrowly scoped security-definer function. Records update with a revision check to avoid silent overwrites. Changes from another device trigger realtime refresh, supplemented by checks on focus. Automatic calling and texting are not included.

**Do not merge to production until the database, SMTP, Auth URL configuration and client testing are complete.**
