/* ============================================================
   PORTFOLIO — MAIN JAVASCRIPT
   Cinematic scroll interactions & animations
   ============================================================ */

'use strict';

// ── Scroll Progress Bar ────────────────────────────────────────
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.id = 'scrollProgress';
  document.body.prepend(bar);

  function update() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = docHeight > 0 ? (scrollTop / docHeight) * 100 + '%' : '0%';
  }

  window.addEventListener('scroll', update, { passive: true });
})();


// ── Navigation ─────────────────────────────────────────────────
(function initNav() {
  const nav      = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const sections = document.querySelectorAll('section[id]');
  const burger   = document.getElementById('navBurger');
  const linksEl  = document.getElementById('navLinks');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveLink();
  }

  function updateActiveLink() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  burger.addEventListener('click', () => {
    const isOpen = burger.classList.toggle('open');
    linksEl.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  linksEl.addEventListener('click', e => {
    if (e.target.classList.contains('nav__link')) {
      burger.classList.remove('open');
      linksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && linksEl.classList.contains('open')) {
      burger.classList.remove('open');
      linksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
})();


// ── Scroll Reveal (IntersectionObserver) - Smooth animations ---
(function initScrollReveal() {
  const selectors = [
    '.reveal-up', '.reveal-left', '.reveal-right',
    '.reveal-scale', '.reveal-clip',
    '.project-row', '.exp-item',
    '.stack__grid', '.about__stats',
    '.footer'
  ].join(',');

  const targets = document.querySelectorAll(selectors);

  // Skip hero children - they use CSS keyframe animation
  const nonHeroTargets = Array.from(targets).filter(el =>
    !el.closest('.hero__content') && !el.closest('.hero__scroll-indicator')
  );

  if (!('IntersectionObserver' in window)) {
    nonHeroTargets.forEach(el => el.classList.add('visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');

        // Trigger stat counter stagger class
        if (entry.target.classList.contains('about__stats')) {
          entry.target.classList.add('stats-visible');
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -8% 0px',
    threshold: 0.06,
  });

  nonHeroTargets.forEach(el => observer.observe(el));
})();


// ── Section title clip-reveal animation ────────────────────────
(function initTitleReveal() {
  const titles = document.querySelectorAll('.section-title');

  if (!('IntersectionObserver' in window)) {
    titles.forEach(t => t.classList.add('animate-in'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0.1 });

  titles.forEach(t => observer.observe(t));
})();


// ── Parallax on scroll ────────────────────────────────────────
(function initParallax() {
  // Apply parallax attribute to key elements
  const parallaxTargets = [
    { selector: '.hero__bg-grid',          speed: 0.3 },
    { selector: '.about__image-wrap',      speed: 0.08 },
    { selector: '.research__card-right',   speed: 0.06 },
  ];

  parallaxTargets.forEach(({ selector, speed }) => {
    const el = document.querySelector(selector);
    if (el) {
      el.setAttribute('data-parallax-speed', speed);
    }
  });

  function update() {
    const scrollY = window.scrollY;

    document.querySelectorAll('[data-parallax-speed]').forEach(el => {
      const speed = parseFloat(el.dataset.parallaxSpeed);
      const rect  = el.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const viewCenter = window.innerHeight / 2;
      const offset = (center - viewCenter) * speed;
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  // Only run on non-touch / large screens
  if (!window.matchMedia('(hover: none)').matches && window.innerWidth > 768) {
    window.addEventListener('scroll', update, { passive: true });
  }
})();


// ── Stat Counter Animation ─────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.about__stat-number[data-target]');
  if (!counters.length) return;

  function animateCounter(el) {
    const target   = parseInt(el.dataset.target, 10);
    const duration = 1600;
    const start    = performance.now();

    function step(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutQuart
      const eased = 1 - Math.pow(1 - progress, 4);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();


// ── Smooth Scroll ──────────────────────────────────────────────
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = anchor.getAttribute('href');
      if (target === '#') return;
      const el = document.querySelector(target);
      if (!el) return;
      e.preventDefault();
      const top = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


// ── Cursor glow follow on hover cards ─────────────────────────
(function initCursorGlow() {
  if (window.matchMedia('(hover: none)').matches) return;

  const cards = document.querySelectorAll(
    '.project-row, .expertise__item, .research__card, .exp-item__content, .stack__category'
  );

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', (e.clientX - rect.left) + 'px');
      card.style.setProperty('--mouse-y', (e.clientY - rect.top)  + 'px');
    });
  });
})();


// ── Magnetic button effect ─────────────────────────────────────
(function initMagneticButtons() {
  if (window.matchMedia('(hover: none)').matches) return;

  const buttons = document.querySelectorAll('.btn--primary, .nav__link--cta');

  buttons.forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


// ── Marquee pause on hover ────────────────────────────────────
(function initMarquee() {
  const track = document.querySelector('.hero__domain-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();


// ── Contact form UX (Mailto generation) ────────────────────────
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    
    // Quick validation checkpoint
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.textContent = 'Opening Mail Client...';
    btn.style.opacity = '0.7';

    const firstName = form.querySelector('#firstName').value;
    const lastName = form.querySelector('#lastName').value;
    const email = form.querySelector('#emailInput').value;
    const subject = form.querySelector('#subject').value;
    const message = form.querySelector('#message').value;

    const emailTo = 'karthikeyan6912@gmail.com';
    const emailSubject = encodeURIComponent(subject || 'Portfolio Contact');
    const emailBody = encodeURIComponent(
      `Name: ${firstName} ${lastName}\n` +
      `Email: ${email}\n\n` +
      `Message:\n${message}\n`
    );

    window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    setTimeout(() => {
      btn.textContent = 'Send Message →';
      btn.style.opacity = '1';
      form.reset();
    }, 4000);
  });
})();


// ── Tilt effect on project images ──────────────────────────────
(function initTilt() {
  if (window.matchMedia('(hover: none)').matches) return;

  const images = document.querySelectorAll('.project-row__image-col');

  images.forEach(img => {
    img.addEventListener('mousemove', e => {
      const rect = img.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      img.style.transform = `perspective(600px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) scale(1.02)`;
    });

    img.addEventListener('mouseleave', () => {
      img.style.transform = '';
    });
  });
})();


// ── Page loaded ────────────────────────────────────────────────
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});

// ── Image Extension Fallback (.jpeg/.jpg -> .png) ──────────────
document.addEventListener('error', function(e) {
  if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
    const src = e.target.src;
    if (src.includes('.jpg') && !e.target.dataset.triedPng) {
      e.target.dataset.triedPng = 'true';
      e.target.src = src.replace('.jpg', '.png');
    }
  }
}, true); // use capture phase to catch resource loading errors
