#!/usr/bin/env node
// Build EventHub project report as a .docx file
const fs = require('fs');
const path = require('path');

// Resolve globally installed docx
const globalRoot = require('child_process')
  .execSync('npm root -g').toString().trim();
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, ExternalHyperlink,
  HeadingLevel, BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require(path.join(globalRoot, 'docx'));

// ---------- helpers ----------
const BORDER = { style: BorderStyle.SINGLE, size: 4, color: "CCCCCC" };
const BORDERS = { top: BORDER, bottom: BORDER, left: BORDER, right: BORDER };
const CODE_SHADING = { fill: "F4EFE3", type: ShadingType.CLEAR, color: "auto" };

function H1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 180 },
    children: [new TextRun({ text, bold: true, size: 32, color: "1C2A2A" })],
  });
}

function H2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 140 },
    children: [new TextRun({ text, bold: true, size: 26, color: "2D5F5D" })],
  });
}

function H3(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 200, after: 100 },
    children: [new TextRun({ text, bold: true, size: 22, color: "D97557" })],
  });
}

function P(runs, opts = {}) {
  const arr = Array.isArray(runs) ? runs : [runs];
  const children = arr.map(r => typeof r === "string" ? T(r) : r);
  return new Paragraph({
    spacing: { after: 120, line: 320 },
    alignment: opts.align || AlignmentType.JUSTIFIED,
    children,
  });
}

function T(text, opts = {}) {
  return new TextRun({ text, ...opts, size: opts.size || 22 });
}

function bold(text) {
  return new TextRun({ text, bold: true, size: 22 });
}

function italic(text) {
  return new TextRun({ text, italics: true, size: 22 });
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 80 },
    children: Array.isArray(text) ? text : [T(text)],
  });
}

function codeLine(line) {
  return new Paragraph({
    spacing: { after: 0 },
    shading: CODE_SHADING,
    indent: { left: 180, right: 180 },
    children: [new TextRun({
      text: line || " ",
      font: "Consolas",
      size: 18,
      color: "2C3E3D",
    })],
  });
}

function codeBlock(code) {
  const lines = code.split("\n");
  const paras = [];
  // Spacer before
  paras.push(new Paragraph({ spacing: { before: 80, after: 0 }, children: [T("")] }));
  lines.forEach((line, i) => {
    paras.push(new Paragraph({
      spacing: { after: i === lines.length - 1 ? 0 : 0, line: 260 },
      shading: CODE_SHADING,
      indent: { left: 180, right: 180 },
      border: i === 0 ? { top: { style: BorderStyle.SINGLE, size: 4, color: "D9CEB8" } } :
              i === lines.length - 1 ? { bottom: { style: BorderStyle.SINGLE, size: 4, color: "D9CEB8" } } : {},
      children: [new TextRun({
        text: line || " ",
        font: "Consolas",
        size: 18,
        color: "2C3E3D",
      })],
    }));
  });
  paras.push(new Paragraph({ spacing: { before: 0, after: 160 }, children: [T("")] }));
  return paras;
}

function infoCell(text, isHeader = false) {
  return new TableCell({
    borders: BORDERS,
    width: { size: 2800, type: WidthType.DXA },
    shading: isHeader ? { fill: "E8DDC8", type: ShadingType.CLEAR } : { fill: "FBF6EC", type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    children: [new Paragraph({
      children: [new TextRun({
        text,
        bold: isHeader,
        size: 22,
        color: "1C2A2A",
      })],
    })],
  });
}

function infoCellWide(text, bold = false) {
  return new TableCell({
    borders: BORDERS,
    width: { size: 6560, type: WidthType.DXA },
    shading: { fill: "FBF6EC", type: ShadingType.CLEAR },
    margins: { top: 120, bottom: 120, left: 180, right: 180 },
    children: [new Paragraph({
      children: [new TextRun({ text, bold, size: 22, color: "1C2A2A" })],
    })],
  });
}

// ---------- build sections ----------
const children = [];

// TITLE
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { before: 0, after: 120 },
  children: [new TextRun({ text: "EventHub", bold: true, size: 48, color: "2D5F5D" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 240 },
  children: [new TextRun({ text: "Internet Programming Project Report", italics: true, size: 28, color: "6B7A78" })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: "Altınbaş University — Software Engineering Department", size: 22 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 60 },
  children: [new TextRun({ text: "Instructor: F. Kuzey Edes Huyal", size: 22 })],
}));
children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { after: 360 },
  children: [new TextRun({ text: "Due Date: 30 April 2026", size: 22 })],
}));

