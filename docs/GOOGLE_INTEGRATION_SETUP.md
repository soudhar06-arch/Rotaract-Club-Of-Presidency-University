# RCPU Website — Official Google Workspace Integration Setup Guide

This guide provides step-by-step instructions to connect **Google Sheets API** and **Google Drive API** with the Rotaract Club of Presidency University (RCPU) Website and Admin Secretariat.

---

## 1. Google Cloud Console Setup

### Step A: Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Click on the project dropdown at the top bar and select **New Project**.
3. Name your project (e.g. `rcpu-website-cloud`) and click **Create**.

### Step B & C: Enable Google APIs
1. In your project dashboard, navigate to **APIs & Services > Library**.
2. Search for **Google Sheets API**, click on it, and click **Enable**.
3. Return to the Library, search for **Google Drive API**, click on it, and click **Enable**.

---

## 2. Google Service Account Setup

### Step D & E: Create a Service Account
1. Go to **APIs & Services > Credentials** in the Cloud Console.
2. Click **Create Credentials** at the top and choose **Service Account**.
3. Fill in the details:
   - **Service account name**: `rcpu-website-service-account`
   - **Service account ID**: `rcpu-website-service-account`
4. Click **Create and Continue**, grant optional role if needed, and click **Done**.
5. Copy the generated **Service Account Email** (e.g., `rcpu-website-service-account@rcpu-website-cloud.iam.gserviceaccount.com`).

### Step F: Generate JSON Private Key
1. Under **Credentials > Service Accounts**, click on your newly created Service Account email.
2. Navigate to the **Keys** tab at the top.
3. Click **Add Key > Create new key**.
4. Choose **JSON** as the key type and click **Create**.
5. The private key `.json` file will automatically download to your computer.
   > ⚠️ **CRITICAL SECURITY NOTE**: Never commit this downloaded `.json` file to GitHub or public source control. Keep it stored securely.

---

## 3. Resource Sharing & Permission Setup

### Step H & J: Google Sheets Configuration
1. Open your target Google Spreadsheet (e.g., Membership Responses, Projects Archive, or BOD Roster).
2. Click the **Share** button in the top right corner.
3. Paste your **Service Account Email**:
   `rcpu-website-service-account@rcpu-website-cloud.iam.gserviceaccount.com`
4. Assign **Viewer** access (read-only) and click **Send**.
5. Copy the **Spreadsheet ID** from your browser URL:
   `https://docs.google.com/spreadsheets/d/`**`1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`**`/edit`
   - The Spreadsheet ID is the string between `/d/` and `/edit`.

### Step I & K: Google Drive Folder Configuration
1. Open your target Google Drive folder (e.g. `RCPU Project Gallery`).
2. Click the folder name dropdown > **Share**.
3. Add your **Service Account Email** and assign **Editor / Content Manager** access (so the website can upload images).
4. Copy the **Drive Folder ID** from your browser URL:
   `https://drive.google.com/drive/folders/`**`1a2b3c4d5e6f7g8h9i0j`**
   - The Folder ID is the string following `/folders/`.

---

## 4. Environment Variables Configuration

### Step L: Configure Local Environment (`.env.local`)
Add the following variables to your local `c:\Users\soudh\rotaract-website\.env.local` file:

```env
# ===============================================================
# GOOGLE SERVICE ACCOUNT CREDENTIALS (SERVER-ONLY)
# DO NOT PREFIX WITH NEXT_PUBLIC_
# ===============================================================
GOOGLE_SERVICE_ACCOUNT_EMAIL="rcpu-website-service-account@rcpu-website-cloud.iam.gserviceaccount.com"
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_PROJECT_ID="rcpu-website-cloud"

# ===============================================================
# GOOGLE SHEETS LIVE COUNTER SOURCES
# ===============================================================
GOOGLE_SHEETS_MEMBERSHIP_ID="YOUR_MEMBERSHIP_SHEET_ID"
GOOGLE_SHEETS_PROJECTS_ID="YOUR_PROJECTS_SHEET_ID"
GOOGLE_SHEETS_BOD_ID="YOUR_BOD_SHEET_ID"

GOOGLE_SHEETS_MEMBERSHIP_TAB="Form Responses 1"
GOOGLE_SHEETS_PROJECTS_TAB="Projects"
GOOGLE_SHEETS_BOD_TAB="BOD"

# ===============================================================
# GOOGLE DRIVE MEDIA FOLDERS
# ===============================================================
GOOGLE_DRIVE_ROOT_FOLDER_ID="YOUR_ROOT_DRIVE_FOLDER_ID"
GOOGLE_DRIVE_PROJECTS_FOLDER_ID="YOUR_PROJECTS_DRIVE_FOLDER_ID"
GOOGLE_DRIVE_GALLERY_FOLDER_ID="YOUR_GALLERY_DRIVE_FOLDER_ID"
GOOGLE_DRIVE_BOD_FOLDER_ID="YOUR_BOD_DRIVE_FOLDER_ID"
```

> **Formatting Tip**: When copying the `client_email` and `private_key` from your JSON key file into `.env.local`, ensure multiline newlines in the private key are preserved as `\n` or wrapped inside double quotes.

---

### Step M: Configure Production Deployment (Vercel)
1. Open your project on the [Vercel Dashboard](https://vercel.com).
2. Go to **Settings > Environment Variables**.
3. Add each environment variable listed above for Production and Preview environments.
4. Trigger a **Redeploy** so the new server-side environment variables take effect.

---

## 5. Testing & Troubleshooting Diagnostics

### Step N: Live Connection Diagnostics
1. Log in to the Admin Portal at `/admin/login` using your Secretariat credentials.
2. Navigate to the **Admin Dashboard** (`/admin/dashboard`).
3. View the **Google Sheets & Google Drive Integration Status** panel.
4. Click **Re-test Connections**.

### Step O: Common Error Troubleshooting

| Error Status | Meaning | Solution |
| :--- | :--- | :--- |
| `NOT CONFIG` | Variable missing in `.env.local` | Copy the Sheet ID / Drive Folder ID into your `.env.local` file and restart server. |
| `AUTHENTICATION FAILED` | Invalid Service Account key | Verify `GOOGLE_SERVICE_ACCOUNT_EMAIL` and `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY` formatting. |
| `PERMISSION DENIED` | Service Account lacks permissions | Click **Share** on your Sheet or Drive folder and grant access to your Service Account email. |
| `RESOURCE NOT FOUND` | Sheet / Folder ID does not exist | Double-check that the ID string was correctly copied from the Google URL. |
