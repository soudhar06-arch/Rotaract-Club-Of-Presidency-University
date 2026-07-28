# HANDOVER_GUIDE.md

> **This guide is for future Rotaract Webmasters.** The original developer has graduated. Follow this guide to maintain and update the website without needing the original developer.

---

## Table of Contents
1. [How to Run the Project](#how-to-run-the-project)
2. [How to Deploy](#how-to-deploy)
3. [How to Update Events](#how-to-update-events)
4. [How to Update BOD](#how-to-update-bod)
5. [How to Upload Photos](#how-to-upload-photos)
6. [How to Manage AI Documents](#how-to-manage-ai-documents)
7. [How to Create New Admins](#how-to-create-new-admins)
8. [How to Troubleshoot Common Issues](#how-to-troubleshoot-common-issues)

---

## How to Run the Project

### Prerequisites
- **Node.js** v18+ installed ([Download here](https://nodejs.org/))
- **npm** or **yarn** package manager
- **Git** installed
- A code editor (VS Code recommended)

### Step 1: Clone the Repository
`ash
git clone <repository-url>
cd rotaract-website
`

### Step 2: Install Dependencies
`ash
npm install
`

### Step 3: Set Up Environment Variables
1. Copy .env.example to .env.local:
   `ash
   cp .env.example .env.local
   `
2. Fill in the values in .env.local:
   - Get Supabase credentials from the Supabase dashboard
   - Get OpenAI API key from the OpenAI platform

### Step 4: Set Up the Database
`ash
npx prisma migrate deploy
npx prisma db seed  # Optional: seed initial data
`

### Step 5: Run the Development Server
`ash
npm run dev
`
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Useful Commands
| Command | Description |
|---------|-------------|
| 
pm run dev | Start development server |
| 
pm run build | Build for production |
| 
pm run start | Start production server |
| 
px prisma studio | Open database browser |
| 
px prisma migrate dev | Create and apply a new migration |
| 
px prisma db seed | Seed the database with initial data |

---

## How to Deploy

### Option A: Deploy to Vercel (Recommended)
1. Push your code to GitHub.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Add environment variables in the Vercel dashboard (same as .env.local).
4. Click **Deploy**.
5. Vercel will automatically build and deploy your site.

### Option B: Deploy to Netlify
1. Push your code to GitHub.
2. Go to [Netlify](https://www.netlify.com/) and import the repository.
3. Build command: 
pm run build
4. Publish directory: .next
5. Add environment variables in the Netlify dashboard.

### Post-Deployment Checklist
- [ ] Visit the live site and verify all pages load.
- [ ] Test the admin login at /dashboard/login.
- [ ] Test file uploads in the admin panel.
- [ ] Test the AI chatbot.
- [ ] Verify SSL certificate is active (HTTPS).

---

## How to Update Events

### Via Admin Dashboard
1. Go to /dashboard/login and sign in.
2. Click **Events** in the sidebar.
3. To create a new event: Click **Create Event**, fill in the form, and click **Save**.
4. To edit an event: Click the **Edit** icon next to the event.
5. To delete an event: Click the **Delete** icon and confirm.

### Important Fields
| Field | Description |
|-------|-------------|
| Title | Name of the event |
| Description | Full details (use the rich text editor) |
| Date | Event date |
| Time | Start time |
| Location | Where the event takes place |
| Cover Image | Upload a photo for the event |
| Status | Set to **Published** to show on the public site |

### Tips
- Upload images under 2MB for faster loading.
- Use the **Save as Draft** option if the event is not ready to be published.
- Events appear on the public site at /events only when status is **Published**.

---

## How to Update BOD

### Via Admin Dashboard
1. Go to /dashboard/login and sign in.
2. Click **BOD** in the sidebar.
3. To add a new member: Click **Create Member**, fill in the form, and click **Save**.
4. To edit a member: Click the **Edit** icon.
5. To remove a member: Click the **Delete** icon and confirm.

### Important Fields
| Field | Description |
|-------|-------------|
| Name | Full name of the member |
| Role | Position (e.g., President, Secretary, Treasurer) |
| Bio | Short biography (1-2 sentences) |
| Email | Contact email (optional) |
| LinkedIn URL | Link to their LinkedIn profile (optional) |
| Photo | Profile picture (square, recommended) |
| Term Start / End | Dates of their term |
| Sort Order | Lower numbers appear first |
| Active | Uncheck if they are no longer on the board |

### Tips
- Use the **Sort Order** field to arrange members (President first, etc.).
- Set **Active** to false for past members (they will not appear on the public site).
- Keep photos consistent (same background, professional headshots look best).

---

## How to Upload Photos

### To the Gallery
1. Go to /dashboard/login and sign in.
2. Click **Gallery** in the sidebar.
3. Click **Create Album** or **Edit** an existing album.
4. Drag and drop photos into the upload zone, or click to browse.
5. Reorder photos by dragging.
6. Set a cover image by clicking the star icon on a photo.
7. Click **Save**.

### To Events
1. When creating or editing an event, use the **Cover Image** upload field.
2. You can also upload additional event photos in the **Event Images** section.

### To BOD Profiles
1. When creating or editing a BOD member, use the **Photo** upload field.

### To Awards
1. When creating or editing an award, use the **Photo** upload field.

### To Collaborations
1. When creating or editing a collaboration, use the **Logo** upload field.

### Image Guidelines
- **Formats**: JPG, PNG, WebP
- **Max size**: 10MB per file
- **Recommended dimensions**:
  - Cover images: 1920x1080px (16:9)
  - Gallery photos: 1200x800px or larger
  - Profile photos: 400x400px (square)
- **Compression**: Images are automatically compressed and converted to WebP for web use.

---

## How to Manage AI Documents

### Upload a Document
1. Go to /dashboard/login and sign in.
2. Click **AI Knowledge Base** in the sidebar.
3. Click **Upload Document**.
4. Drag and drop a file or click to browse.
5. Enter a title and optional description.
6. Click **Upload**.

### Supported File Types
- PDF (.pdf)
- Word (.docx)
- Text (.txt)
- Markdown (.md)

### Processing
- After upload, the document status will show as **Processing**.
- The system extracts text, splits it into chunks, creates embeddings, and stores them.
- This usually takes a few seconds to a minute depending on file size.
- Once complete, the status changes to **Ready**.
- If processing fails, click **Retry**.

### Managing Documents
- **View**: See document title, filename, status, chunk count, and upload date.
- **Delete**: Click the delete icon to remove a document (this also removes all its chunks).
- **Retry**: Click the retry icon for failed documents.

### Tips
- Upload official club documents: handbooks, meeting minutes, event guidelines, membership information.
- Keep documents up-to-date. If a document changes, delete the old version and upload the new one.
- The chatbot can only answer questions based on uploaded documents. If it does not know the answer, upload the relevant document.

---

## How to Create New Admins

### Prerequisite
You must be logged in as a **Super Admin** to create new admin accounts.

### Steps
1. Go to /dashboard/settings (if available) or use Supabase dashboard.
2. In Supabase, go to **Authentication** > **Users**.
3. Click **Add User** > **Create new user**.
4. Enter the email and a temporary password.
5. After the user is created, go to the **User** table in Prisma Studio or Supabase SQL Editor.
6. Update the user's role:
   `sql
   UPDATE  User SET role = 'admin' WHERE email = 'newadmin@example.com';
   `
   Or for an editor:
   `sql
   UPDATE User SET role = 'editor' WHERE email = 'neweditor@example.com';
   `

### Roles Explained
| Role | Permissions |
|------|-------------|
| super_admin | Full access to everything, including user management and settings |
| admin | Can manage events, gallery, BOD, awards, collaborations, applications, and AI knowledge base |
| editor | Can only manage events and gallery (cannot publish or delete) |

### Security Tips
- Never share Super Admin credentials.
- Use strong, unique passwords for all admin accounts.
- Enable two-factor authentication in Supabase if possible.
- Remove admin access for members who graduate or leave the club.

---

## How to Troubleshoot Common Issues

### Issue: Invalid login credentials
- **Cause**: Wrong email or password.
- **Solution**: Use the **Forgot Password** link on the login page to reset your password via email. If that does not work, a Super Admin can reset it via Supabase.

### Issue: Failed to upload image
- **Cause**: File too large (>10MB), unsupported format, or network issue.
- **Solution**: Compress the image using a tool like TinyPNG. Ensure the file is JPG, PNG, or WebP. Check your internet connection.

### Issue: Chatbot says it does not have the information
- **Cause**: The question is not answered in the uploaded documents.
- **Solution**: Upload the relevant document to the AI Knowledge Base. Wait for processing to complete, then ask again.

### Issue: Document processing failed
- **Cause**: File is corrupted, password-protected, or in an unsupported format.
- **Solution**: Ensure the PDF is not password-protected. Try converting it to a text file or a different PDF. Click **Retry** after fixing the file.

### Issue: Changes not showing on the live site
- **Cause**: You are looking at a cached version.
- **Solution**: Hard refresh the page (Ctrl+Shift+R on Windows, Cmd+Shift+R on Mac). If using Vercel, check if the deployment is complete in the Vercel dashboard.

### Issue: Database connection error
- **Cause**: Supabase project is paused or credentials are wrong.
- **Solution**: Check if the Supabase project is active (free tier pauses after inactivity). Verify .env.local has the correct Supabase URL and keys.

### Issue: Images not loading
- **Cause**: Supabase Storage bucket is not public or URL is wrong.
- **Solution**: In Supabase, go to **Storage** > **Policies** and ensure the bucket has a policy allowing public read access. Check that image URLs in the database are correct.

### Issue: Cannot delete an event/gallery/etc.
- **Cause**: You do not have the required permissions.
- **Solution**: Ensure you are logged in as an Admin or Super Admin. Editors cannot delete content.

### Issue: Site is slow
- **Cause**: Large images, too many database queries, or free tier limits.
- **Solution**: Optimize images before uploading. Check Vercel and Supabase usage dashboards. Consider upgrading to a paid plan if traffic is high.

---

## Getting Help

If you encounter an issue not covered in this guide:

1. **Check the code**: The codebase is documented with comments. Read the relevant files in src/.
2. **Check the docs**: Review PROJECT_SPEC.md, SOFTWARE_ARCHITECTURE.md, and DATABASE_SCHEMA.md.
3. **Search online**: Next.js, Supabase, and Prisma have excellent documentation and community forums.
4. **Contact the previous webmaster**: If possible, reach out to the graduating webmaster for a handover call.
5. **Open an issue**: If the project is on GitHub, open an issue with details about the problem.

---

## Maintenance Schedule

| Task | Frequency | Who |
|------|-----------|-----|
| Update events | Weekly during active semester | Admin |
| Upload gallery photos | After each event | Editor |
| Review applications | Weekly | Admin |
| Update BOD | At start of each term | Super Admin |
| Upload AI documents | Monthly or as needed | Admin |
| Check site uptime | Weekly | Super Admin |
| Review chatbot logs | Monthly | Admin |
| Update dependencies | Monthly | Super Admin |
| Database backup | Weekly (automatic via Supabase) | - |

---

## Emergency Contacts

| Role | Contact |
|------|---------|
| Current Webmaster | [Add contact info] |
| Faculty Advisor | [Add contact info] |
| Supabase Support | https://supabase.com/docs/support |
| Vercel Support | https://vercel.com/docs/support |
| OpenAI Support | https://help.openai.com/ |

---

*Last updated: 2026-07-28*
*Maintained by: Rotaract Webmaster*
