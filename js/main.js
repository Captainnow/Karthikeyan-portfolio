/* ============================================================
   EXECUTIVE PORTFOLIO — PREMIUM ANIMATION ENGINE
   Features: Lenis Smooth Scroll, GSAP, ScrollTrigger, Bento Grids
   ============================================================ */

'use strict';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Main Orchestrator
document.addEventListener('DOMContentLoaded', () => {
  // Let the styles know JS and GSAP are ready to handle motion
  document.body.classList.add('gsap-active');

  initSmoothScroll();
  initMouseEffects();
  initHeroEntrance();
  initScrollReveals();
  initStatsCounter();
  initInteractiveTimeline();
  initFormHandler();
  initMobileNav();
  
  // Page Loaded flag
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });
});

/* ── 1. LENIS SMOOTH SCROLLING ──────────────────────────────────
   Smooth executive scroll experience hooked directly into GSAP */
let lenis;
function initSmoothScroll() {
  // Skip on touch devices or if Lenis is missing
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // smooth exponential ease
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
  });

  // Connect Lenis to GSAP ScrollTrigger updates
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
  
  // Handle anchor link click smoothly through Lenis
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Adjust for floating nav height
        const offset = 80;
        lenis.scrollTo(targetElement, {
          offset: -offset,
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        });
      }
    });
  });
}

/* ── 2. ADVANCED MOUSE EFFECTS ──────────────────────────────────
   Refined glowing spots and magnetic forces for premium desktops */
function initMouseEffects() {
  const cursorDot = document.getElementById('customCursorDot');
  const cursorRing = document.getElementById('customCursorRing');
  const hoverCards = document.querySelectorAll('.hover-glow-card, .expertise__item');
  const magneticElements = document.querySelectorAll('.btn--primary, .nav__link--cta, .nav__logo');

  // Return immediately if it is a touch device
  if (window.matchMedia('(hover: none)').matches) return;

  // Custom pointer followers
  if (cursorDot && cursorRing) {
    // Hide default cursor
    document.body.style.cursor = 'none';

    // Fade in on first movement
    let hasMoved = false;
    window.addEventListener('mousemove', (e) => {
      if (!hasMoved) {
        gsap.set([cursorDot, cursorRing], { opacity: 1 });
        hasMoved = true;
      }

      // Inner dot (instant tracking)
      gsap.set(cursorDot, {
        x: e.clientX,
        y: e.clientY
      });

      // Outer ring (lag tracking)
      gsap.to(cursorRing, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out'
      });
    });

    // Toggle hover active class on interactive items
    const interactiveSelectors = 'a, button, .btn, .hover-glow-card, .expertise__item, .project-row, .company-card, .exp-item__content';
    document.querySelectorAll(interactiveSelectors).forEach(elem => {
      elem.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover-active');
        cursorRing.classList.add('hover-active');
      });
      elem.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover-active');
        cursorRing.classList.remove('hover-active');
      });
    });
  }

  // Spotlight highlight tracker inside bento cards
  hoverCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // Magnetic button spring mechanics
  magneticElements.forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      const rect = elem.getBoundingClientRect();
      const elemCenterX = rect.left + rect.width / 2;
      const elemCenterY = rect.top + rect.height / 2;
      
      // Calculate delta distance
      const deltaX = e.clientX - elemCenterX;
      const deltaY = e.clientY - elemCenterY;

      // Pull item 22% toward cursor
      gsap.to(elem, {
        x: deltaX * 0.22,
        y: deltaY * 0.22,
        duration: 0.3,
        ease: 'power2.out'
      });
    });

    elem.addEventListener('mouseleave', () => {
      gsap.to(elem, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.4)'
      });
    });
  });

  // 3D Parallax Glide for Hero Portrait
  const heroImageArt = document.querySelector('.hero__image-art');
  if (heroImageArt) {
    window.addEventListener('mousemove', (e) => {
      const depthX = (window.innerWidth / 2 - e.clientX) * 0.03; // pull 3% in opposite direction
      const depthY = (window.innerHeight / 2 - e.clientY) * 0.03;

      gsap.to(heroImageArt, {
        x: depthX,
        y: depthY,
        duration: 0.6,
        ease: 'power2.out'
      });
    });
  }
}

/* ── 3. HERO CINEMATIC ENTRANCE ──────────────────────────────────
   Smooth staggered entry for a bold initial visual impression */
