# Vercel Deployment

## Project Setup

1. Import this repository into Vercel and set the project Root Directory to the repository root.
2. Keep the **Next.js** framework preset. Use `npm ci` for installation and `npm run build` for the build command; leave the output directory at its default.
3. Select Node.js 22.x in **Project Settings > General > Node.js Version**.
4. Add the environment variables below in **Project Settings > Environment Variables**. Select Production and Preview for each variable needed by those deployments. Add Development as well if using Vercel's local environment pull workflow.
5. Deploy, then redeploy after changing environment variables.

Do not configure a static export. The application uses server-rendered pages and API routes for Calendar, Sheets, Drive images, administration, and CMS access. `next.config.ts` includes the event-details text source in the serverless function trace.

## Google Calendar

Add these exact names under **Project Settings > Environment Variables**:

| Name | Value |
| --- | --- |
| `GOOGLE_CALENDAR_ID` | Calendar ID from Google Calendar settings |
| `GOOGLE_CALENDAR_API_KEY` | Google API key restricted to the Google Calendar API |

Make the calendar publicly readable for API-key access. Keep both values server-side; do not rename them with a `NEXT_PUBLIC_` prefix. Redeploy after saving them.

## Avenues, Sheets, and Drive

The homepage reads event-to-avenue assignments from the `List of Events` sheet tab. Configure:

| Name | Value |
| --- | --- |
| `GOOGLE_SHEETS_EVENTS_ID` | Spreadsheet ID from its URL |
| `GOOGLE_SHEETS_EVENTS_TAB` | `List of Events` |
| `GOOGLE_DRIVE_ROOT_FOLDER_ID` | Drive folder containing one child folder per event |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | Service-account email |
| `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` | Service-account private key; preserve newlines or literal `\\n` sequences |
| `GOOGLE_PROJECT_ID` | Google Cloud project ID |
| `ADMIN_SESSION_SECRET` | A unique random value of at least 32 characters |

Share the spreadsheet and Drive folders with the service-account email. Viewer access is sufficient for reading. The sheet header must contain `Event Name` and `Avenue`; `Drive Folder Link` (also accepted as `Drive Link`) is optional and may point to an event folder or image file. A row's event name should match its Drive event-folder name if no link is provided. The images inside those event folders are shown under the assigned avenue.

`ADMIN_SESSION_SECRET` is also used to sign Drive image URLs. Drive images will not load if it is missing or shorter than 32 characters.

## Other Application Services

Set the following when those features are enabled:

- `NEXT_PUBLIC_APP_URL`: the deployed site's HTTPS URL, including the custom domain when configured.
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`: required for Supabase CMS and administrative content.
- `GOOGLE_DRIVE_GALLERY_FOLDER_ID`, `GOOGLE_DRIVE_PROJECTS_FOLDER_ID`, and `GOOGLE_DRIVE_BOD_FOLDER_ID`: folders used by the corresponding upload destinations.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `CLUB_APPLICATION_EMAIL`: email delivery for applications and contact forms.
- `OPENAI_API_KEY` and `OPENAI_MODEL`: optional hosted AI responses; the bot has a grounded local response mode without an API key.

Use Vercel's Environment Variables UI for secrets. Never commit `.env.local`, service-account keys, API keys, or admin credentials.

## Verify

After deployment, check the deployed home page, `/events`, `/calendar`, and `/gallery`. The Calendar API is `/api/calendar`, and the avenue imagery endpoint is `/api/avenues`. Use the admin integration diagnostics to verify Google, Supabase, email, and AI connections. A successful build alone does not prove that Vercel's environment variables or Google sharing permissions are correct.
