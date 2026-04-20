/* ============================================
   AUTH.JS - Session & authentication
   ============================================ */

const Auth = {
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  setCurrentUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
  },

  logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  },

  register(name, email, password, role) {
    const users = DB.get('users');

    if (users.find(u => u.email === email)) {
      return { success: false, message: 'This email address is already registered.' };
    }

    const user = DB.add('users', { name, email, password, role });
    Auth.setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { success: true, user };
  },

  login(email, password) {
    const users = DB.get('users');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }

    Auth.setCurrentUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { success: true, user };
  },

  requireAuth() {
    if (!Auth.getCurrentUser()) {
      alert('You must log in to view this page.');
      window.location.href = 'login.html';
      return false;
    }
    return true;
  }
};

/* Update navbar based on session */
function updateNavbar() {
  const user = Auth.getCurrentUser();
  const authLinks = document.getElementById('authLinks');
  if (!authLinks) return;

  if (user) {
    const initial = user.name.charAt(0).toUpperCase();
    const firstName = user.name.split(' ')[0];
    authLinks.innerHTML = `
      <li class="user-menu">
        <a href="profile.html" class="user-pill">
          <span class="user-avatar">${initial}</span>
          <span class="user-name">${firstName}</span>
        </a>
        <button class="logout-btn" onclick="Auth.logout()" title="Log out" aria-label="Log out">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
        </button>
      </li>
    `;
  } else {
    authLinks.innerHTML = `
      <li class="auth-buttons">
        <a href="login.html" class="nav-login">Log in</a>
        <a href="register.html" class="btn btn-accent nav-signup">Sign up</a>
      </li>
    `;
  }
}

function setupMobileMenu() {
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('show'));
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateNavbar();
  setupMobileMenu();
});
