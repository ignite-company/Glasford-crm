# Glasford Tree Trimming | Command Center

A white and forest-green, mobile-friendly operations dashboard built for Glasford Tree Trimming.

## Pages
- **Home:** Today’s schedule, customers needing attention, upcoming jobs, outstanding quotes, and money collected.
- **Leads:** Desktop drag-and-drop board, simplified mobile lead list, fast stage changes, and a contact details drawer.
- **Calendar:** Month view with selectable dates and an agenda for each day. Includes job times, assigned crews, on-site estimates, and assigned estimators. Tap an item to edit it. Start and complete scheduled jobs directly from the agenda.
- **Follow-ups:** Visual 30-day sequence and per-lead tasks.
- **Estimates:** Create and update quotes, optionally schedule the on-site visit and assign an estimator.
- **Jobs & payments:** Record job dates, arrival times, assigned crews, progress status, deposits and payments.
- **Settings:** Accessible from Home. Export JSON backups, export leads as CSV, and import a JSON backup.

## Follow-up workflow
After an unanswered call, open the lead and select **No answer → follow-up**. The lead enters the Follow-up stage and the first task is due. The manual task cadence is day 0 (call + text), day 2 (call), day 4 (text), day 7 (call + voicemail), day 10 (text), day 14 (call), day 21 (text), and day 30 (final check-in). Each lead shows personalized suggested text. Mark the step **Done** when it has actually been completed. Use **Customer answered** to pause the sequence.

**Important:** This version tracks follow-up tasks. It does NOT automatically send email/SMS or place calls. Any automatic delivery must be connected separately to a verified messaging or calling provider with consent and opt-out controls.

## Data and security
This version is a functional **single-browser preview**, not a production multi-user CRM. Its records reside in the browser's localStorage and do not sync between devices or users. Do not store sensitive client records in this preview on shared or untrusted devices. Before client rollout, provision a dedicated authenticated database with permission rules, backups, and automation integration.

The first load contains **explicitly marked fictional sample records** to demonstrate the interface. Use **Clear workspace** to remove all sample records before real use. The Settings page supports exporting/importing backups.

## Development
This is a static HTML, CSS, and JavaScript app with no build step. Vercel framework preset can be set to **Other**, with output root as the project root. Git integration deploys the repository's default branch.

## Workflow verification
The following flows were exercised in an isolated test harness: initial dashboard render, balanced HTML markup across all pages, navigation, calendar month and day selection, scheduling an estimate visit, scheduling a job with assigned crew, moving a job from scheduled to in progress to complete, lead follow-up, and recording a partial payment. Tests were simulated in code, not run on physical iOS/iPadOS devices.

Built by Ignite Co.
