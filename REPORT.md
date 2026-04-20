# EventHub — Internet Programming Project Report

**Altınbaş University · Software Engineering Department**
**Instructor:** F. Kuzey Edes Huyal
**Due Date:** 30 April 2026

---

### Student Information

| Field | Value |
|---|---|
| **Student Name Surname** | ____________________________ |
| **Student Number** | ____________________________ |
| **GitHub Username** | **betulkalsin** |
| **Public Repository** | https://github.com/betulkalsin/eventhub |
| **Live Demo** | https://betulkalsin.github.io/eventhub/ |

---

## 1. Project Overview and Target Users

**EventHub** is a modern, responsive web-based event and workshop discovery platform. It allows users to browse upcoming events across nine categories (Technology, Design, Music, Art, Business, Health, Food, Education, and Sports), register as attendees, and — if they choose — become organizers and publish their own events.

The project was built with three core motivations:

1. **Learning-oriented communities** need a simple way to discover workshops that match their interests.
2. **Event organizers** (students, professionals, instructors) need a low-barrier way to publish their offerings.
3. **A real-world use case** that demonstrates the full spectrum of front-end skills: semantic HTML, modern CSS, dynamic JavaScript, and client-side data persistence.

### Target Users

- **Attendees** — students, professionals, and curious learners who want to find workshops, meetups, and classes in their area or online.
- **Organizers** — instructors, community leaders, and freelancers who want to promote and host their own events.

The platform is fully responsive, working seamlessly on desktop, tablet, and mobile devices. No backend server is required — all data is stored in the browser's **localStorage**, making the site fast, free to host (on GitHub Pages), and instantly usable.

---

## 2. HTML Structure

The website consists of **8 HTML pages**, each built with semantic HTML5 elements to ensure accessibility and SEO-friendliness. The key structural tags used throughout are `<nav>`, `<section>`, `<header>`, `<article>`, `<form>`, and `<footer>`.

A typical page structure looks like this:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>EventHub — Discover Workshops & Events</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>

<nav class="navbar">
  <div class="nav-container">
    <a href="index.html" class="logo">
      <span class="logo-icon">E</span> EventHub
    </a>
    <ul class="nav-links" id="navLinks">
      <li><a href="index.html" class="active">Home</a></li>
      <li><a href="events.html">Events</a></li>
      <li><a href="create-event.html">Create Event</a></li>
      <li><a href="about.html">About</a></li>
      <li id="authLinks"></li>
    </ul>
  </div>
</nav>

<section class="hero"> ... </section>
<section class="section"> ... </section>

<footer class="footer"> ... </footer>

<script src="js/db.js"></script>
<script src="js/auth.js"></script>
<script src="js/app.js"></script>
</body>
</html>
```

**Explanation:** Every page starts with a `<!DOCTYPE html>` declaration and specifies `lang="en"` for accessibility. The viewport meta tag enables responsive design on mobile devices. The `<nav>` element holds site-wide navigation, while the main content is structured inside `<section>` blocks for logical grouping. The `<li id="authLinks">` is populated dynamically by JavaScript based on the user's login state.

Forms use proper input types (`email`, `password`, `datetime-local`, `number`) for built-in browser validation and better mobile keyboards:

```html
<form id="createEventForm">
  <div class="form-group">
    <label for="title">Event Title *</label>
    <input type="text" id="title" required>
  </div>
  <div class="form-group">
    <label for="date">Date & Time *</label>
    <input type="datetime-local" id="date" required>
  </div>
  <div class="form-group">
    <label for="capacity">Capacity *</label>
    <input type="number" id="capacity" min="1" required>
  </div>