function initHeroEntrance() {
  const tl = gsap.timeline();

  // Initially hide elements to prevent flash before animation starts
  gsap.set('.hero__status-badge, .hero__subtext, .hero__roles, .hero__actions, #scrollIndicator', {
    opacity: 0,
    y: 20
  });

  gsap.set('.hero__image-container', {
    opacity: 0,
    x: 45,
    scale: 0.96
  });

  // Setup headline characters mask-slide reveal
  const headlineLines = document.querySelectorAll('.hero__line');
  gsap.set(headlineLines, { yPercent: 100 });

  tl.to(headlineLines, {
    yPercent: 0,
    duration: 1.4,
    stagger: 0.15,
    ease: 'power4.out',
    delay: 0.2
  })
  .to('.hero__status-badge', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out'
  }, '-=0.9')
  .to('.hero__image-container', {
    opacity: 1,
    x: 0,
    scale: 1,
    duration: 1.8,
    ease: 'power3.out'
  }, '-=0.9')
  .to('.hero__subtext', {
    opacity: 1,
    y: 0,
    duration: 1.0,
    ease: 'power3.out'
  }, '-=0.8')
  .to('.hero__roles', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.7')
  .to('.hero__actions', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.6')
  .to('#scrollIndicator', {
    opacity: 1,
    y: 0,
    duration: 0.8,
    ease: 'power3.out'
  }, '-=0.5');
}

/* ── 4. STAGGERED SCROLL REVEALS ─────────────────────────────────
   Scroll triggered reveals using GSAP ScrollTrigger for section cards */
function initScrollReveals() {
  // Stagger sections title split reveal
  document.querySelectorAll('.section-title').forEach(title => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: 'top 85%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 30,
      duration: 1.0,
      ease: 'power3.out'
    });
  });

  // Bento grid card stagger entrance
  const bentoCards = document.querySelectorAll('.bento-card');
  if (bentoCards.length) {
    gsap.from(bentoCards, {
      scrollTrigger: {
        trigger: '.bento-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  // Expertise items stagger reveal
  const expertiseItems = document.querySelectorAll('.expertise__item');
  if (expertiseItems.length) {
    gsap.from(expertiseItems, {
      scrollTrigger: {
        trigger: '.expertise__list',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    });
  }

  // Selected Projects Rows Parallax Reveal
  document.querySelectorAll('.project-row').forEach(row => {
    const imgCol = row.querySelector('.project-row__image-col');
    const contentCol = row.querySelector('.project-row__content-col');

    // Slide up image with subtle tilt/parallax
    if (imgCol) {
      gsap.from(imgCol, {
        scrollTrigger: {
          trigger: row,
          start: 'top 75%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: row.classList.contains('project-row--alt') ? 50 : -50,
        y: 30,
        duration: 1.2,
        ease: 'power3.out'
      });
    }

    // Fade up project contents
    if (contentCol) {
      gsap.from(contentCol, {
        scrollTrigger: {
          trigger: row,
          start: 'top 70%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        x: row.classList.contains('project-row--alt') ? -40 : 40,
        y: 20,
        duration: 1.0,
        ease: 'power3.out'
      });
    }
  });

  // Company Cards Stagger (Rapha MedTech)
  const companyCards = document.querySelectorAll('.company-card');
  if (companyCards.length) {
    gsap.from(companyCards, {
      scrollTrigger: {
        trigger: '.company-projects-grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Tech Stack categories slide up
  const stackCategories = document.querySelectorAll('.stack__category');
  if (stackCategories.length) {
    gsap.from(stackCategories, {
      scrollTrigger: {
        trigger: '.stack__grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.12,
      ease: 'power3.out'
    });
  }

  // Research publication Card Reveal
  const researchCard = document.querySelector('.research__card');
  if (researchCard) {
    gsap.from(researchCard, {
      scrollTrigger: {
        trigger: researchCard,
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1.2,
      ease: 'power3.out'
    });
  }

  // Contact sections slide reveal
  const contactLeft = document.querySelector('.contact__left');
  const contactRight = document.querySelector('.contact__right');
  if (contactLeft && contactRight) {
    gsap.from([contactLeft, contactRight], {
      scrollTrigger: {
        trigger: '.contact__grid',
        start: 'top 80%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 40,
      duration: 1.0,
      stagger: 0.15,
      ease: 'power3.out'
    });
  }

  // Footer reveal
  const footerInner = document.querySelector('.footer__inner');
  if (footerInner) {
    gsap.from(footerInner, {
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 90%',
        toggleActions: 'play none none none'
      },
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out'
    });
  }
}

/* ── 5. STATS COUNTER ACTION ─────────────────────────────────────
   Staggered counting from zero using GSAP ScrollTrigger */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.bento-card__num');
  if (!statNumbers.length) return;

  statNumbers.forEach(stat => {
    const target = parseInt(stat.dataset.target, 10);
    const countObj = { val: 0 };

    ScrollTrigger.create({
      trigger: stat,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(countObj, {
          val: target,
          duration: 2.0,
          ease: 'power3.out',
          onUpdate: () => {
            stat.textContent = Math.round(countObj.val);
          }
        });
      },
      once: true
    });
  });
}

/* ── 6. INTERACTIVE EXPERIENTIAL TIMELINE ───────────────────────
   Draws the golden timeline path dynamically as user scrolls down */
function initInteractiveTimeline() {
  const timelineItems = document.querySelectorAll('.exp-item');
  if (!timelineItems.length) return;

  timelineItems.forEach(item => {
    const content = item.querySelector('.exp-item__content');
    const dot = item.querySelector('.exp-item__dot');
    const line = item.querySelector('.exp-item__line');

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: item,
        start: 'top 75%',
        toggleActions: 'play none none none'
      }
    });

    if (dot) {
      tl.from(dot, {
        scale: 0.3,
        opacity: 0,
        backgroundColor: '#1E1E26',
        duration: 0.5,
        ease: 'back.out(1.7)'
      });
    }

    if (content) {
      tl.from(content, {
        opacity: 0,
        x: 30,
        duration: 0.8,
        ease: 'power3.out'
      }, '-=0.3');
    }

    if (line) {
      // Golden timeline growth
      tl.from(line, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.8,
        ease: 'none'
      }, '-=0.6');
    }
  });
}

/* ── 7. ACTIVE NAVIGATION HIGHLIGHTS ────────────────────────────
   Surfaces active navbar tags while tracking page scroll coordinates */
(function initNavHighlights() {
  const nav = document.getElementById('nav');
  const navLinks = document.querySelectorAll('.nav__link:not(.nav__link--cta)');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgress = document.getElementById('scrollProgress');

  function update() {
    const scrollY = window.scrollY;
    
    // Toggle nav backdrop scrolled class
    if (nav) {
      nav.classList.toggle('scrolled', scrollY > 60);
    }

    // Scroll Progress bar percentage
    if (scrollProgress) {
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
      scrollProgress.style.width = `${scrollPercent}%`;
    }

    // Current Section highlights
    let currentId = '';
    sections.forEach(sec => {
      if (scrollY >= sec.offsetTop - 150) {
        currentId = sec.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── 8. MOBILE HAMBURGER TOGGLES ───────────────────────────────
   Full screen responsive menu triggers with GSAP animation links */
function initMobileNav() {
  const burger = document.getElementById('navBurger');
  const linksEl = document.getElementById('navLinks');
  const navLinks = document.querySelectorAll('.nav__link');

  if (!burger || !linksEl) return;

  function toggleMenu() {
    const isOpen = burger.classList.toggle('open');
    linksEl.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';

    if (isOpen) {
      // Slide links in beautifully
      gsap.fromTo(navLinks, 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, stagger: 0.08, duration: 0.4, ease: 'power2.out', delay: 0.15 }
      );
    }
  }

  burger.addEventListener('click', toggleMenu);

  linksEl.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav__link')) {
      burger.classList.remove('open');
      linksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  // ESC Close
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && linksEl.classList.contains('open')) {
      burger.classList.remove('open');
      linksEl.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── 9. CONTACT FORM INGESTION & SUBMISSION ──────────────────────
   Sanitizes inputs and launches native mail workflow automatically */
function initFormHandler() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    if (!btn) return;
    
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
    const emailSubject = encodeURIComponent(subject || 'Portfolio RFP Ingestion');
    const emailBody = encodeURIComponent(
      `Executive Request Details\n` +
      `==================================\n` +
      `Name: ${firstName} ${lastName}\n` +
      `Email: ${email}\n\n` +
      `Scope Message Details:\n${message}\n`
    );

    window.location.href = `mailto:${emailTo}?subject=${emailSubject}&body=${emailBody}`;

    setTimeout(() => {
      btn.textContent = 'Submit RFP Details →';
      btn.style.opacity = '1';
      form.reset();
    }, 3000);
  });
}

// Seamless marquee mouse hover control
(function initMarqueeHover() {
  const track = document.querySelector('.hero__domain-track');
  if (!track) return;
  track.addEventListener('mouseenter', () => track.style.animationPlayState = 'paused');
  track.addEventListener('mouseleave', () => track.style.animationPlayState = 'running');
})();

// Image Loading fallback logic (.jpg -> .png)
document.addEventListener('error', function(e) {
  if (e.target && e.target.tagName && e.target.tagName.toLowerCase() === 'img') {
    const src = e.target.src;
    if (src.includes('.jpg') && !e.target.dataset.triedPng) {
      e.target.dataset.triedPng = 'true';
      e.target.src = src.replace('.jpg', '.png');
    }
  }
}, true);