// STUDENT INFO TABLE
children.push(H3("Student Information"));
const infoRows = [
  ["Student Name Surname", "____________________________"],
  ["Student Number", "____________________________"],
  ["GitHub Username", "betulkalsin"],
  ["Public Repository", "https://github.com/betulkalsin/eventhub"],
  ["Live Demo", "https://betulkalsin.github.io/eventhub/"],
];
children.push(new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [2800, 6560],
  rows: infoRows.map(([k, v]) => new TableRow({
    children: [infoCell(k, true), infoCellWide(v)],
  })),
}));

children.push(new Paragraph({ children: [new PageBreak()] }));

// ---------- SECTION 1 ----------
children.push(H1("1. Project Overview and Target Users"));

children.push(P([
  bold("EventHub"),
  T(" is a modern, responsive web-based event and workshop discovery platform. It allows users to browse upcoming events across nine categories (Technology, Design, Music, Art, Business, Health, Food, Education, and Sports), register as attendees, and — if they choose — become organizers and publish their own events."),
]));

children.push(P("The project was built with three core motivations:"));

children.push(bullet([bold("Learning-oriented communities"), T(" need a simple way to discover workshops that match their interests.")]));
children.push(bullet([bold("Event organizers"), T(" (students, professionals, instructors) need a low-barrier way to publish their offerings.")]));
children.push(bullet([bold("A real-world use case"), T(" that demonstrates the full spectrum of front-end skills: semantic HTML, modern CSS, dynamic JavaScript, and client-side data persistence.")]));

children.push(H3("Target Users"));
children.push(bullet([bold("Attendees"), T(" — students, professionals, and curious learners who want to find workshops, meetups, and classes in their area or online.")]));
children.push(bullet([bold("Organizers"), T(" — instructors, community leaders, and freelancers who want to promote and host their own events.")]));

children.push(P("The platform is fully responsive, working seamlessly on desktop, tablet, and mobile devices. No backend server is required — all data is stored in the browser's localStorage, making the site fast, free to host on GitHub Pages, and instantly usable."));

// ---------- SECTION 2 ----------
children.push(H1("2. HTML Structure"));

children.push(P([
  T("The website consists of "),
  bold("8 HTML pages"),
  T(", each built with semantic HTML5 elements to ensure accessibility and SEO-friendliness. The key structural tags used throughout are "),
  new TextRun({ text: "<nav>", font: "Consolas", size: 20 }),
  T(", "),
  new TextRun({ text: "<section>", font: "Consolas", size: 20 }),
  T(", "),
  new TextRun({ text: "<header>", font: "Consolas", size: 20 }),
  T(", "),
  new TextRun({ text: "<article>", font: "Consolas", size: 20 }),
  T(", "),
  new TextRun({ text: "<form>", font: "Consolas", size: 20 }),
  T(", and "),
  new TextRun({ text: "<footer>", font: "Consolas", size: 20 }),
  T("."),
]));

children.push(P("A typical page structure looks like this:"));
children.push(...codeBlock(`<!DOCTYPE html>
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

<footer class="footer"> ... </footer>

<script src="js/db.js"></script>
<script src="js/auth.js"></script>
<script src="js/app.js"></script>
</body>
</html>`));

children.push(P([
  bold("Explanation: "),
  T("Every page starts with a "),
  new TextRun({ text: "<!DOCTYPE html>", font: "Consolas", size: 20 }),
  T(" declaration and specifies "),
  new TextRun({ text: 'lang="en"', font: "Consolas", size: 20 }),
  T(" for accessibility. The viewport meta tag enables responsive design on mobile devices. The "),
  new TextRun({ text: "<nav>", font: "Consolas", size: 20 }),
  T(" element holds site-wide navigation, while main content is structured inside "),
  new TextRun({ text: "<section>", font: "Consolas", size: 20 }),
  T(" blocks for logical grouping. The "),
  new TextRun({ text: '<li id="authLinks">', font: "Consolas", size: 20 }),
  T(" is populated dynamically by JavaScript based on the user's login state."),
]));

children.push(P("Forms use proper input types for built-in browser validation:"));
children.push(...codeBlock(`<form id="createEventForm">
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
</form>`));

