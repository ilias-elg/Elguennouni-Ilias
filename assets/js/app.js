/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO JS — Ilias Elguennouni
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const EMAIL = 'iliaselguennounits@gmail.com';

  /* ── 1. NAV SCROLL + PROGRESS + STATEMENT ───────────────────── */
  const nav       = document.getElementById('siteNav');
  const progress  = document.getElementById('navProgress');
  const statement = document.getElementById('statement');

  // Split the statement into words so they can light up as you scroll
  const words = [];
  const splitWords = (node) => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part.trim()) { frag.append(part); return; }
          const span = document.createElement('span');
          span.className = 'w';
          span.textContent = part;
          words.push(span);
          frag.append(span);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        splitWords(child);
      }
    });
  };
  if (statement && !reduceMotion) splitWords(statement);

  const updateStatement = () => {
    if (!words.length) return;
    const rect  = statement.getBoundingClientRect();
    const vh    = window.innerHeight;
    // 0 when the block enters at 85% of the viewport, 1 when its end reaches 45%
    const t     = (vh * 0.85 - rect.top) / (rect.height + vh * 0.4);
    const count = Math.round(Math.min(1, Math.max(0, t)) * words.length);
    words.forEach((w, i) => w.classList.toggle('on', i < count));
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      // Show navbar after scrolling past 80% of the viewport (hero image)
      const pastHero = y > window.innerHeight * 0.8;
      nav.classList.toggle('scrolled', pastHero);
      if (!pastHero) closeMenu();

      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;

      updateStatement();
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  /* ── 2. MOBILE MENU ─────────────────────────────────────────── */
  const burger = document.getElementById('navBurger');
  const menu   = document.getElementById('mobMenu');

  function closeMenu() {
    if (!menu.classList.contains('open')) return;
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }
  const openMenu = () => {
    burger.classList.add('open');
    burger.setAttribute('aria-expanded', 'true');
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  burger?.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  menu?.querySelectorAll('a').forEach(el => el.addEventListener('click', closeMenu));

  /* ── 3. ACTIVE NAV LINK ─────────────────────────────────────── */
  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  const linkObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { rootMargin: '-35% 0px -60% 0px' });

  sections.forEach(s => linkObserver.observe(s));

  /* ── 4. REVEAL ON SCROLL ────────────────────────────────────── */
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
  document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

  /* ── 5. STAT COUNT-UP ───────────────────────────────────────── */
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      countObs.unobserve(entry.target);

      const el     = entry.target;
      const target = Number(el.dataset.count);
      if (reduceMotion || !target) return;

      const duration = 1400;
      const start    = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / duration);
        el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach(el => countObs.observe(el));

  /* ── 6. PROJECT MODAL ───────────────────────────────────────── */
  const modal      = document.getElementById('projectModal');
  const modalImg   = document.getElementById('modalImg');
  const modalCat   = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc  = document.getElementById('modalDesc');
  const modalFeats = document.getElementById('modalFeats');
  const modalTech  = document.getElementById('modalTech');
  const closeBtn   = document.getElementById('modalClose');
  let lastTrigger  = null;

  const projectData = {
    chess: {
      img: 'assets/img/chess_engine.png',
      cat: 'Desktop App',
      title: 'C++ Chess Engine',
      desc: 'A full-featured chess game built entirely in C++, with the Qt framework for the interface. A Minimax opponent searches ahead before each move, and a database keeps player statistics and saved games between sessions.',
      feats: [
        'Minimax AI opponent that plans several moves ahead',
        'Full move validation and game-state handling',
        'Database-backed saves and player statistics',
        'Background music and sound for a more immersive game'
      ],
      tech: ['C++', 'Qt Framework', 'Minimax AI', 'MySQL', 'Multimedia']
    },
    checkers: {
      img: 'assets/img/moroccan_checkers.png',
      cat: 'Game AI',
      title: 'Moroccan Checkers AI',
      desc: 'An interactive implementation of traditional Moroccan checkers (Jeu de Dames) in Python. The game applies the regional rules for you, and the AI scales from beginner to expert.',
      feats: [
        'Regional rules such as “Neffakh” and “Koul” enforced automatically',
        'Minimax with Alpha-Beta pruning for deep, fast search',
        'Multiple difficulty levels, from Beginner to Expert',
        'Match history and game logs stored in MySQL'
      ],
      tech: ['Python', 'AI / Alpha-Beta', 'Tkinter / Pygame', 'MySQL', 'Game Theory']
    },
    nexus: {
      img: 'assets/img/nexus_listings.png',
      cat: 'Web Platform',
      title: 'Nexus Listings',
      desc: 'A local classifieds web application that connects buyers and sellers within their community, in the spirit of Leboncoin. Built end to end, from the responsive front-end to the database behind it.',
      feats: [
        'Account registration and listings with images',
        'Browse by category, filter by location or price',
        'Private messaging between buyers and sellers',
        'Responsive front-end on a secure back-end database'
      ],
      tech: ['HTML / CSS / JS', 'PHP', 'SQL', 'Session Management', 'UI / UX']
    }
  };

  const fillList = (list, items) => {
    list.replaceChildren(...items.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
  };

  const openModal = (id, trigger) => {
    const data = projectData[id];
    if (!data) return;
    lastTrigger = trigger;
    modalImg.src = data.img;
    modalImg.alt = `${data.title} screenshot`;
    modalCat.textContent = data.cat;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    fillList(modalFeats, data.feats);
    fillList(modalTech, data.tech);

    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cursor?.classList.remove('on');
    closeBtn.focus();
  };

  const closeModal = () => {
    if (!modal.classList.contains('active')) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastTrigger?.focus();
  };

  document.querySelectorAll('[data-project]').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.project, btn));
  });
  closeBtn?.addEventListener('click', closeModal);
  document.getElementById('modalOverlay')?.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    closeModal();
    closeMenu();
  });

  /* ── 7. CURSOR FOLLOWER (project images) ────────────────────── */
  const cursor = document.getElementById('cursor');
  if (cursor && !reduceMotion && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let tx = 0, ty = 0, x = 0, y = 0, running = false;

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      cursor.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (cursor.classList.contains('on') || Math.abs(tx - x) > 0.5 || Math.abs(ty - y) > 0.5) {
        requestAnimationFrame(loop);
      } else {
        running = false;
      }
    };

    document.querySelectorAll('.pj__media').forEach(media => {
      media.addEventListener('mouseenter', (e) => {
        x = tx = e.clientX; y = ty = e.clientY;
        cursor.classList.add('on');
        if (!running) { running = true; requestAnimationFrame(loop); }
      });
      media.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });
      media.addEventListener('mouseleave', () => cursor.classList.remove('on'));
    });
  }

  /* ── 8. CONTACT FORM → email draft ──────────────────────────── */
  const form     = document.getElementById('contactForm');
  const formNote = document.getElementById('formNote');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl    = document.getElementById('userName');
    const messageEl = document.getElementById('userMessage');
    const subject   = document.getElementById('subjectType').value;

    let valid = true;
    [nameEl, messageEl].forEach(el => {
      const empty = !el.value.trim();
      el.closest('.form-field').classList.toggle('invalid', empty);
      if (empty && valid) { el.focus(); valid = false; }
    });
    if (!valid) {
      formNote.textContent = 'Please add your name and a message first.';
      return;
    }

    const body = `${messageEl.value.trim()}\n\n— ${nameEl.value.trim()}`;
    window.location.href =
      `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    formNote.textContent = 'Your email app should now be open with the draft — just hit send.';
  });

  form?.querySelectorAll('input, textarea').forEach(el => {
    el.addEventListener('input', () => el.closest('.form-field').classList.remove('invalid'));
  });

  /* ── 9. COPY EMAIL ──────────────────────────────────────────── */
  const copyBtn = document.getElementById('copyEmail');
  copyBtn?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      copyBtn.textContent = 'Copied ✓';
    } catch {
      copyBtn.textContent = 'Press Ctrl+C to copy';
      window.getSelection().selectAllChildren(document.getElementById('cEmail'));
    }
    setTimeout(() => { copyBtn.textContent = 'Copy address'; }, 2200);
  });

  /* ── 10. LOCAL TIME + YEAR ──────────────────────────────────── */
  const timeEl = document.getElementById('localTime');
  if (timeEl) {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit', minute: '2-digit', timeZone: 'Africa/Casablanca'
    });
    const tick = () => { timeEl.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 30000);
  }
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  onScroll();
});