</form>
```

**Explanation:** Using `type="datetime-local"` triggers a native date-time picker, and `type="number"` with `min="1"` prevents invalid capacities. The `required` attribute adds automatic client-side validation before JavaScript even runs.

---

## 3. CSS Styling and Design Choices

The stylesheet is built on a **warm, earthy color palette** that departs from generic blue/purple SaaS designs in favor of a more inviting, lifestyle-oriented aesthetic. The palette is defined as CSS custom properties for consistency and easy theming:

```css
:root {
  --bg: #F1EADC;              /* warm cream background */
  --bg-alt: #E8DDC8;          /* alternate section color */
  --surface: #FBF6EC;         /* card background */
  --dark: #1C2A2A;            /* deep charcoal-green text */
  --primary: #2D5F5D;         /* deep teal */
  --accent: #D97557;          /* terracotta */
  --gold: #D4A574;            /* mustard gold */
  --radius: 16px;
  --shadow: 0 4px 16px rgba(28, 42, 42, 0.08);
}
```

**Explanation:** CSS variables (`--bg`, `--primary`, etc.) make the theme centrally manageable. Changing one value updates the entire site — a technique that prevents inconsistency in large projects.

The typography combines a modern sans-serif (**Plus Jakarta Sans**) for body text with an elegant serif (**Fraunces**) for headings, creating an editorial feel:

```css
body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--dark);
}

