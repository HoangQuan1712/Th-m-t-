/* ============================================================
   THÁM TỬ KINH TẾ — AUTH ENGINE v2
   localStorage-based login / register / session
   ============================================================ */

const AUTH = (() => {
  const USERS_KEY   = 'thamtu_users';
  const SESSION_KEY = 'thamtu_session';

  /* ── Seed admin account ──────────────────────────────────── */
  function _seedAdmin() {
    const users = _getUsers();
    if (!users.find(u => u.email === 'admin@thamtu.vn')) {
      users.push({
        id:       'admin-001',
        name:     'Admin Thám Tử',
        email:    'admin@thamtu.vn',
        password: _hash('ThamTuKT@2024'),
        role:     'admin',
        vip:      true,
        joinedAt: '2024-01-01',
        avatar:   'AD'
      });
      _saveUsers(users);
    }
  }

  /* ── Storage helpers ─────────────────────────────────────── */
  function _getUsers() {
    try { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
    catch { return []; }
  }
  function _saveUsers(users) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }
  function _hash(str) {
    // Simple djb2 hash — NOT secure, demo only
    let h = 5381;
    for (let i = 0; i < str.length; i++) h = ((h << 5) + h) ^ str.charCodeAt(i);
    return (h >>> 0).toString(36);
  }
  function _initials(name) {
    return name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  }

  /* ── Session ─────────────────────────────────────────────── */
  function getSession() {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)); }
    catch { return null; }
  }
  function setSession(user) {
    const s = { id: user.id, name: user.name, email: user.email,
                role: user.role, vip: !!user.vip, avatar: user.avatar || _initials(user.name) };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    return s;
  }
  function clearSession() {
    sessionStorage.removeItem(SESSION_KEY);
  }

  /* ── Auth API ────────────────────────────────────────────── */
  function login(email, password) {
    _seedAdmin();
    const users = _getUsers();
    const user  = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === _hash(password));
    if (!user) return { ok: false, msg: 'Email hoặc mật khẩu không đúng.' };
    const s = setSession(user);
    return { ok: true, user: s };
  }

  function register(data) {
    // data: { name, email, password, role }
    _seedAdmin();
    const users = _getUsers();
    if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase()))
      return { ok: false, msg: 'Email này đã được đăng ký.' };

    const newUser = {
      id:       'u-' + Date.now(),
      name:     data.name.trim(),
      email:    data.email.toLowerCase().trim(),
      password: _hash(data.password),
      role:     data.role || 'member',   // member | author
      vip:      false,
      joinedAt: new Date().toISOString().slice(0, 10),
      avatar:   _initials(data.name)
    };
    users.push(newUser);
    _saveUsers(users);
    const s = setSession(newUser);
    return { ok: true, user: s };
  }

  function logout() {
    clearSession();
    window.location.href = 'index.html';
  }

  function updateProfile(data) {
    const session = getSession();
    if (!session) return { ok: false, msg: 'Chưa đăng nhập.' };
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === session.id);
    if (idx === -1) return { ok: false, msg: 'Không tìm thấy tài khoản.' };

    if (data.name)     users[idx].name = data.name.trim();
    if (data.password) users[idx].password = _hash(data.password);
    users[idx].avatar = _initials(users[idx].name);
    _saveUsers(users);
    setSession(users[idx]);
    return { ok: true };
  }

  function upgradeVip(userId) {
    const users = _getUsers();
    const idx   = users.findIndex(u => u.id === userId);
    if (idx !== -1) { users[idx].vip = true; _saveUsers(users); }
    const s = getSession();
    if (s && s.id === userId) { s.vip = true; sessionStorage.setItem(SESSION_KEY, JSON.stringify(s)); }
  }

  /* ── Permission helpers ──────────────────────────────────── */
  function can(action) {
    const s = getSession();
    const role = s ? s.role : 'guest';
    const vip  = s ? s.vip  : false;

    switch (action) {
      case 'view_case_detail': return !!s;                          // must be logged in
      case 'view_classic':    return vip || role === 'admin';       // VIP or admin
      case 'download':        return vip || role === 'admin';
      case 'play_game':       return vip || role === 'admin';
      case 'comment':         return !!s;
      case 'post_article':    return role === 'author' || role === 'admin';
      case 'admin_panel':     return role === 'admin';
      default:                return false;
    }
  }

  /* ── Navbar render ───────────────────────────────────────── */
  function renderNavbar() {
    const s = getSession();
    const navRight = document.getElementById('nav-auth-area');
    if (!navRight) return;

    if (!s) {
      navRight.innerHTML = `
        <a href="login.html" class="btn btn-ghost btn-sm">Đăng nhập</a>
        <a href="register.html" class="btn btn-primary btn-sm">Đăng ký</a>
      `;
    } else {
      const vipBadge = s.vip ? '<span class="badge badge-vip" style="font-size:0.65rem;padding:2px 6px;">VIP</span>' : '';
      const roleBadge = s.role === 'admin'  ? '🔑'
                      : s.role === 'author' ? '✍️'
                      : '';
      navRight.innerHTML = `
        <div class="nav-avatar-menu" id="nav-avatar-menu">
          <button class="nav-avatar-btn" onclick="document.getElementById('nav-avatar-dropdown').classList.toggle('open')">
            <div class="avatar-circle">${s.avatar}</div>
            <span class="avatar-name">${s.name.split(' ').pop()} ${roleBadge}</span>
            ${vipBadge}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m6 9 6 6 6-6"/></svg>
          </button>
          <div class="nav-dropdown" id="nav-avatar-dropdown">
            <a href="profile.html" class="nav-dropdown-item">👤 Hồ sơ cá nhân</a>
            ${s.vip ? '' : '<a href="resources.html#vip" class="nav-dropdown-item">⭐ Nâng cấp VIP</a>'}
            ${s.role === 'admin' ? '<a href="admin.html" class="nav-dropdown-item">⚙️ Admin Portal</a>' : ''}
            ${s.role === 'author' ? '<a href="admin.html#submit" class="nav-dropdown-item">✍️ Gửi bài viết</a>' : ''}
            <div class="nav-dropdown-sep"></div>
            <button class="nav-dropdown-item text-red" onclick="AUTH.logout()">🚪 Đăng xuất</button>
          </div>
        </div>
      `;
      // Close dropdown on outside click
      document.addEventListener('click', e => {
        const menu = document.getElementById('nav-avatar-menu');
        if (menu && !menu.contains(e.target)) {
          const dd = document.getElementById('nav-avatar-dropdown');
          if (dd) dd.classList.remove('open');
        }
      });
    }
  }

  /* ── Login Gate Modal ────────────────────────────────────── */
  function showLoginGate(reason) {
    let modal = document.getElementById('login-gate-modal');
    if (!modal) {
      modal = document.createElement('div');
      modal.id = 'login-gate-modal';
      modal.className = 'modal-overlay';
      modal.innerHTML = `
        <div class="modal" style="max-width:420px;text-align:center;">
          <div class="modal-body" style="padding:var(--space-8);">
            <div style="font-size:3rem;margin-bottom:var(--space-4);">🔐</div>
            <h3 style="font-size:1.1rem;margin-bottom:var(--space-2);" id="gate-title">Cần đăng nhập</h3>
            <p class="text-sm text-muted mb-6" id="gate-msg">Vui lòng đăng nhập để tiếp tục.</p>
            <div class="flex gap-3" style="justify-content:center;">
              <a href="login.html" class="btn btn-primary">🔑 Đăng nhập</a>
              <a href="register.html" class="btn btn-secondary">✨ Đăng ký miễn phí</a>
            </div>
            <button onclick="document.getElementById('login-gate-modal').classList.remove('open')"
              style="display:block;margin:var(--space-4) auto 0;background:none;border:none;color:var(--text-faint);font-size:0.8rem;cursor:pointer;">
              Để sau
            </button>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    const messages = {
      view_case:     { title: '🕵️ Mở khóa Hồ sơ Vụ án', msg: 'Đăng nhập để đọc toàn bộ phân tích vụ án chi tiết.' },
      view_classic:  { title: '⭐ Nội dung VIP', msg: 'Vụ án kinh điển chỉ dành cho thành viên VIP. Nâng cấp ngay!' },
      download:      { title: '📥 Tải tài liệu', msg: 'Chỉ thành viên VIP mới được tải tài liệu chuyên sâu.' },
      play_game:     { title: '🎮 Trải nghiệm Game', msg: 'Audit Simulator chỉ dành cho thành viên VIP.' },
      comment:       { title: '💬 Tham gia thảo luận', msg: 'Đăng nhập để bình luận và trao đổi cùng cộng đồng.' },
    };
    const m = messages[reason] || { title: 'Cần đăng nhập', msg: 'Vui lòng đăng nhập để tiếp tục.' };

    // If VIP required and user is logged in → show VIP upgrade modal instead
    const s = getSession();
    if (s && (reason === 'view_classic' || reason === 'download' || reason === 'play_game')) {
      document.getElementById('gate-title').textContent = m.title;
      document.getElementById('gate-msg').textContent = m.msg;
      modal.querySelector('.flex').innerHTML = `
        <a href="resources.html#vip" class="btn btn-primary">⭐ Nâng cấp VIP</a>
        <button onclick="document.getElementById('login-gate-modal').classList.remove('open')" class="btn btn-ghost">Để sau</button>
      `;
    } else {
      document.getElementById('gate-title').textContent = m.title;
      document.getElementById('gate-msg').textContent = m.msg;
      modal.querySelector('.flex').innerHTML = `
        <a href="login.html" class="btn btn-primary">🔑 Đăng nhập</a>
        <a href="register.html" class="btn btn-secondary">✨ Đăng ký miễn phí</a>
      `;
    }
    modal.classList.add('open');
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    _seedAdmin();
    renderNavbar();
  }

  /* ── Public ──────────────────────────────────────────────── */
  return { init, login, register, logout, updateProfile, upgradeVip,
           getSession, can, showLoginGate, renderNavbar };
})();

/* ── Global helpers ──────────────────────────────────────────── */
function showToast(msg, type = 'info', duration = 3000) {
  const container = document.getElementById('toast-container')
    || (() => { const d = document.createElement('div'); d.id = 'toast-container'; d.className = 'toast-container'; document.body.appendChild(d); return d; })();
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.textContent = msg;
  container.appendChild(t);
  setTimeout(() => t.remove(), duration);
}

function openModal(id)  { const m = document.getElementById(id); if (m) m.classList.add('open'); }
function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }

function initTabs(scopeId) {
  const scope = document.getElementById(scopeId) || document;
  scope.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      scope.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active','btn-secondary'); b.classList.add('btn-ghost'); });
      scope.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active','btn-secondary'); btn.classList.remove('btn-ghost');
      const panel = document.getElementById('tab-' + target);
      if (panel) panel.classList.add('active');
    });
  });
}
