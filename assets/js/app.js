/* ═══════════════════════════════════════════════════════════════
   PORTFOLIO JS — Ilias Elguennouni
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 1. NAV SCROLL ──────────────────────────────────────────── */
  const nav = document.getElementById('siteNav');
  window.addEventListener('scroll', () => {
    // Show navbar after scrolling past 80% of the viewport (hero image)
    nav.classList.toggle('scrolled', window.scrollY > window.innerHeight * 0.8);
  }, { passive: true });

  /* ── 2. MOBILE MENU ─────────────────────────────────────────── */
  const burger  = document.getElementById('navBurger');
  const menu    = document.getElementById('mobMenu');
  const overlay = document.getElementById('mobOverlay');

  const closeMenu = () => {
    burger.classList.remove('open');
    menu.classList.remove('open');
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
  };
  const openMenu = () => {
    burger.classList.add('open');
    menu.classList.add('open');
    overlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  };

  burger?.addEventListener('click', () => {
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  overlay?.addEventListener('click', closeMenu);
  document.querySelectorAll('.mob-menu__link, .mob-menu__cta').forEach(el => {
    el.addEventListener('click', closeMenu);
  });

  /* ── 3. ACTIVE NAV LINK ─────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
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

  /* ── 4. FADE-IN REVEAL & SECTION TRANSITIONS ───────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        fadeObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  fadeEls.forEach(el => fadeObs.observe(el));

  const sectionEls = document.querySelectorAll('.content-wrapper > section');
  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
      }
    });
  }, { threshold: 0.15 });
  sectionEls.forEach(el => sectionObs.observe(el));

  /* ── 5. SKILL BARS ──────────────────────────────────────────── */
  const skillFills = document.querySelectorAll('.skill__fill');
  const skillObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const w = entry.target.getAttribute('data-w');
        if (w) entry.target.style.width = `${w}%`;
        skillObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  skillFills.forEach(f => skillObs.observe(f));

  /* ── 6. PROJECT FILTER ──────────────────────────────────────── */
  const filterBtns = document.querySelectorAll('.work__filter');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const match = cat === 'all' || card.getAttribute('data-category') === cat;
        card.classList.toggle('hidden', !match);
      });
    });
  });

  /* ── 7. CONTACT FORM ────────────────────────────────────────── */
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('submitBtn');
  const btnTxt    = submitBtn?.querySelector('.btn__txt');

  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('userName')?.value.trim();
    const email   = document.getElementById('userEmail')?.value.trim();
    const message = document.getElementById('userMessage')?.value.trim();

    if (!name || !email || !message) return;

    submitBtn.disabled = true;
    if (btnTxt) btnTxt.textContent = 'Sending…';

    setTimeout(() => {
      submitBtn.classList.add('success');
      if (btnTxt) btnTxt.textContent = '✓ Message Sent!';

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtn.classList.remove('success');
        if (btnTxt) btnTxt.textContent = 'Send Message';
        form.reset();
      }, 3500);
    }, 1200);
  });

  /* ── 8. BACK TO TOP ─────────────────────────────────────────── */
  document.getElementById('footerTop')?.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ── 9. PROJECT MODALS ────────────────────────────────────────── */
  const modal = document.getElementById('projectModal');
  const overlay2 = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('modalClose');
  const triggers = document.querySelectorAll('.modal-trigger');

  const modalImg = document.getElementById('modalImg');
  const modalCat = document.getElementById('modalCat');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const modalTech = document.getElementById('modalTech');

  const projectData = {
    chess: {
      img: 'img/chess_engine.png',
      cat: 'Desktop App',
      title: 'C++ Chess Engine',
      desc: 'A full-featured digital chess game built entirely in C++ using the Qt framework for the UI. It features a robust Minimax AI algorithm that challenges the player. The game includes atmospheric background music, move validation, and a MySQL-integrated database system to save player statistics and game states. This project demonstrates strong knowledge of Object-Oriented Programming, data structures, and UI development in C++.',
      tech: ['C++', 'Qt Framework', 'Minimax AI', 'MySQL', 'Multimedia']
    },
    checkers: {
      img: 'img/moroccan_checkers.png',
      cat: 'Game AI',
      title: 'Moroccan Checkers AI',
      desc: 'An interactive implementation of the traditional Moroccan Checkers (Jeu de Dames) in Python. It enforces regional rules such as the "Neffakh" and "Koul" automatically. The highlight of the project is its scalable Minimax AI with Alpha-Beta pruning, offering multiple difficulty levels (Beginner to Expert). The application uses Tkinter/Pygame for the interface, stores game logs in a MySQL database, and includes custom background music.',
      tech: ['Python', 'AI/Alpha-Beta', 'Tkinter/Pygame', 'MySQL', 'Game Theory']
    },
    nexus: {
      img: 'img/nexus_listings.png',
      cat: 'Web Platform',
      title: 'Nexus Listings',
      desc: 'A premium local classifieds web application designed to connect buyers and sellers within their communities (similar to Leboncoin). Users can register, post items with images across various categories, and filter listings by location or price. A key feature is the real-time private messaging system allowing direct communication between users. It features a responsive front-end and a secure back-end database architecture.',
      tech: ['HTML/CSS/JS', 'PHP', 'SQL', 'Session Management', 'UI/UX']
    }
  };

  const openModal = (id) => {
    const data = projectData[id];
    if(!data) return;
    modalImg.src = data.img;
    modalCat.textContent = data.cat;
    modalTitle.textContent = data.title;
    modalDesc.textContent = data.desc;
    modalTech.innerHTML = data.tech.map(t => `<span>${t}</span>`).join('');
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { modalImg.src = ''; }, 400); // clear image after transition
  };

  triggers.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-project');
      openModal(id);
    });
  });

  closeBtn?.addEventListener('click', closeModal);
  overlay2?.addEventListener('click', closeModal);

});

