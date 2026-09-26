# Environment and Google setup

Put credentials in `.env.local` in the repository root, beside `package.json`. Start by copying `.env.example`. The `.env.local` file is ignored by Git and must never be committed.

## Google Cloud

1. Create or select a Google Cloud project.
2. Enable **Google Drive API**, **Google Sheets API**, and **Google Calendar API**.
3. Under **APIs & Services > Credentials**, create a service account. Copy its email into `GOOGLE_SERVICE_ACCOUNT_EMAIL`.
4. Create a JSON key for that service account. Copy `project_id` into `GOOGLE_PROJECT_ID` and `private_key` into `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`. Keep the value in double quotes and keep the JSON key's literal `\n` sequences; do not paste the whole JSON file.
5. Create an API key and restrict it to the Google Calendar API. Put it in `GOOGLE_CALENDAR_API_KEY`.

The website does not need the downloaded JSON key file after these three fields have been copied. Keep or delete that file securely outside the repository.

## Drive folders

Share every configured folder with the service-account email. Viewer access is enough for reading. Uploads require a folder in a Google Workspace **Shared Drive** and the service account needs **Content manager** access; a service account cannot upload into its own My Drive quota.

Use this structure for the event archive:

```text
Event archive root/                 -> GOOGLE_DRIVE_ROOT_FOLDER_ID
  Event name one/
    photo-1.jpg
    photo-2.jpg
  Event name two/
    photo-1.jpg
```

Each direct child folder becomes one historical event and its images become that event's gallery. The other folder variables are upload destinations for project, gallery, and board images. Copy only the folder ID from a URL such as `https://drive.google.com/drive/folders/FOLDER_ID`.

## Sheets

Share each spreadsheet with the service-account email. Viewer access supports counters and reads; Editor access is required when `PROJECTS_DATA_SOURCE=sheets` or `BOD_DATA_SOURCE=sheets` because the admin dashboard then writes to those sheets.

Copy the spreadsheet ID from `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit` and enter the tab name exactly, including spaces and capitalization.

The BOD sheet needs `id`, `name`, and `role` headers. Supported columns are `id`, `name`, `role`, `category`, `bio`, `quote`, `image`, `instagram`, `linkedin`, `email`, `displayOrder`, and `isActive`.

The projects sheet needs `id`, `title`, and `category` headers. Supported columns are `id`, `title`, `slug`, `category`, `date`, `time`, `venue`, `platform`, `shortDescription`, `fullDescription`, `objective`, `coverImage`, `images`, `featured`, `published`, `participants`, `beneficiaries`, `volunteers`, and `collaborators`. Array values can be JSON arrays or values separated by `|`.

Keep `BOD_DATA_SOURCE=cms` and `PROJECTS_DATA_SOURCE=cms` if Supabase is authoritative. Change either value to `sheets` only when the corresponding sheet should be edited directly by the admin dashboard.

The homepage avenues read event-to-avenue assignments from the `List of Events` tab. Set `GOOGLE_SHEETS_EVENTS_ID` to its spreadsheet ID and `GOOGLE_SHEETS_EVENTS_TAB=List of Events`. Share the spreadsheet with the service account as a Viewer. The header row needs `Event Name` and `Avenue`; optionally add `Drive Folder Link` (also accepted as `Drive Link`) with a link to that event's Drive folder or an image file. If the link is omitted, the event name is matched to a child folder under `GOOGLE_DRIVE_ROOT_FOLDER_ID`. Folder contents supply the avenue carousel and detail imagery. Use one of the six website avenue names in the Avenue column.

## Finish and verify

Restart `npm run dev` after editing `.env.local`; Next.js reads environment variables when the server starts. Sign in at `/admin/login`, open **Dashboard**, and run the integration diagnostics. It checks each Calendar, Drive, Sheets, database, AI, and email connection separately and reports the exact missing permission or identifier.
