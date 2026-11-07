# EventSphere – Event Management Website

A responsive event management website built with **HTML5, CSS3 and vanilla JavaScript** (no frameworks, no build step).

## Features
- Hero section, featured/upcoming event cards (name, date, venue, image, description)
- Live search and category filters
- Event details modal with registration form
- Registration form: name, email, phone number, selected event
- JavaScript validation (name, email, 10-digit phone, event required; duplicate check)
- Confirmation message on successful registration
- Bonus: dark/light mode, countdown timer, animations, Local Storage registrations (view/cancel)
- Responsive for mobile, tablet and desktop

## Run locally
Open `index.html` in any browser. No installation needed.

## Project structure
- `index.html` – page structure
- `style.css` – styling, themes, responsive layout
- `script.js` – event data, filtering, validation, countdown, Local Storage

## Deploy
Push to GitHub, then enable **GitHub Pages** (Settings → Pages), or drag the folder into **Netlify** / import the repo in **Vercel**.

## Git quick start
```
git init
git add .
git commit -m "Initial commit: EventSphere"
git branch -M main
git remote add origin <your-repo-url>
git push -u origin main
```