children.push(P([
  bold("Explanation: "),
  T("Using "),
  new TextRun({ text: 'type="datetime-local"', font: "Consolas", size: 20 }),
  T(" triggers a native date-time picker, and "),
  new TextRun({ text: 'type="number"', font: "Consolas", size: 20 }),
  T(" with "),
  new TextRun({ text: 'min="1"', font: "Consolas", size: 20 }),
  T(" prevents invalid capacities. The "),
  new TextRun({ text: "required", font: "Consolas", size: 20 }),
  T(" attribute adds automatic client-side validation before JavaScript even runs."),
]));

// ---------- SECTION 3 ----------
children.push(H1("3. CSS Styling and Design Choices"));

children.push(P([
  T("The stylesheet is built on a "),
  bold("warm, earthy color palette"),
  T(" that departs from generic blue/purple SaaS designs in favor of a more inviting, lifestyle-oriented aesthetic. The palette is defined as CSS custom properties for consistency and easy theming:"),
]));

children.push(...codeBlock(`:root {
  --bg: #F1EADC;              /* warm cream background */
  --bg-alt: #E8DDC8;          /* alternate section color */
  --surface: #FBF6EC;         /* card background */
  --dark: #1C2A2A;            /* deep charcoal-green text */
  --primary: #2D5F5D;         /* deep teal */
  --accent: #D97557;          /* terracotta */
  --gold: #D4A574;            /* mustard gold */
  --radius: 16px;
  --shadow: 0 4px 16px rgba(28, 42, 42, 0.08);
}`));

children.push(P([
  bold("Explanation: "),
  T("CSS variables (--bg, --primary, etc.) make the theme centrally manageable. Changing one value updates the entire site — a technique that prevents inconsistency in large projects."),
]));

children.push(P([
  T("The typography combines a modern sans-serif "),
  bold("(Plus Jakarta Sans)"),
  T(" for body text with an elegant serif "),
  bold("(Fraunces)"),
  T(" for headings, creating an editorial feel."),
]));

children.push(...codeBlock(`body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg);
  color: var(--dark);
}

.hero h1, .section-title, .event-title {
  font-family: 'Fraunces', serif;
  font-weight: 700;
  letter-spacing: -0.02em;
}`));

children.push(P([
  bold("Responsive design"),
  T(" is achieved using "),
  bold("CSS Grid"),
  T(" and "),
  bold("Flexbox"),
  T(", with media queries for smaller screens:"),
]));

children.push(...codeBlock(`.event-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 1.75rem;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .nav-links.show { display: flex; }
  .hero h1 { font-size: 2.5rem; }
  .filter-bar { grid-template-columns: 1fr; }
}`));

children.push(P([
  bold("Explanation: "),
  new TextRun({ text: "repeat(auto-fill, minmax(320px, 1fr))", font: "Consolas", size: 20 }),
  T(" is a powerful CSS Grid pattern that automatically fills rows with as many 320px-wide cards as fit, and evenly expands them. This eliminates the need for JavaScript-based layout calculations."),
]));

children.push(P("Cards use subtle hover animations with transform and box-shadow for a tactile feel:"));
children.push(...codeBlock(`.event-card {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.event-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent);
}`));

children.push(P("Each of the nine event categories has its own unique gradient to give the cards visual variety:"));
children.push(...codeBlock(`.grad-tech     { background: linear-gradient(135deg, #2D5F5D, #1E4341); }
.grad-design   { background: linear-gradient(135deg, #D97557, #B85B40); }
.grad-music    { background: linear-gradient(135deg, #6B4C8A, #4A2F5F); }
/* ... 6 more variants */`));

// ---------- SECTION 4 ----------
children.push(H1("4. JavaScript and Dynamic Features"));

children.push(P("JavaScript powers all interactive functionality, divided across three modular files:"));
children.push(bullet([new TextRun({ text: "db.js", font: "Consolas", size: 22 }), T(" — data management (localStorage wrapper + seed data)")]));
children.push(bullet([new TextRun({ text: "auth.js", font: "Consolas", size: 22 }), T(" — login, registration, session handling")]));
children.push(bullet([new TextRun({ text: "app.js", font: "Consolas", size: 22 }), T(" — page logic, rendering, event listeners")]));

children.push(H3("4.1 Live Search and Filtering"));
children.push(P([
  T("The events page supports "),
  bold("instant search"),
  T(" as the user types, plus dropdown filters for category and price:"),
]));

