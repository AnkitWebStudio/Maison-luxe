import './styles.css';

document.addEventListener('DOMContentLoaded', init);

function init() {
  setupNav();
  setupScrollReveal();
  setupHeroLoad();
  setupAccordions();
  setupProductGallery();
  setupFilterDropdowns();
  setActiveNavLink();
  setupFormspree();
}

/* ── Navigation ─────────────────────────────────────────── */
function setupNav() {
  const nav = document.getElementById('nav');
  const hamburger = document.getElementById('navHamburger');
  const mobileMenu = document.getElementById('navMobile');
  if (!nav) return;

  // Scroll shadow
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on backdrop click
    mobileMenu.addEventListener('click', (e) => {
      if (e.target === mobileMenu) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }
}

/* ── Active Nav Link ────────────────────────────────────── */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href')?.split('/').pop() || '';
    const isHome = (path === '' || path === 'index.html') && (href === '' || href === 'index.html' || href === '/');
    const isMatch = href && path && path.includes(href.replace('.html', '')) && href !== 'index.html';
    if (isHome || isMatch) link.classList.add('active');
  });
}

/* ── Hero entrance ──────────────────────────────────────── */
function setupHeroLoad() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const img = hero.querySelector('.hero-img');
  if (!img) { hero.classList.add('loaded'); return; }
  if (img.complete) {
    hero.classList.add('loaded');
  } else {
    img.addEventListener('load', () => hero.classList.add('loaded'));
    // Fallback in case image never loads
    setTimeout(() => hero.classList.add('loaded'), 600);
  }
}

/* ── Scroll Reveal ──────────────────────────────────────── */
function setupScrollReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => io.observe(el));
}

/* ── Accordion ──────────────────────────────────────────── */
function setupAccordions() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.accordion-item');
      const content = item.querySelector('.accordion-content');
      const isOpen = item.classList.contains('open');

      // Close all siblings
      const parent = item.closest('.accordion');
      if (parent) {
        parent.querySelectorAll('.accordion-item.open').forEach(open => {
          open.classList.remove('open');
          const c = open.querySelector('.accordion-content');
          if (c) c.style.maxHeight = '0';
        });
      }

      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
        if (content) content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/* ── Product Gallery (thumbnails) ───────────────────────── */
function setupProductGallery() {
  const mainImg = document.getElementById('productMainImg');
  const thumbs = document.querySelectorAll('.product-thumb');
  if (!mainImg || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const src = thumb.dataset.full;
      const alt = thumb.dataset.alt || '';

      // Fade out → swap → fade in
      mainImg.style.opacity = '0';
      mainImg.style.transition = 'opacity 0.35s ease';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.alt = alt;
        mainImg.style.opacity = '1';
      }, 350);

      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });
}

/* ── Filter Dropdowns (Collection) ─────────────────────── */
function setupFilterDropdowns() {
  document.querySelectorAll('.filter-item').forEach(item => {
    const trigger = item.querySelector('.filter-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.filter-item.open').forEach(o => o.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  document.addEventListener('click', () => {
    document.querySelectorAll('.filter-item.open').forEach(o => o.classList.remove('open'));
  });

  // Option click closes dropdown & updates label
  document.querySelectorAll('.filter-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = opt.closest('.filter-item');
      const label = item?.querySelector('.filter-label-text');
      if (label) label.textContent = opt.textContent.trim();
      item?.classList.remove('open');
    });
  });
}

/* ── Formspree ──────────────────────────────────────────── */
function setupFormspree() {
  const form = document.getElementById('bespokeForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const success = document.getElementById('formSuccess');
    const originalText = btn.textContent;

    btn.textContent = 'Sending…';
    btn.disabled = true;

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        form.reset();
        if (success) success.classList.add('show');
        form.style.opacity = '0.4';
        form.style.pointerEvents = 'none';
      } else {
        btn.textContent = 'Error — try again';
        btn.disabled = false;
      }
    } catch {
      btn.textContent = 'Error — try again';
      btn.disabled = false;
    }
  });
}