.hero h1, .section-title, .event-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}
```

**Responsive design** is achieved using **CSS Grid** and **Flexbox**, with media queries for smaller screens:

```css
.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-links.show { display: flex; }
  .hero h1 { font-size: 2.5rem; }
  .filter-bar { grid-template-columns: 1fr; }
}
```

**Explanation:** `repeat(auto-fill, minmax(320px, 1fr))` is a powerful CSS Grid pattern that automatically fills rows with as many 320px-wide cards as fit, and evenly expands them. This eliminates the need for JavaScript-based layout calculations.

Cards use subtle hover animations with `transform` and `box-shadow` for a tactile feel:

```css
.event-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.event-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent);
}
```

Each of the nine event categories has its own unique gradient to give the cards visual variety:

```css
.grad-tech     { background: linear-gradient(135deg, #2D5F5D, #1E4341); }
.grad-design   { background: linear-gradient(135deg, #D97557, #B85B40); }
.grad-music    { background: linear-gradient(135deg, #6B4C8A, #4A2F5F); }
/* ... 6 more variants */
```

---

## 4. JavaScript and Dynamic Features

JavaScript powers all interactive functionality, divided across three modular files:

- `db.js` — data management (localStorage wrapper + seed data)
- `auth.js` — login, registration, session handling
- `app.js` — page logic, rendering, event listeners

### 4.1 Live Search and Filtering

The events page supports **instant search** as the user types, plus dropdown filters for category and price:

```javascript
function render() {
  let events = DB.get('events');
  const q = searchInput.value.toLowerCase().trim();
  const cat = categoryFilter.value;
  const price = priceFilter.value;

  if (q) {
    events = events.filter(e =>
      e.title.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q) ||
      e.location.toLowerCase().includes(q)
    );
  }
  if (cat) events = events.filter(e => e.category === cat);
  if (price === 'free') events = events.filter(e => e.price === 0);

  events.sort((a, b) => new Date(a.date) - new Date(b.date));
  grid.innerHTML = events.map(createEventCard).join('');
}

searchInput.addEventListener('input', render);
```

**Explanation:** Every keystroke triggers the `render()` function, which rebuilds the filtered event list. Because all data lives in memory (loaded from localStorage), the search feels instant — no network latency.

### 4.2 Real-Time Countdown Timer

Each event detail page shows a live countdown to the event start:

```javascript
function startCountdown(dateStr) {
  const target = new Date(dateStr).getTime();

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) return;

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent = days;
    document.getElementById('cd-hours').textContent = hours;
    document.getElementById('cd-mins').textContent = mins;
    document.getElementById('cd-secs').textContent = secs;
  }

  update();
  setInterval(update, 1000);
}
```

**Explanation:** `setInterval(update, 1000)` runs the update function every second. The math divides milliseconds by 86,400,000 (ms per day), 3,600,000 (ms per hour), etc.

### 4.3 Form Validation

Registration validates email format, password length, and matching confirmation:

```javascript
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  errorEl.textContent = 'Please enter a valid email address.';
  errorEl.classList.add('show'); return;
}
if (password.length < 6) {
  errorEl.textContent = 'Password must be at least 6 characters long.';
  errorEl.classList.add('show'); return;
}
if (password !== password2) {
  errorEl.textContent = 'Passwords do not match.';
  errorEl.classList.add('show'); return;
}
```

**Explanation:** The regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` matches any non-whitespace sequence + `@` + another sequence + `.` + final sequence — covering most real email addresses.

### 4.4 Modal Popups

Rather than basic `alert()` boxes, custom-styled modals give feedback:

```javascript
function showModal({ icon, title, message, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="btn btn-primary" id="modalClose">Got it</button>
    </div>`;
  document.body.appendChild(modal);
  document.getElementById('modalClose').addEventListener('click', () => {
    modal.remove();
    if (onClose) onClose();
  });
}
```

---

## 5. Data Handling with localStorage

Rather than using a traditional database (MySQL, MongoDB), EventHub uses the **browser's localStorage API**. This was a conscious design choice: it allows the site to run entirely on static hosting (GitHub Pages), with no server, no database setup, and no ongoing maintenance costs.

A thin wrapper abstracts the verbose `JSON.parse` / `JSON.stringify` calls:

```javascript
const DB = {
  get(key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
  add(key, item) {
    const list = DB.get(key);
    item.id = Date.now() + Math.floor(Math.random() * 1000);
    list.push(item);
    DB.set(key, list);
    return item;
  },
  update(key, id, updates) {
    const list = DB.get(key);
    const idx = list.findIndex(i => i.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      DB.set(key, list);
    }
  },
  findById(key, id) {
    return DB.get(key).find(i => i.id === id);
  }
};
```

**Explanation:** This mimics a simple database API (`get`, `set`, `add`, `update`, `findById`), making all the calling code cleaner. IDs are generated with `Date.now() + random` to avoid collisions.

Three main collections are stored:

- `users` — registered accounts (id, name, email, password, role)
- `events` — all events (id, title, description, date, capacity, registered, etc.)
- `registrations` — the join table linking users to events

The app is seeded with **46 sample events** and two organizer accounts on first visit:

```javascript
function seedData() {
  if (localStorage.getItem('seeded_v4')) return;
  DB.set('users', sampleUsers);
  DB.set('events', sampleEvents);
  DB.set('registrations', []);
  localStorage.setItem('seeded_v4', 'true');
}
```

**Explanation:** The `seeded_v4` flag prevents re-seeding on every page load. The version suffix allows easy resets when schema changes.

---

## 6. Main Pages of the Website

### Home Page (`index.html`)

*[Insert screenshot of the home page]*

The home page welcomes visitors with a hero section, eight browseable category cards, and a grid of the most popular upcoming events. Live stats (total events, attendees, cities) are calculated dynamically. This page is the main entry point and sets the visual tone of the site.

### Events Page (`events.html`)

*[Insert screenshot of the events listing]*

Displays all 46 events in a responsive grid, with a search bar, category filter, and price filter. The result count updates live as the user types. This is where users spend most of their time discovering events.

### Event Detail (`event-detail.html`)

*[Insert screenshot of an event detail page]*

Shows the full description, date, location, capacity bar, and a live countdown timer. The "Register" button is disabled if the user is not logged in, already registered, or if the event is full.

### Create Event (`create-event.html`)

*[Insert screenshot of create-event form]*

A protected page (requires login) where organizers fill out a form to publish new events. Client-side validation ensures dates are not in the past and required fields are filled.

### Login & Register (`login.html`, `register.html`)

*[Insert screenshot of login or register form]*

Handle authentication. The login page includes a demo credential hint for reviewers. Passwords are stored in localStorage (see "Challenges" below for the security trade-off).

### Profile (`profile.html`)

*[Insert screenshot of profile page]*

Shows the user's avatar (colored initial), name, and two tabs: "Registered Events" and "My Events" (for organizers). Tabs toggle without page reloads.

### About (`about.html`)

*[Insert screenshot of about page]*

Describes the platform's mission and six core features. Includes contact information.

---

## 7. Navigation and User Experience

Navigation is consistent across every page via a sticky navbar with semi-transparent background and blur effect (using `backdrop-filter`). The active page is underlined with the accent color for orientation.

On mobile, the navbar collapses into a hamburger menu:

```javascript
const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => links.classList.toggle('show'));
```

The logged-in user menu is a pill-shaped button showing an avatar circle with the user's first initial (gradient-filled), plus a separate circular logout icon button. Hover states and smooth transitions throughout make the interface feel polished.

Category cards on the home page link directly to the events page with a pre-applied filter:

```
events.html?category=Technology
```

The events page reads the query parameter on load and applies the filter automatically. This small touch makes browsing by category feel seamless.

---

## 8. Challenges Faced and Solutions Applied

### Challenge 1 — Data persistence without a backend

I wanted the site to work on static hosting, but also needed persistent data across sessions.

**Solution:** Used the `localStorage` API, wrapped in a clean `DB` object that mimics a database interface. Seed data loads on first visit and persists until the user clears browser storage.

### Challenge 2 — Responsive event grid

Cards looked awkward on different screen sizes — either too narrow on mobile or too wide on ultra-wide monitors.

**Solution:** Used CSS Grid with `repeat(auto-fill, minmax(320px, 1fr))` to automatically flow cards into as many columns as fit, with each card at least 320px wide.

### Challenge 3 — Poor-looking default authentication UI

My first version of the navbar showed plain "Admin · Logout" text that looked cluttered and unprofessional.

**Solution:** Redesigned it as a gradient avatar pill + circular icon-only logout button with an SVG door icon. Hover states provide visual feedback.

### Challenge 4 — Password security

Since there is no backend, passwords must live in localStorage — which is visible to anyone with browser access.

**Solution:** This is documented as a known limitation. For a production app, I would implement a real backend with `bcrypt`-hashed passwords, HTTPS-only cookies, and server-side session management. For this educational project, the trade-off is acceptable and documented.

### Challenge 5 — Date format inconsistency

Date strings were being parsed inconsistently across browsers.

**Solution:** All dates use ISO 8601 format internally (`2026-05-15T14:00`), and display dates are formatted with `toLocaleDateString('en-US', …)` for a human-readable output.

---

## 9. GitHub Repository

- **GitHub Username:** `betulkalsin`
- **Repository URL:** https://github.com/betulkalsin/eventhub
- **Live Site:** https://betulkalsin.github.io/eventhub/

The repository contains all source files with a clear folder structure:

```
eventhub/
├── index.html
├── events.html
├── event-detail.html
├── create-event.html
├── login.html
├── register.html
├── profile.html
├── about.html
├── css/
│   └── style.css
└── js/
    ├── db.js
    ├── auth.js
    └── app.js
```

---

## 10. Conclusion

EventHub demonstrates that a rich, interactive web application can be built using only the three foundational web technologies — HTML, CSS, and JavaScript — combined with browser-native data storage. The project covers all core Internet Programming topics: semantic HTML, modern responsive CSS, dynamic DOM manipulation, event handling, form validation, client-side routing via query parameters, and persistent storage. Total codebase: roughly **2,300 lines** across 12 files, with **46 sample events** across **9 categories**.

Building this project reinforced how much modern browsers can do without a backend. It also illustrated the trade-offs: localStorage is fast and simple, but limited to per-device storage. For a real product, the natural next step would be to migrate the `DB` wrapper to a real backend API (keeping the same interface for minimal code change).

---

### Student Signature

**Date:** _____________________

**Signature:** _____________________

---

*Word count: approximately 1,900 words (excluding code blocks and headings).*
