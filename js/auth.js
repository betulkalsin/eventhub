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
    authLinks.innerHTML = `
      <li><a href="profile.html">👤 ${user.name.split(' ')[0]}</a></li>
      <li><a href="#" onclick="Auth.logout(); return false;">Logout</a></li>
    `;
  } else {
    authLinks.innerHTML = `
      <li><a href="login.html">Login</a></li>
      <li><a href="register.html" class="btn btn-primary" style="padding: 0.6rem 1.25rem; font-size: 0.9rem;">Sign Up</a></li>
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
