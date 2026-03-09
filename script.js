/* ====================================================
   MR Group — script.js
   ==================================================== */

/* ── LOADER ────────────────────────────────────────── */
(function () {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  let progress = 0;

  const tick = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(tick);
      fill.style.width = '100%';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        startAnimations();
      }, 400);
    }
    fill.style.width = Math.min(progress, 100) + '%';
  }, 60);

  document.body.style.overflow = 'hidden';
})();

/* ── CUSTOM CURSOR ──────────────────────────────────── */
const cursor   = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');

if (cursor && follower) {
  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animFollower);
  })();

  document.querySelectorAll('a, button, .service-card, .work-card, .team-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hovering');
      follower.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hovering');
      follower.classList.remove('hovering');
    });
  });
}

/* ── HERO CANVAS PARTICLES ──────────────────────────── */
function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.r  = Math.random() * 1.5 + 0.4;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx; this.y += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(232,255,87,${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < 80; i++) particles.push(new Particle());

  // Connect nearby particles
  function drawLines() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(232,255,87,${0.06 * (1 - dist / 100)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawLines();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ── HEADER SCROLL ──────────────────────────────────── */
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
  });
}


/* ── BURGER MENU ────────────────────────────────────── */
function initBurger() {
  const burger = document.getElementById('burger');
  const nav    = document.getElementById('nav');

  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    nav.classList.toggle('open');
  });

  // Close on nav link click
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      burger.classList.remove('active');
      nav.classList.remove('open');
    });
  });
}

/* ── COUNTER ANIMATION ──────────────────────────────── */
function animateCounters() {
  document.querySelectorAll('.stat-num').forEach(el => {
    const target = +el.dataset.target;
    let current  = 0;
    const step   = target / 60;

    const update = () => {
      current = Math.min(current + step, target);
      el.textContent = Math.round(current);
      if (current < target) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  });
}

/* ── SCROLL REVEAL ──────────────────────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.service-card, .work-card, .team-card, .review-card, .feature-item, .stack-category, .process-step').forEach(el => {
    el.classList.add('reveal');
    observer.observe(el);
  });

  // Stagger children
  ['services-grid', 'works-grid', 'team-grid', 'stack-categories'].forEach(cls => {
    const grid = document.querySelector('.' + cls);
    if (!grid) return;
    const children = grid.querySelectorAll('.reveal');
    children.forEach((child, i) => {
      child.style.transitionDelay = (i * 0.08) + 's';
    });
  });
}

/* ── PROCESS STEPS REVEAL ───────────────────────────── */
function initProcessReveal() {
  const steps    = document.querySelectorAll('.process-step');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  steps.forEach((step, i) => {
    step.style.transitionDelay = (i * 0.1) + 's';
    observer.observe(step);
  });
}

/* ── PORTFOLIO FILTER ───────────────────────────────── */
function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards   = document.querySelectorAll('.work-card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.transition = 'opacity 0.4s, transform 0.4s';
        if (show) {
          card.style.opacity  = '1';
          card.style.transform = 'scale(1)';
          card.style.display  = '';
        } else {
          card.style.opacity  = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (btn.dataset.filter !== 'all' && card.dataset.cat !== btn.dataset.filter) {
              card.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });
}

/* ── CONTACT FORM ───────────────────────────────────── */
function initForm() {
  const form    = document.getElementById('contactForm');
  const overlay = document.getElementById('modalOverlay');
  const close   = document.getElementById('modalClose');

  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type=submit]');
    btn.textContent = 'Отправляем...';
    btn.disabled = true;


    setTimeout(() => {
      overlay.classList.add('active');
      form.reset();
      btn.innerHTML = '<span class="btn-text">Отправить заявку</span><span class="btn-icon">→</span>';
      btn.disabled = false;
    }, 1200);
  });

  close.addEventListener('click', () => overlay.classList.remove('active'));
  overlay.addEventListener('click', e => { if (e.target === overlay) overlay.classList.remove('active'); });
}

/* ── PHONE MASK ─────────────────────────────────────── */
function initPhoneMask() {
  const phone = document.getElementById('phone');
  if (!phone) return;
  phone.addEventListener('input', () => {
    let val = phone.value.replace(/\D/g, '');
    if (val.startsWith('7') || val.startsWith('8')) val = val.slice(1);
    let result = '+7';
    if (val.length > 0) result += ' (' + val.slice(0, 3);
    if (val.length >= 3) result += ') ' + val.slice(3, 6);
    if (val.length >= 6) result += '-' + val.slice(6, 8);
    if (val.length >= 8) result += '-' + val.slice(8, 10);
    phone.value = result;
  });
}

/* ── SMOOTH SCROLL ──────────────────────────────────── */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('header').offsetHeight + 20;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });
}

/* ── ACTIVE NAV LINK ────────────────────────────────── */
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.getAttribute('id');
    });
    links.forEach(l => {
      l.style.color = '';
      if (l.getAttribute('href') === '#' + current) l.style.color = 'var(--accent)';
    });
  });
}

/* ── HERO TITLE GLITCH ──────────────────────────────── */
function initGlitch() {
  const lines = document.querySelectorAll('.hero-title .line');
  lines.forEach(line => {
    line.addEventListener('mouseover', () => {
      line.style.textShadow = `2px 0 var(--accent), -2px 0 rgba(255,0,100,0.5)`;
      setTimeout(() => { line.style.textShadow = ''; }, 200);
    });
  });
}

/* ── MARQUEE PAUSE ON HOVER ─────────────────────────── */
function initMarquee() {
  const track = document.querySelector('.marquee-content');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = '');
}

/* ── COUNTER INTERSECTION ───────────────────────────── */
function initCounterObserver() {
  const statsSection = document.querySelector('.hero-stats');
  if (!statsSection) return;
  const obs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      animateCounters();
      obs.disconnect();
    }
  }, { threshold: 0.5 });
  obs.observe(statsSection);
}

/* ── START ALL ──────────────────────────────────────── */
function startAnimations() {
  initCanvas();
  initHeader();
  initBurger();
  initReveal();
  initProcessReveal();
  initFilter();
  initForm();
  initPhoneMask();
  initSmoothScroll();
  initActiveNav();
  initGlitch();
  initMarquee();
  initCounterObserver();
}

// Also handle the case if loader is very fast
window.addEventListener('DOMContentLoaded', () => {
  // Cursor works from the start
  // Everything else after loader
});
