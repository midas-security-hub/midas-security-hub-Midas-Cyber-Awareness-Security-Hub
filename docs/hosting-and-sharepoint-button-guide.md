# Hosting Your Security Element & Linking via SharePoint Button

Since `account-password-security.html` is a **100% serverless, zero-dependency client-side file**, you can host it easily without needing a backend server and link to it from any SharePoint Button, Hero banner, or Quick Links web part.

---

## 🌟 Top 3 Free & Easy Hosting Options

### Option 1: Host Directly in SharePoint Site Assets (Native & No Setup Required)

Because SharePoint itself can host static web files:
1. Go to your SharePoint Site -> **Site Contents** -> **Site Assets** (or **Documents**).
2. Click **Upload** -> upload `account-password-security.html`.
3. Click the three dots (`...`) next to `account-password-security.html` -> click **Copy link**.
4. *(Optional tip)*: Make sure the link is set to "People in your organization" or "Anyone with the link can view".
5. Copy this URL (e.g., `https://yourcompany.sharepoint.com/sites/Intranet/SiteAssets/account-password-security.html`).

---

### Option 2: Netlify Drop (1-Click Instant Drag & Drop Hosting)

Netlify provides free static hosting with zero installation:
1. Open [app.netlify.com/drop](https://app.netlify.com/drop) in your browser.
2. Drag and drop your `Embed` folder containing `account-password-security.html` onto the webpage.
3. Within 5 seconds, Netlify will generate a live HTTPS link (e.g., `https://company-account-security.netlify.app`).

---

### Option 3: GitHub Pages (Free Permanent Cloud Hosting)

If your team uses GitHub:
1. Create a repository named `account-security-guide`.
2. Push or upload `account-password-security.html`.
3. Go to **Settings** -> **Pages** -> Select `main` branch -> Click **Save**.
4. Your page will be live at `https://<your-username>.github.io/account-security-guide/`.

---

## 🔘 How to Connect the Hosted Link to a SharePoint Button

1. Go to your SharePoint Modern Page and click **Edit** (top right).
2. Hover over the section where you want the button and click **`+` (Add a new web part)**.
3. Choose one of the following SharePoint web parts:
   - **Button Web Part**:
     - Label: `Account & Password Security Guide`
     - Link: Paste your hosted link (`https://...`)
   - **Quick Links Web Part**:
     - Click **Add link** -> Paste your hosted URL.
     - Choose **Button** or **Grid** visual style.
   - **Hero Web Part**:
     - Set the call-to-action button link to your hosted URL.
4. Click **Publish** at the top right of your SharePoint page.

Now, whenever an employee clicks the button in SharePoint, your interactive Account & Password Security guide opens as a full, dedicated web page!
