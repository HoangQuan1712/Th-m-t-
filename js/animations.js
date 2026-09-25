/* ============================================================
   THÁM TỬ KINH TẾ — ANIMATIONS & SCROLL REVEAL
   ============================================================ */

/* ── Intersection Observer (Scroll Reveal) ────────────────── */
const RevealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Unobserve after reveal (performance)
      if (!entry.target.dataset.repeat) {
        RevealObserver.unobserve(entry.target);
      }
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

function initScrollReveal() {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .timeline-item').forEach(el => {
    RevealObserver.observe(el);
  });
}

/* ── Counter Animation ────────────────────────────────────── */
function animateCounter(el, target, duration = 2000, prefix = '', suffix = '') {
  const start = performance.now();
  const isFloat = target % 1 !== 0;

  function update(time) {
    const elapsed = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;

    el.textContent = prefix + (isFloat ? current.toFixed(1) : Math.floor(current).toLocaleString('vi-VN')) + suffix;

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = true;
        const target = parseFloat(entry.target.dataset.counter);
        const prefix = entry.target.dataset.prefix || '';
        const suffix = entry.target.dataset.suffix || '';
        const duration = parseInt(entry.target.dataset.duration || '2000');
        animateCounter(entry.target, target, duration, prefix, suffix);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));
}

/* ── Hero Particle Canvas ─────────────────────────────────── */
function initParticles(canvasId = 'hero-particles') {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = canvas.height + 10;
      this.size = Math.random() * 2 + 0.5;
      this.speedY = -(Math.random() * 0.8 + 0.3);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = 0;
      this.maxOpacity = Math.random() * 0.4 + 0.1;
      this.life = 0;
      this.maxLife = Math.random() * 200 + 100;
      // Gold or blue particles
      this.color = Math.random() > 0.7
        ? `rgba(212,160,23,${this.maxOpacity})`
        : `rgba(100,140,255,${this.maxOpacity * 0.5})`;
    }
    update() {
      this.life++;
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.life < 20) this.opacity = (this.life / 20) * this.maxOpacity;
      else if (this.life > this.maxLife - 20) this.opacity = ((this.maxLife - this.life) / 20) * this.maxOpacity;
      else this.opacity = this.maxOpacity;
      if (this.life >= this.maxLife) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: 60 }, () => {
      const p = new Particle();
      p.y = Math.random() * canvas.height; // Start spread
      p.life = Math.random() * p.maxLife;
      return p;
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    animId = requestAnimationFrame(animate);
  }

  init();
  animate();

  const ro = new ResizeObserver(resize);
  ro.observe(canvas.parentElement);

  return () => {
    cancelAnimationFrame(animId);
    ro.disconnect();
  };
}

/* ── Card 3D Tilt ─────────────────────────────────────────── */
function initCardTilt() {
  document.querySelectorAll('.card-tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

/* ── Typewriter Effect ────────────────────────────────────── */
function typewriterEffect(el, texts, speed = 80, pause = 2000) {
  if (!el) return;
  let textIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = texts[textIndex];
    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
      if (charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % texts.length;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, speed / 2);
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
      if (charIndex === current.length) {
        isDeleting = true;
        setTimeout(type, pause);
        return;
      }
      setTimeout(type, speed);
    }
  }
  type();
}

/* ── Navbar scroll behavior ───────────────────────────────── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  }, { passive: true });

  // Mobile toggle
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('nav-mobile');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
    });
    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        mobileMenu.classList.remove('open');
      }
    });
  }
}

/* ── Active nav link ──────────────────────────────────────── */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === path || (path === '' && href === 'index.html'))) {
      link.classList.add('active');
    }
  });
}

/* ── Tab System ───────────────────────────────────────────── */
function initTabs(containerId) {
  const container = document.getElementById(containerId) || document;
  container.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;
      const parent = btn.closest('[data-tabs]') || container;

      parent.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      parent.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      const panel = parent.querySelector(`#tab-${tabId}`) || document.getElementById(`tab-${tabId}`);
      if (panel) panel.classList.add('active');
    });
  });
}

/* ── Modal System ─────────────────────────────────────────── */
function openModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function closeModal(id) {
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  }
}

function initModals() {
  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  });
  // Close buttons
  document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.modal-overlay')?.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
  // ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.open').forEach(m => {
        m.classList.remove('open');
        document.body.style.overflow = '';
      });
    }
  });
}

/* ── Smooth page transitions ──────────────────────────────── */
function initPageTransitions() {
  document.body.classList.add('page-fade');
}

/* ── Init all animations ──────────────────────────────────── */
function initAnimations() {
  initScrollReveal();
  initCounters();
  initNavbar();
  setActiveNavLink();
  initModals();
  initTabs();
  initCardTilt();
  initPageTransitions();
}

document.addEventListener('DOMContentLoaded', initAnimations);