children.push(...codeBlock(`function render() {
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

searchInput.addEventListener('input', render);`));

children.push(P([
  bold("Explanation: "),
  T("Every keystroke triggers the render() function, which rebuilds the filtered event list. Because all data lives in memory (loaded from localStorage), the search feels instant — no network latency."),
]));

children.push(H3("4.2 Real-Time Countdown Timer"));
children.push(P("Each event detail page shows a live countdown to the event start:"));
children.push(...codeBlock(`function startCountdown(dateStr) {
  const target = new Date(dateStr).getTime();

  function update() {
    const diff = target - Date.now();
    if (diff <= 0) return;

    const days  = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins  = Math.floor((diff % 3600000) / 60000);
    const secs  = Math.floor((diff % 60000) / 1000);

    document.getElementById('cd-days').textContent  = days;
    document.getElementById('cd-hours').textContent = hours;
    document.getElementById('cd-mins').textContent  = mins;
    document.getElementById('cd-secs').textContent  = secs;
  }

  update();
  setInterval(update, 1000);
}`));

children.push(P([
  bold("Explanation: "),
  new TextRun({ text: "setInterval(update, 1000)", font: "Consolas", size: 20 }),
  T(" runs the update function every second. The math divides milliseconds by 86,400,000 (ms per day), 3,600,000 (ms per hour), and so on."),
]));

children.push(H3("4.3 Form Validation"));
children.push(P("Registration validates email format, password length, and matching confirmation:"));
children.push(...codeBlock(`if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) {
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
}`));

children.push(P([
  bold("Explanation: "),
  T("The regular expression matches any non-whitespace sequence, followed by @, another sequence, a dot, and a final sequence — covering most real email addresses. Strict enough to catch obvious mistakes without being overly restrictive."),
]));

children.push(H3("4.4 Modal Popups"));
children.push(P([
  T("Rather than basic "),
  new TextRun({ text: "alert()", font: "Consolas", size: 22 }),
  T(" boxes, custom-styled modals give feedback:"),
]));
children.push(...codeBlock(`function showModal({ icon, title, message, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = \`
    <div class="modal">
      <div class="modal-icon">\${icon}</div>
      <h3>\${title}</h3>
      <p>\${message}</p>
      <button class="btn btn-primary" id="modalClose">Got it</button>
    </div>\`;
  document.body.appendChild(modal);
  document.getElementById('modalClose').addEventListener('click', () => {
    modal.remove();
    if (onClose) onClose();
  });
}`));

// ---------- SECTION 5 ----------
children.push(H1("5. Data Handling with localStorage"));

children.push(P([
  T("Rather than using a traditional database (MySQL, MongoDB), EventHub uses the "),
  bold("browser's localStorage API"),
  T(". This was a conscious design choice: it allows the site to run entirely on static hosting (GitHub Pages), with no server, no database setup, and no ongoing maintenance costs."),
]));

children.push(P([
  T("A thin wrapper abstracts the verbose "),
  new TextRun({ text: "JSON.parse", font: "Consolas", size: 22 }),
  T(" / "),
  new TextRun({ text: "JSON.stringify", font: "Consolas", size: 22 }),
  T(" calls:"),
]));

children.push(...codeBlock(`const DB = {
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
};`));

children.push(P([
  bold("Explanation: "),
  T("This mimics a simple database API (get, set, add, update, findById), making all calling code cleaner. IDs are generated with "),
  new TextRun({ text: "Date.now() + random", font: "Consolas", size: 22 }),
  T(" to avoid collisions."),
]));

children.push(P("Three main collections are stored:"));
children.push(bullet([new TextRun({ text: "users", font: "Consolas", size: 22 }), T(" — registered accounts (id, name, email, password, role)")]));
children.push(bullet([new TextRun({ text: "events", font: "Consolas", size: 22 }), T(" — all events (id, title, description, date, capacity, registered, etc.)")]));
children.push(bullet([new TextRun({ text: "registrations", font: "Consolas", size: 22 }), T(" — the join table linking users to events")]));

children.push(P([
  T("The app is seeded with "),
  bold("46 sample events"),
  T(" and multiple organizer accounts on first visit:"),
]));

