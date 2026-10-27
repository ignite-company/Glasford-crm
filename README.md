# Glasford Tree Trimming | Command Center

A white and forest-green, mobile-friendly operations dashboard built for Glasford Tree Trimming.

## Pages
- **Home:** Active leads, outstanding estimates, scheduled jobs, money collected, upcoming follow-ups.
- **Leads:** Drag-and-drop pipeline (with mobile-friendly stage selectors) and contact detail drawer.
- **Follow-ups:** Visual 30-day sequence and per-lead tasks.
- **Estimates:** Create, edit, and update quote status and value.
- **Jobs & payments:** Schedule jobs, track progress, log partial and full payments, view balances.
- **Settings:** Export JSON backups, export leads as CSV, and import a JSON backup.

## Follow-up workflow
After an unanswered call, open the lead and select **No answer → follow-up**. The lead enters the Follow-up stage and the first task is due. The manual task cadence is day 0 (call + text), day 2 (call), day 4 (text), day 7 (call + voicemail), day 10 (text), day 14 (call), day 21 (text), and day 30 (final check-in). Each lead shows personalized suggested text. Mark the step **Done** when it has actually been completed. Use **Customer answered** to pause the sequence.

**Important:** This version tracks follow-up tasks. It does NOT automatically send email/SMS or place calls. Any automatic delivery must be connected separately to a verified messaging or calling provider with consent and opt-out controls.

## Data and security
This version is a functional **single-browser preview**, not a production multi-user CRM. Its records reside in the browser's localStorage and do not sync between devices or users. Do not store sensitive client records in this preview on shared or untrusted devices. Before client rollout, provision a dedicated authenticated database with permission rules, backups, and automation integration.

The first load contains **explicitly marked fictional sample records** to demonstrate the interface. Use **Clear workspace** to remove all sample records before real use. The Settings page supports exporting/importing backups.

## Development
This is a static HTML, CSS, and JavaScript app with no build step. Vercel framework preset can be set to **Other**, with output root as the project root. Git integration deploys the repository's default branch.

## Workflow verification
The following flows were exercised in an isolated test harness: initial dashboard render, navigation between all pages, lead creation, marking a missed call, activating follow-ups, completing a follow-up step, creating an estimate, creating a job, and recording a partial payment.

Built by Ignite Co.
