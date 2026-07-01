/* ============================================================
   Reality Creation Centre — Shared JavaScript
   Version 1.0
   ============================================================ */

/* ── CUSTOM CURSOR ── */
(function() {
  const cur = document.getElementById('cur');
  if (!cur) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
  (function tick() {
    cx += (mx - cx) * 0.18;
    cy += (my - cy) * 0.18;
    cur.style.left = cx + 'px';
    cur.style.top  = cy + 'px';
    requestAnimationFrame(tick);
  })();
  document.querySelectorAll('a, button, .epc, .pillar, .area-tile, .tier, .voice, .svc, .eco-path').forEach(el => {
    el.addEventListener('mouseenter', () => cur.classList.add('big'));
    el.addEventListener('mouseleave', () => cur.classList.remove('big'));
  });
})();

/* ── MOBILE NAV HAMBURGER ── */
(function() {
  const nav = document.getElementById('nav');
  const ham = document.querySelector('.nham');
  if (!ham || !nav) return;
  function closeNav() {
    nav.classList.remove('nav-open');
    document.body.classList.remove('nav-lock');
  }
  ham.addEventListener('click', () => {
    const opening = nav.classList.toggle('nav-open');
    document.body.classList.toggle('nav-lock', opening);
  });
  // Close when any nav link is clicked
  nav.querySelectorAll('a.nl, a[href]').forEach(a => {
    a.addEventListener('click', closeNav);
  });
  // Close on overlay tap (ESC key)
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeNav(); });
})();

/* ── NAV SCROLL BEHAVIOUR ── */
(function() {
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero') ||
               document.getElementById('pod-hero') ||
               document.getElementById('med-hero') ||
               document.querySelector('section[id$="-hero"]');
  if (!nav) return;
  function updateNav() {
    if (hero) {
      const pb = hero.getBoundingClientRect().bottom;
      nav.classList.toggle('lit', pb <= 0);
      nav.classList.toggle('dk',  pb > 0);
    }
  }
  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
})();

/* ── HERO HEADLINE REVEAL ── */
(function() {
  setTimeout(() => {
    ['hl0','hl1','hl2'].forEach((id, i) => {
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.classList.add('go');
      }, 310 + i * 155);
    });
  }, 80);

  const hBg = document.getElementById('h-bg');
  if (hBg) setTimeout(() => hBg.classList.add('go'), 200);
})();

/* ── SCROLL REVEALS ── */
(function() {
  const els = document.querySelectorAll('.ap, .fd');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.09, rootMargin: '0px 0px -18px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── DIAGNOSTIC CARD BARS ── */
(function() {
  const card  = document.getElementById('d-card');
  const fills = document.querySelectorAll('.dc-fill');
  if (!card) return;
  let animated = false;
  new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && !animated) {
        animated = true;
        card.classList.add('in');
        setTimeout(() => fills.forEach(f => { f.style.width = f.dataset.w + '%'; }), 420);
      }
    });
  }, { threshold: 0.25 }).observe(card);
})();

/* ── SMOOTH SCROLL ── */
(function() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();

/* ── VISUAL ENHANCEMENTS v2.0 ── */
(function() {

  /* Inject floating orbs into hero and join sections */
  const hero = document.getElementById('hero');
  if (hero) {
    ['rcc-orb rcc-orb-1','rcc-orb rcc-orb-2','rcc-orb rcc-orb-3'].forEach(cls => {
      const o = document.createElement('div');
      o.className = cls;
      hero.appendChild(o);
    });
  }
  const join = document.getElementById('join');
  if (join) {
    ['rcc-orb rcc-orb-j1','rcc-orb rcc-orb-j2'].forEach(cls => {
      const o = document.createElement('div');
      o.className = cls;
      join.appendChild(o);
    });
  }

  /* Gold gradient on first headline word */
  const hl0 = document.getElementById('hl0');
  if (hl0) hl0.classList.add('h-h1-gold');

  /* Staggered area tile reveals */
  document.querySelectorAll('.seven-grid, .seven-grid-bot').forEach(grid => {
    grid.classList.add('rcc-stagger');
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('rcc-stagger-in');
        }
      });
    }, { threshold: 0.08 }).observe(grid);
  });

  /* Animated count-up for podcast stats — preserves suffix (K+, +) */
  function countUp(el, target, suffix, duration) {
    const start = performance.now();
    (function update(now) {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(ease * target).toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(update);
    })(start);
  }
  const statsObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      statsObs.unobserve(e.target);
      e.target.querySelectorAll('.ps-n').forEach(el => {
        const raw = el.textContent.replace(/[^0-9KkMm]/g, '');
        const num = parseInt(raw.replace(/[^0-9]/g, ''), 10);
        const suffix = el.textContent.replace(/[0-9,]/g, '').trim();
        if (num) countUp(el, num, suffix, 1800);
      });
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.pod-stats').forEach(s => statsObs.observe(s));

  /* Active nav section highlighting */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nl[href^="#"]');
  if (sections.length && navLinks.length) {
    const secObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = '#' + e.target.id;
          navLinks.forEach(a => {
            a.classList.toggle('rcc-active', a.getAttribute('href') === id);
          });
        }
      });
    }, { threshold: 0.4, rootMargin: '-56px 0px 0px 0px' });
    sections.forEach(s => secObs.observe(s));
  }

  /* Subtle parallax on hero photo on mouse move */
  const hPhoto = document.getElementById('h-bg');
  if (hPhoto) {
    document.addEventListener('mousemove', e => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 8;
      const ry = (e.clientY / window.innerHeight - 0.5) * 5;
      hPhoto.style.transform = `scale(1.04) translate(${rx}px,${ry}px)`;
    }, { passive: true });
  }

})();

/* ── YOUTUBE VIDEO PLAYER ── */
function playVideo(iframeId, thumbId, videoId) {
  const iframe = document.getElementById(iframeId);
  const thumb  = document.getElementById(thumbId);
  if (iframe) iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&rel=0&modestbranding=1';
  if (thumb)  thumb.classList.add('hidden');
}
