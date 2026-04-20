/* ============================================
   APP.JS - Page logic & dynamic features
   ============================================ */

/* ---------- HELPERS ---------- */
function formatDate(dateStr) {
  const date = new Date(dateStr);
  const opts = { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return date.toLocaleDateString('en-US', opts);
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function showModal({ icon = '✅', title, message, onClose }) {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay show';
  modal.innerHTML = `
    <div class="modal">
      <div class="modal-icon">${icon}</div>
      <h3>${title}</h3>
      <p>${message}</p>
      <button class="btn btn-primary btn-block" id="modalClose">Got it</button>
    </div>
  `;
  document.body.appendChild(modal);
  document.getElementById('modalClose').addEventListener('click', () => {
    modal.remove();
    if (onClose) onClose();
  });
}

/* ---------- EVENT CARD TEMPLATE ---------- */
function createEventCard(event) {
  const priceText = event.price === 0 ? 'FREE' : `$${event.price}`;
  const priceClass = event.price === 0 ? 'event-badge free' : 'event-badge';
  const gradClass = CATEGORY_STYLES[event.category] || 'grad-tech';

  return `
    <div class="event-card">
      <div class="event-image ${gradClass}">
        <span>${event.icon || '🎉'}</span>
        <span class="${priceClass}">${priceText}</span>
      </div>
      <div class="event-body">
        <div class="event-category">${event.category}</div>
        <h3 class="event-title">${event.title}</h3>
        <div class="event-meta">
          <span>📅 ${formatDate(event.date)}</span>
          <span>📍 ${event.location}</span>
          <span>👥 ${event.registered} / ${event.capacity} attendees</span>
        </div>
        <a href="event-detail.html?id=${event.id}" class="btn btn-primary">View Details →</a>
      </div>
    </div>
  `;
}

/* ---------- HOME PAGE ---------- */
function loadHomePage() {
  const featured = document.getElementById('featuredEvents');
  if (!featured) return;

  const events = DB.get('events')
    .filter(e => new Date(e.date) > new Date())
    .sort((a, b) => b.registered - a.registered)
    .slice(0, 6);

  featured.innerHTML = events.length
    ? events.map(createEventCard).join('')
    : '<p class="empty-state">No events yet.</p>';

  // Update stats
  const allEvents = DB.get('events');
  const totalRegs = DB.get('registrations').length +
    allEvents.reduce((s, e) => s + e.registered, 0);
  const uniqueLocations = new Set(allEvents.map(e => e.location)).size;

  const setStat = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };
  setStat('statEvents', allEvents.length + '+');
  setStat('statAttendees', totalRegs + '+');
  setStat('statCities', uniqueLocations);

  // Category counts
  const catCounts = {};
  allEvents.forEach(e => { catCounts[e.category] = (catCounts[e.category] || 0) + 1; });
  document.querySelectorAll('[data-category-count]').forEach(el => {
    const cat = el.dataset.categoryCount;
    el.textContent = `${catCounts[cat] || 0} events`;
  });
}

/* ---------- EVENTS PAGE ---------- */
function loadEventsPage() {
  const grid = document.getElementById('eventsGrid');
  if (!grid) return;

  const searchInput = document.getElementById('searchInput');
  const categoryFilter = document.getElementById('categoryFilter');
  const priceFilter = document.getElementById('priceFilter');

  const preCategory = getQueryParam('category');
  if (preCategory && categoryFilter) categoryFilter.value = preCategory;

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
    if (price === 'paid') events = events.filter(e => e.price > 0);

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    const countEl = document.getElementById('resultCount');
    if (countEl) countEl.textContent = `${events.length} event${events.length !== 1 ? 's' : ''} found`;

    grid.innerHTML = events.length
      ? events.map(createEventCard).join('')
      : '<div class="empty-state" style="grid-column: 1 / -1;"><div class="icon">🔍</div><h3>No events found</h3><p>Try adjusting your filters or search term.</p></div>';
  }

  searchInput.addEventListener('input', render);
  categoryFilter.addEventListener('change', render);
  priceFilter.addEventListener('change', render);
  render();
}

