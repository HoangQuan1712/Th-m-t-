/* ============================================================
   THÁM TỬ KINH TẾ — AUTH MOCK SYSTEM
   Giả lập phân quyền: Guest / Member / Author / Admin
   ============================================================ */

const AUTH = {
  ROLES: {
    GUEST:  { role: 'guest',  name: 'Độc giả',                badge: null,                  color: 'text-muted' },
    MEMBER: { role: 'member', name: 'Sinh viên KTV',           badge: 'Junior KTV',          color: 'badge-blue' },
    AUTHOR: { role: 'author', name: 'Cộng tác viên',           badge: 'Senior Auditor',      color: 'badge-gold' },
    ADMIN:  { role: 'admin',  name: 'Thám tử Kinh tế (Founder)', badge: 'Admin Master',      color: 'badge-vip'  }
  },

  STORAGE_KEY: 'thamtu_current_role',
  USER_KEY: 'thamtu_user',

  // Get current role
  getRole() {
    return localStorage.getItem(this.STORAGE_KEY) || 'guest';
  },

  // Get full role info
  getRoleInfo() {
    const role = this.getRole();
    return this.ROLES[role.toUpperCase()] || this.ROLES.GUEST;
  },

  // Set role
  setRole(role) {
    if (!this.ROLES[role.toUpperCase()]) return;
    localStorage.setItem(this.STORAGE_KEY, role.toLowerCase());
    this.updateUI();
    showToast(`Đã chuyển sang chế độ: ${this.ROLES[role.toUpperCase()].name}`, 'info');
  },

  // Check permissions
  isAdmin()  { return this.getRole() === 'admin'; },
  isAuthor() { return ['admin', 'author'].includes(this.getRole()); },
  isMember() { return ['admin', 'author', 'member'].includes(this.getRole()); },
  isGuest()  { return this.getRole() === 'guest'; },

  // Get mock username
  getDisplayName() {
    const saved = localStorage.getItem(this.USER_KEY);
    if (saved) return JSON.parse(saved).name;
    const role = this.getRole();
    const names = {
      guest: 'Khách',
      member: 'Nguyễn Văn A',
      author: 'Trần Thị B (CPA)',
      admin: 'Founder 🕵️'
    };
    return names[role] || 'Khách';
  },

  // Get avatar initials
  getInitials() {
    const name = this.getDisplayName();
    return name.split(' ').slice(-2).map(w => w[0]).join('').toUpperCase().slice(0, 2);
  },

  // Update entire UI based on role
  updateUI() {
    const role = this.getRole();
    const info = this.getRoleInfo();

    // Update role selector
    const selector = document.getElementById('role-select');
    if (selector) selector.value = role;

    // Show/hide admin-only elements
    document.querySelectorAll('[data-role-min]').forEach(el => {
      const minRole = el.dataset.roleMin;
      const allowed = this.canAccess(minRole);
      el.style.display = allowed ? '' : 'none';
    });

    // Update user display in nav
    const userDisplay = document.getElementById('nav-user-display');
    if (userDisplay) {
      userDisplay.innerHTML = `
        <div class="avatar">${this.getInitials()}</div>
        <span class="text-sm font-medium">${this.getDisplayName()}</span>
        ${info.badge ? `<span class="badge ${info.color}">${info.badge}</span>` : ''}
      `;
    }

    // Admin nav item
    const adminNavItem = document.getElementById('admin-nav-link');
    if (adminNavItem) {
      adminNavItem.style.display = this.isAdmin() ? '' : 'none';
    }

    // VIP content
    document.querySelectorAll('.vip-gate').forEach(el => {
      if (this.isMember()) {
        el.classList.remove('locked');
        const lock = el.querySelector('.vip-overlay');
        if (lock) lock.style.display = 'none';
      } else {
        el.classList.add('locked');
      }
    });

    // Emit event
    document.dispatchEvent(new CustomEvent('roleChanged', { detail: { role, info } }));
  },

  // Check if current role can access minimum required role
  canAccess(minRole) {
    const hierarchy = { guest: 0, member: 1, author: 2, admin: 3 };
    return (hierarchy[this.getRole()] || 0) >= (hierarchy[minRole] || 0);
  },

  // Mock login
  login(role = 'member', name = null) {
    this.setRole(role);
    if (name) {
      localStorage.setItem(this.USER_KEY, JSON.stringify({ name }));
    }
  },

  // Mock logout
  logout() {
    this.setRole('guest');
    localStorage.removeItem(this.USER_KEY);
    showToast('Đã đăng xuất', 'info');
  },

  // Admin password check (client-side only — demo)
  checkAdminPassword(pwd) {
    const hash = btoa(pwd + 'thamtu_salt_2024');
    const stored = btoa('ThamTuKT@2024thamtu_salt_2024');
    return hash === stored;
  },

  // Init on page load
  init() {
    // Sync selector
    const selector = document.getElementById('role-select');
    if (selector) {
      selector.value = this.getRole();
      selector.addEventListener('change', (e) => {
        this.setRole(e.target.value);
      });
    }

    this.updateUI();
  }
};

/* ── Comment Badge System ─────────────────────────────────── */
const BADGES = {
  JUNIOR: { label: 'Junior KTV', threshold: 1, icon: '🎓' },
  SENIOR: { label: 'Senior Auditor', threshold: 10, icon: '🏆' },
  MASTER: { label: 'Thám tử Kế toán', threshold: 50, icon: '🕵️' }
};

function getUserBadge(upvotes = 0, comments = 0) {
  if (upvotes >= BADGES.MASTER.threshold) return BADGES.MASTER;
  if (upvotes >= BADGES.SENIOR.threshold) return BADGES.SENIOR;
  if (comments >= BADGES.JUNIOR.threshold) return BADGES.JUNIOR;
  return null;
}

/* ── Toast Helper (shared) ────────────────────────────────── */
function showToast(message, type = 'info', duration = 3500) {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const icons = { success: '✅', error: '❌', info: '💡' };
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${icons[type] || '💡'}</span><span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(60px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, duration);
}
