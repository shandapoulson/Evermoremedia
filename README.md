# Evermore Media website

A plain HTML website: no build step and nothing to install.

## What's here

| File | Page |
| --- | --- |
| `index.html` | Home |
| `services.html` | Services + investment (with the package finder quiz) |
| `team.html` | Meet the team |
| `inquire.html` | Work with us (inquiry form) |
| `assets/` | Photos, client logos and illustrations |

To preview, double-click `index.html` to open it in your browser.

## Publish it with GitHub Pages (free)

1. On github.com, create a new repository (for example `evermore-website`).
2. Click **Add file → Upload files**, drag in everything from this folder (including the `assets` folder), and click **Commit changes**.
3. Go to **Settings → Pages**. Under "Build and deployment," choose **Deploy from a branch**, pick `main` and `/ (root)`, and click **Save**.
4. After a minute or two, your site is live at `https://YOUR-USERNAME.github.io/evermore-website/`.

## Make the inquiry form send to your email

The form works on the page, but until it's connected it doesn't send anywhere.

1. Sign up for a free account at formspree.io and create a new form. It gives you an ID like `xyzabcd`.
2. Open `inquire.html` and search for `YOUR_FORM_ID`.
3. Replace `YOUR_FORM_ID` with your ID, so it reads `https://formspree.io/f/xyzabcd`.
4. Upload the updated `inquire.html` to GitHub. Inquiries now arrive in your inbox.

## Use your own domain (itsevermoremedia.com)

1. In GitHub, go to **Settings → Pages → Custom domain**, enter `www.itsevermoremedia.com`, and save.
2. Wherever your domain is managed (likely Squarespace → Domains → DNS settings), add these records:
   - A `CNAME` record: host `www`, pointing to `YOUR-USERNAME.github.io`
   - Four `A` records for host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
3. Once it's working, turn on **Enforce HTTPS** in GitHub Pages.

Keep your Squarespace plan active until the new site loads on your domain. Canceling early can take the domain offline.

## Quick edits

- **Text:** open the page's `.html` file in any text editor, find the words and change them.
- **Colors:** deep green `#234A2F`, dark text `#1C3223`, matcha `#A9C08B`, butter `#F7DE7A`, lilac `#D4C2F2`, cream `#FAF5EE`.
- **Fonts:** Bricolage Grotesque (headlines), Instrument Serif (italic accents) and DM Sans (body), loaded from Google Fonts.