/* ---------- EVENT DETAIL ---------- */
function loadEventDetail() {
  const container = document.getElementById('eventDetail');
  if (!container) return;

  const id = parseInt(getQueryParam('id'));
  const event = DB.findById('events', id);

  if (!event) {
    container.innerHTML = '<div class="empty-state"><div class="icon">❌</div><h3>Event not found</h3><p><a href="events.html" class="btn btn-primary" style="margin-top:1rem;">Back to Events</a></p></div>';
    return;
  }

  const user = Auth.getCurrentUser();
  const registrations = DB.get('registrations');
  const alreadyRegistered = user && registrations.some(r => r.userId === user.id && r.eventId === event.id);
  const isFull = event.registered >= event.capacity;
  const percentFull = Math.min(100, (event.registered / event.capacity) * 100);
  const priceText = event.price === 0 ? 'Free' : `$${event.price}`;
  const gradClass = CATEGORY_STYLES[event.category] || 'grad-tech';

  let buttonHtml = '';
  if (alreadyRegistered) {
    buttonHtml = '<button class="btn btn-secondary btn-block" disabled>✓ Already Registered</button>';
  } else if (isFull) {
    buttonHtml = '<button class="btn btn-danger btn-block" disabled>Sold Out</button>';
  } else {
    buttonHtml = `<button class="btn btn-accent btn-block" id="registerBtn">Register for this Event</button>`;
  }

  container.innerHTML = `
    <div class="event-hero ${gradClass}">
      <div class="event-hero-icon">${event.icon || '🎉'}</div>
      <h1>${event.title}</h1>
      <div class="event-hero-meta">
        <span>📅 ${formatDate(event.date)}</span>
        <span>📍 ${event.location}</span>
        <span>💰 ${priceText}</span>
      </div>
    </div>

    <div class="event-content">
      <div class="event-category">${event.category}</div>
      <h2>About this Event</h2>
      <p>${event.description}</p>

      <div class="countdown" id="countdown">
        <div class="countdown-title">Starts In</div>
        <div class="countdown-grid">
          <div class="countdown-box"><span class="num" id="cd-days">0</span><span class="label">Days</span></div>
          <div class="countdown-box"><span class="num" id="cd-hours">0</span><span class="label">Hours</span></div>
          <div class="countdown-box"><span class="num" id="cd-mins">0</span><span class="label">Minutes</span></div>
          <div class="countdown-box"><span class="num" id="cd-secs">0</span><span class="label">Seconds</span></div>
        </div>
      </div>

      <h2>Capacity</h2>
      <p style="margin-bottom: 0.5rem;"><strong style="color: var(--dark);">${event.registered}</strong> / ${event.capacity} attendees registered</p>
      <div class="capacity-bar">
        <div class="capacity-fill" style="width: ${percentFull}%"></div>
      </div>

      <h2 style="margin-top: 2rem;">Organizer</h2>
      <p>👤 ${event.organizerName}</p>

      <div style="margin-top: 2rem;">
        ${buttonHtml}
      </div>
    </div>
  `;

  startCountdown(event.date);

  const regBtn = document.getElementById('registerBtn');
  if (regBtn) {
    regBtn.addEventListener('click', () => registerForEvent(event.id));
  }
}

function startCountdown(dateStr) {
  const target = new Date(dateStr).getTime();

  function update() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      const el = document.getElementById('countdown');
      if (el) el.innerHTML = '<div class="countdown-title">This event has already started or ended</div>';
      return;
    }

    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);

    const d = document.getElementById('cd-days');
    const h = document.getElementById('cd-hours');
    const m = document.getElementById('cd-mins');
    const s = document.getElementById('cd-secs');
    if (d) d.textContent = days;
    if (h) h.textContent = hours;
    if (m) m.textContent = mins;
    if (s) s.textContent = secs;
  }

  update();
  setInterval(update, 1000);
}

function registerForEvent(eventId) {
  const user = Auth.getCurrentUser();
  if (!user) {
    alert('Please log in to register for events.');
    window.location.href = 'login.html';
    return;
  }

  const event = DB.findById('events', eventId);
  if (event.registered >= event.capacity) {
    alert('This event is fully booked.');
    return;
  }

  DB.add('registrations', {
    userId: user.id,
    eventId: eventId,
    date: new Date().toISOString()
  });

  DB.update('events', eventId, { registered: event.registered + 1 });

  showModal({
    icon: '🎉',
    title: 'You\'re registered!',
    message: `See you at "${event.title}". Check your profile for details.`,
    onClose: () => location.reload()
  });
}

/* ---------- LOGIN ---------- */
function setupLoginForm() {
  const form = document.getElementById('loginForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('formError');

    errorEl.classList.remove('show');

    if (!email || !password) {
      errorEl.textContent = 'Please fill in all fields.';
      errorEl.classList.add('show');
      return;
    }

    const result = Auth.login(email, password);
    if (result.success) {
      window.location.href = 'index.html';
    } else {
      errorEl.textContent = result.message;
      errorEl.classList.add('show');
    }
  });
}