children.push(...codeBlock(`function seedData() {
  if (localStorage.getItem('seeded_v4')) return;
  DB.set('users', sampleUsers);
  DB.set('events', sampleEvents);
  DB.set('registrations', []);
  localStorage.setItem('seeded_v4', 'true');
}`));

children.push(P([
  bold("Explanation: "),
  T("The "),
  new TextRun({ text: "seeded_v4", font: "Consolas", size: 22 }),
  T(" flag prevents re-seeding on every page load. The version suffix allows easy resets when the schema changes."),
]));

// ---------- SECTION 6 ----------
children.push(H1("6. Main Pages of the Website"));

const pages = [
  { title: "Home Page (index.html)", desc: "Welcomes visitors with a hero section, eight browseable category cards, and a grid of the most popular upcoming events. Live stats (total events, attendees, cities) are calculated dynamically. This page is the main entry point and sets the visual tone of the site." },
  { title: "Events Page (events.html)", desc: "Displays all 46 events in a responsive grid with a search bar, category filter, and price filter. The result count updates live as the user types. This is where users spend most of their time discovering events." },
  { title: "Event Detail (event-detail.html)", desc: "Shows the full description, date, location, capacity bar, and a live countdown timer. The Register button is disabled if the user is not logged in, already registered, or if the event is full." },
  { title: "Create Event (create-event.html)", desc: "A protected page (requires login) where organizers fill out a form to publish new events. Client-side validation ensures dates are not in the past and required fields are filled." },
  { title: "Login & Register (login.html, register.html)", desc: "Handle authentication. The login page includes a demo credential hint for reviewers. Passwords are stored in localStorage (see Challenges section for the security trade-off)." },
  { title: "Profile (profile.html)", desc: "Shows the user's avatar (colored initial), name, and two tabs: Registered Events and My Events (for organizers). Tabs toggle without page reloads." },
  { title: "About (about.html)", desc: "Describes the platform's mission and six core features. Includes contact information." },
];

pages.forEach(p => {
  children.push(H3(p.title));
  children.push(P(italic("[Insert screenshot of this page]")));
  children.push(P(p.desc));
});

// ---------- SECTION 7 ----------
children.push(H1("7. Navigation and User Experience"));

children.push(P([
  T("Navigation is consistent across every page via a "),
  bold("sticky navbar"),
  T(" with a semi-transparent background and blur effect (using "),
  new TextRun({ text: "backdrop-filter", font: "Consolas", size: 22 }),
  T("). The active page is underlined with the accent color for orientation."),
]));

children.push(P("On mobile, the navbar collapses into a hamburger menu:"));
children.push(...codeBlock(`const toggle = document.getElementById('navToggle');
const links = document.getElementById('navLinks');
toggle.addEventListener('click', () => links.classList.toggle('show'));`));

children.push(P("The logged-in user menu is a pill-shaped button showing an avatar circle with the user's first initial (gradient-filled), plus a separate circular logout icon button. Hover states and smooth transitions throughout make the interface feel polished."));

children.push(P("Category cards on the home page link directly to the events page with a pre-applied filter:"));
children.push(...codeBlock(`events.html?category=Technology`));
children.push(P("The events page reads the query parameter on load and applies the filter automatically. This small touch makes browsing by category feel seamless."));

// ---------- SECTION 8 ----------
children.push(H1("8. Challenges Faced and Solutions Applied"));

const challenges = [
  {
    title: "Challenge 1 — Data persistence without a backend",
    problem: "I wanted the site to work on static hosting, but also needed persistent data across sessions.",
    solution: [
      bold("Solution: "),
      T("Used the localStorage API, wrapped in a clean DB object that mimics a database interface. Seed data loads on first visit and persists until the user clears browser storage."),
    ],
  },
  {
    title: "Challenge 2 — Responsive event grid",
    problem: "Cards looked awkward on different screen sizes — either too narrow on mobile or too wide on ultra-wide monitors.",
    solution: [
      bold("Solution: "),
      T("Used CSS Grid with "),
      new TextRun({ text: "repeat(auto-fill, minmax(320px, 1fr))", font: "Consolas", size: 22 }),
      T(" to automatically flow cards into as many columns as fit, with each card at least 320px wide."),
    ],
  },
  {
    title: "Challenge 3 — Poor-looking default authentication UI",
    problem: "My first version of the navbar showed plain \"Admin · Logout\" text that looked cluttered and unprofessional.",
    solution: [
      bold("Solution: "),
      T("Redesigned it as a gradient avatar pill plus a circular icon-only logout button with an SVG door icon. Hover states provide visual feedback."),
    ],
  },
  {
    title: "Challenge 4 — Password security",
    problem: "Since there is no backend, passwords must live in localStorage — which is visible to anyone with browser access.",
    solution: [
      bold("Solution: "),
      T("Documented as a known limitation. For a production app, I would implement a real backend with bcrypt-hashed passwords, HTTPS-only cookies, and server-side session management. For this educational project, the trade-off is acceptable and documented."),
    ],
  },
  {
    title: "Challenge 5 — Date format inconsistency",
    problem: "Date strings were being parsed inconsistently across browsers.",
    solution: [
      bold("Solution: "),
      T("All dates use ISO 8601 format internally ("),
      new TextRun({ text: "2026-05-15T14:00", font: "Consolas", size: 22 }),
      T("), and display dates are formatted with "),
      new TextRun({ text: "toLocaleDateString('en-US', ...)", font: "Consolas", size: 22 }),
      T(" for human-readable output."),
    ],
  },
];

