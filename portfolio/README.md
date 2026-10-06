# Shrusti Barigidad: Full Stack Developer Portfolio

A lightweight, dark-mode developer portfolio built with **HTML5, CSS3 and vanilla JavaScript**. No frameworks, no build step, no backend.

## Folder structure
```
portfolio/
├── index.html
├── vercel.json
├── README.md
├── assets/
│   ├── images/profile-photo.jpg
│   ├── icons/logo.svg
│   └── resume/Shrusti-Barigidad-Resume.pdf
├── css/style.css
├── js/script.js
└── favicon/favicon.svg
```

## Run locally
```bash
git clone <repository-url>
cd portfolio
python3 -m http.server 8000      # or: npx serve .
```
Open http://localhost:8000 (opening `index.html` directly also works).

## Customize content
All content lives in `index.html`. Search for the section `id` (`about`, `skills`, `experience`, `projects`, `achievements`, `contact`) and edit the text.

- **Add a LinkedIn link:** add an `<li><a href="https://linkedin.com/in/YOUR-ID" ...>` to the hero `.socials` list, footer, and `.contact__list`.
- **Add project links:** inside `.project__body` add `<a href="https://github.com/you/repo" target="_blank" rel="noopener noreferrer">GitHub</a>`.
- **Add Education / Certifications:** copy the Experience section markup, change the `id`, and add a nav item.
- **Typing roles:** edit `data-words` on `#typing`.

## Replace the profile photo
Overwrite `assets/images/profile-photo.jpg` (square, about 800x800px). Adjust framing with `object-position` on `.photo img` in `css/style.css`.

## Replace the resume
Overwrite `assets/resume/Shrusti-Barigidad-Resume.pdf` with your file, keeping the same name, or update the `href` of the "Download Resume" button.

## Colors
Edit the CSS variables at the top of `css/style.css` (`--bg`, `--card`, `--cyan`, `--blue`, `--violet`, `--grad`).

## Animations
- Scroll reveals: the `.reveal` class and `--d` (delay) variable; logic in `initReveal()`.
- Timing and easing: `--ease` variable in `css/style.css`.
- Particles: `initParticles()` in `js/script.js` (reduce the count there).
- Users with `prefers-reduced-motion` get animations disabled automatically.

## Deploy to Vercel
**Dashboard:** push to GitHub, go to vercel.com/new, import the repo, set Framework Preset to **Other**, leave build/output settings empty, and deploy.

**CLI:**
```bash
npm i -g vercel
vercel        # preview
vercel --prod # production
```

## Custom domain
Vercel project → Settings → Domains → Add. Add the DNS records Vercel shows (A record `76.76.21.21` for apex domains or a CNAME for subdomains; use the values shown in your dashboard). Then update the `canonical` and Open Graph URLs in `index.html`.

## Before publishing
Set the real site URL in `<link rel="canonical">` and use an absolute URL for `og:image` so link previews work.