/* ---------- REGISTER ---------- */
function setupRegisterForm() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const password2 = document.getElementById('password2').value;
    const role = document.getElementById('role').value;
    const errorEl = document.getElementById('formError');

    errorEl.classList.remove('show');

    if (!name || !email || !password || !role) {
      errorEl.textContent = 'Please fill in all fields.';
      errorEl.classList.add('show');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      errorEl.classList.add('show');
      return;
    }

    if (password.length < 6) {
      errorEl.textContent = 'Password must be at least 6 characters long.';
      errorEl.classList.add('show');
      return;
    }

    if (password !== password2) {
      errorEl.textContent = 'Passwords do not match.';
      errorEl.classList.add('show');
      return;
    }

    const result = Auth.register(name, email, password, role);
    if (result.success) {
      showModal({
        icon: '🎉',
        title: 'Welcome to EventHub!',
        message: 'Your account has been created successfully.',
        onClose: () => window.location.href = 'index.html'
      });
    } else {
      errorEl.textContent = result.message;
      errorEl.classList.add('show');
    }
  });
}

/* ---------- CREATE EVENT ---------- */
function setupCreateEventForm() {
  const form = document.getElementById('createEventForm');
  if (!form) return;

  if (!Auth.requireAuth()) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = Auth.getCurrentUser();

    const title = document.getElementById('title').value.trim();
    const description = document.getElementById('description').value.trim();
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const location = document.getElementById('location').value.trim();
    const capacity = parseInt(document.getElementById('capacity').value);
    const price = parseFloat(document.getElementById('price').value) || 0;
    const icon = document.getElementById('icon').value || '🎉';

    const errorEl = document.getElementById('formError');
    errorEl.classList.remove('show');

    if (!title || !description || !category || !date || !location || !capacity) {
      errorEl.textContent = 'Please fill in all required fields.';
      errorEl.classList.add('show');
      return;
    }

    if (new Date(date) < new Date()) {
      errorEl.textContent = 'Event date cannot be in the past.';
      errorEl.classList.add('show');
      return;
    }

    if (capacity < 1) {
      errorEl.textContent = 'Capacity must be at least 1.';
      errorEl.classList.add('show');
      return;
    }

    DB.add('events', {
      title, description, category, date, location,
      capacity, price, icon,
      registered: 0,
      organizerId: user.id,
      organizerName: user.name
    });

    showModal({
      icon: '🎉',
      title: 'Event Published!',
      message: 'Your event is now live and visible to attendees.',
      onClose: () => window.location.href = 'events.html'
    });
  });
}

/* ---------- PROFILE ---------- */
function loadProfilePage() {
  const container = document.getElementById('profileContent');
  if (!container) return;

  if (!Auth.requireAuth()) return;

  const user = Auth.getCurrentUser();
  document.getElementById('avatar').textContent = user.name.charAt(0).toUpperCase();
  document.getElementById('userName').textContent = user.name;
  document.getElementById('userEmail').textContent = user.email;
  document.getElementById('userRole').textContent = user.role === 'organizer' ? 'Organizer' : 'Attendee';

  const registeredTab = document.getElementById('tab-registered');
  const organizedTab = document.getElementById('tab-organized');

  function showRegistered() {
    registeredTab.classList.add('active');
    organizedTab.classList.remove('active');

    const regs = DB.get('registrations').filter(r => r.userId === user.id);
    const events = regs.map(r => DB.findById('events', r.eventId)).filter(Boolean);

    container.innerHTML = events.length
      ? `<div class="event-grid">${events.map(createEventCard).join('')}</div>`
      : '<div class="empty-state"><div class="icon">📅</div><h3>No registered events yet</h3><p style="margin-bottom:1.5rem;">Explore and register for exciting events.</p><a href="events.html" class="btn btn-primary">Browse Events</a></div>';
  }

  function showOrganized() {
    organizedTab.classList.add('active');
    registeredTab.classList.remove('active');

    const events = DB.get('events').filter(e => e.organizerId === user.id);

    container.innerHTML = events.length
      ? `<div class="event-grid">${events.map(createEventCard).join('')}</div>`
      : '<div class="empty-state"><div class="icon">✨</div><h3>No events created yet</h3><p style="margin-bottom:1.5rem;">Create your first event and start building your community.</p><a href="create-event.html" class="btn btn-primary">Create Event</a></div>';
  }

  registeredTab.addEventListener('click', showRegistered);
  organizedTab.addEventListener('click', showOrganized);
  showRegistered();
}

/* ---------- INIT ---------- */
document.addEventListener('DOMContentLoaded', () => {
  loadHomePage();
  loadEventsPage();
  loadEventDetail();
  setupLoginForm();
  setupRegisterForm();
  setupCreateEventForm();
  loadProfilePage();
});
