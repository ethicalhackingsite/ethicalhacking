# EthicalHacking — Deployment Guide
## How to put your site live on GitHub Pages (free)

---

## What You're Deploying

Your site is made of static HTML files — no server, no database, no hosting costs.
Everything is stored in the browser's localStorage on your machine.

```
ethicalhacking/
├── index.html          ← Homepage (course list)
├── article.html        ← Article reader
├── about.html          ← About page
├── css/
│   └── main.css        ← Shared styles
├── js/
│   └── store.js        ← All data logic
└── admin/
    ├── login.html      ← Admin login   (you only — password protected)
    ├── dashboard.html  ← Admin overview
    ├── articles.html   ← Manage articles
    ├── edit-article.html ← Write / edit articles
    ├── settings.html   ← Change password, site name
    └── import-export.html ← Backup & restore
```

---

## Step 1 — Create a GitHub Account

Go to https://github.com and sign up for a free account if you don't have one.

---

## Step 2 — Create a New Repository

1. Click the **+** button (top right) → **New repository**
2. Name it: `ethicalhacking` (or whatever you like)
3. Set it to **Public** (required for free GitHub Pages)
4. Click **Create repository**

---

## Step 3 — Upload Your Files

### Option A — Using the GitHub Website (easiest)

1. Open your new repository on GitHub
2. Click **Add file** → **Upload files**
3. Drag the entire `ethicalhacking/` folder contents into the upload area
4. Make sure to upload the `css/`, `js/`, and `admin/` folders too
   - GitHub won't upload empty folders, but these have files in them so it's fine
5. Click **Commit changes**

> ⚠ GitHub's web uploader can be slow with many files. If you have issues,
> use Option B below.

### Option B — Using Git (recommended)

Open a terminal / command prompt in your `ethicalhacking/` folder and run:

```bash
git init
git add .
git commit -m "Initial site upload"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/ethicalhacking.git
git push -u origin main
```

Replace `YOUR-USERNAME` with your GitHub username.

---

## Step 4 — Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** (tab at the top)
3. Scroll down to the **Pages** section (left sidebar)
4. Under **Source**, select **Deploy from a branch**
5. Set Branch to **main** and folder to **/ (root)**
6. Click **Save**

GitHub will show you a URL like:
```
https://YOUR-USERNAME.github.io/ethicalhacking/
```

It takes **1-2 minutes** to go live. Refresh the page and the URL will appear in green.

---

## Step 5 — Visit Your Live Site

Your site is now live at:
```
https://YOUR-USERNAME.github.io/ethicalhacking/
```

Your admin panel is at:
```
https://YOUR-USERNAME.github.io/ethicalhacking/admin/login.html
```

**Default admin password:** `changeme2025`
⚠ **Change this immediately** in Admin → Settings → Change Password

---

## How Content Management Works

### Important: localStorage is per-browser

Because there's no server, all your articles and modules are stored in
**your browser's localStorage**. This means:

- When YOU add articles via the admin panel on your computer, they save to
  YOUR browser only
- Visitors see only the **default demo content** that ships with the site

### The correct workflow for publishing new content:

1. Write your article in **Admin → Articles → New Article** on your computer
2. Go to **Admin → Backup / Restore → Export Backup**
3. This downloads a `.json` file with all your content
4. Open `js/store.js` in a text editor
5. Find the `DEFAULTS` object near the top of the file
6. Replace the `modules` and `articles` arrays with your exported data
7. Push the updated `store.js` to GitHub — your live site now shows your articles

### Easier alternative: Edit store.js directly

For a simpler workflow, just write articles directly in `js/store.js`
inside the `DEFAULTS.articles` array. Each article looks like this:

```javascript
{
  id: 'art-3',
  moduleId: 'mod-1',
  order: 3,
  title: 'Your Article Title',
  slug: 'your-article-slug',
  difficulty: 'beginner',        // beginner | intermediate | advanced
  tags: ['c++', 'win32'],
  duration: 10,                  // minutes
  published: true,               // false = draft, not shown on homepage
  content: `<p>Your HTML content here.</p>
<h2>A Section</h2>
<p>More content…</p>
<pre><code>// Code example
DWORD pid = GetProcessId("game.exe");
</code></pre>`,
  createdAt: new Date().toISOString(),
}
```

Then push to GitHub and your site updates automatically.

---

## Updating Your Site

Any time you push changes to GitHub, your live site updates within ~1 minute.

```bash
git add .
git commit -m "Add new article: OpenProcess tutorial"
git push
```

---

## Custom Domain (optional)

If you want `www.ethicalhacking.com` instead of `username.github.io/ethicalhacking`:

1. Buy a domain (Namecheap, Cloudflare, etc.)
2. In GitHub → Settings → Pages → Custom domain, enter your domain
3. Add a CNAME record pointing to `YOUR-USERNAME.github.io` in your domain's DNS
4. Enable **Enforce HTTPS** ✓

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Site shows 404 | Wait 2 minutes, then check Settings → Pages is enabled |
| CSS not loading | Make sure `css/main.css` was uploaded |
| Admin won't load | Check `admin/login.html` was uploaded |
| Articles not showing | You need to bake content into `store.js` DEFAULTS (see above) |
| Forgot admin password | Open browser console on admin page, run: `localStorage.removeItem('eh_data')` then reload |

---

## Backing Up Your Work

⚠ **Do this regularly.** If you clear your browser storage, you lose your admin data.

1. Go to Admin → Backup / Restore
2. Click **Download Backup**
3. Save the `.json` file somewhere safe (Google Drive, etc.)

To restore on a new computer:
1. Go to Admin → Backup / Restore
2. Click **Choose JSON File** and select your backup
3. Your content reappears instantly

---

That's it. Your course is live, free, forever. 🎉