challenges.forEach(c => {
  children.push(H3(c.title));
  children.push(P(c.problem));
  children.push(P(c.solution));
});

// ---------- SECTION 9 ----------
children.push(H1("9. GitHub Repository"));

children.push(P([bold("GitHub Username: "), new TextRun({ text: "betulkalsin", font: "Consolas", size: 22 })]));
children.push(P([
  bold("Repository URL: "),
  new ExternalHyperlink({
    children: [new TextRun({ text: "https://github.com/betulkalsin/eventhub", style: "Hyperlink", size: 22 })],
    link: "https://github.com/betulkalsin/eventhub",
  }),
]));
children.push(P([
  bold("Live Site: "),
  new ExternalHyperlink({
    children: [new TextRun({ text: "https://betulkalsin.github.io/eventhub/", style: "Hyperlink", size: 22 })],
    link: "https://betulkalsin.github.io/eventhub/",
  }),
]));

children.push(P("The repository contains all source files with a clear folder structure:"));
children.push(...codeBlock(`eventhub/
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
    └── app.js`));

// ---------- SECTION 10 ----------
children.push(H1("10. Conclusion"));

children.push(P("EventHub demonstrates that a rich, interactive web application can be built using only the three foundational web technologies — HTML, CSS, and JavaScript — combined with browser-native data storage. The project covers all core Internet Programming topics: semantic HTML, modern responsive CSS, dynamic DOM manipulation, event handling, form validation, client-side routing via query parameters, and persistent storage. Total codebase: roughly 2,300 lines across 12 files, with 46 sample events across 9 categories."));

children.push(P("Building this project reinforced how much modern browsers can do without a backend. It also illustrated the trade-offs: localStorage is fast and simple, but limited to per-device storage. For a real product, the natural next step would be to migrate the DB wrapper to a real backend API (keeping the same interface for minimal code change)."));

// SIGNATURE
children.push(new Paragraph({ spacing: { before: 400, after: 100 }, children: [T("")] }));
children.push(H3("Student Signature"));
children.push(P([bold("Date: "), T("____________________________")]));
children.push(new Paragraph({ spacing: { before: 200 }, children: [bold("Signature: "), T("____________________________")] }));

// ---------- BUILD DOCUMENT ----------
const doc = new Document({
  creator: "betulkalsin",
  title: "EventHub — Internet Programming Project Report",
  styles: {
    default: {
      document: { run: { font: "Calibri", size: 22 } },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Calibri", color: "1C2A2A" },
        paragraph: { spacing: { before: 360, after: 180 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Calibri", color: "2D5F5D" },
        paragraph: { spacing: { before: 280, after: 140 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 22, bold: true, font: "Calibri", color: "D97557" },
        paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: "•",
            alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } },
          },
        ],
      },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 12240, height: 15840 },
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: "EventHub — Project Report", size: 18, color: "6B7A78", italics: true })],
        })],
      }),
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "Page ", size: 18, color: "6B7A78" }),
            new TextRun({ children: [PageNumber.CURRENT], size: 18, color: "6B7A78" }),
          ],
        })],
      }),
    },
    children,
  }],
});

Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync("EventHub_Report.docx", buf);
  console.log("✅ EventHub_Report.docx created — " + (buf.length / 1024).toFixed(1) + " KB");
});
