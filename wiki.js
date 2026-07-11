/* Shared sidebar + pager for ShizCraft Wiki (NecoVanilla-style structure) */
(function () {
  const pages = [
    { file: 'index.html', title: 'Введение', group: 'start' },
    { file: 'rules.html', title: 'Правила', group: 'start' },
    { file: 'start.html', title: 'Как начать', group: 'start' },
    { file: 'commands.html', title: 'Команды', group: 'start' },
    { file: 'chat.html', title: 'Чат и ЛС', group: 'features' },
    { file: 'trusted.html', title: 'Доверенный', group: 'features' },
    { file: 'profile.html', title: 'Профиль', group: 'features' },
    { file: 'bank.html', title: 'Банк', group: 'features' },
    { file: 'reports.html', title: 'Репорты', group: 'features' },
    { file: 'playtime.html', title: 'Онлайн', group: 'features' },
    { file: 'features.html', title: 'Уникальные функции', group: 'features' },
    { file: 'generation.html', title: 'Кастомная генерация', group: 'features' },
    { file: 'donate.html', title: 'Донат и подписка', group: 'features' }
  ];

  const nav = `
    <a href="index.html" class="wiki-brand">
      <img src="assets/logo_vanilla.png" alt="ShizCraft">
      <div><strong>ShizCraft</strong><span>Wiki</span></div>
    </a>
    <div class="wiki-search">
      <i class="fa-solid fa-magnifying-glass"></i>
      <input type="search" id="wiki-search" placeholder="Поиск...">
    </div>
    <nav class="wiki-nav">
      <div class="wiki-nav-group">
        <div class="wiki-nav-title">Начало</div>
        <a href="index.html"><i class="fa-solid fa-house"></i> Введение</a>
        <a href="rules.html"><i class="fa-solid fa-scale-balanced"></i> Правила</a>
        <a href="start.html"><i class="fa-solid fa-play"></i> Как начать</a>
        <a href="commands.html"><i class="fa-solid fa-terminal"></i> Команды</a>
      </div>
      <div class="wiki-nav-group">
        <div class="wiki-nav-title">Особенности</div>
        <a href="chat.html"><i class="fa-solid fa-comments"></i> Чат и ЛС</a>
        <a href="trusted.html"><i class="fa-solid fa-shield-halved"></i> Доверенный</a>
        <a href="profile.html"><i class="fa-solid fa-user"></i> Профиль</a>
        <a href="bank.html"><i class="fa-solid fa-building-columns"></i> Банк</a>
        <a href="reports.html"><i class="fa-solid fa-flag"></i> Репорты</a>
        <a href="playtime.html"><i class="fa-solid fa-clock"></i> Онлайн</a>
        <a href="features.html"><i class="fa-solid fa-star"></i> Уникальные функции</a>
        <a href="generation.html"><i class="fa-solid fa-mountain-sun"></i> Кастомная генерация</a>
        <a href="donate.html"><i class="fa-solid fa-gem"></i> Донат и подписка</a>
      </div>
    </nav>`;

  // --- HUB-INSPIRED ANIMATIONS SYSTEM ---
  let particlesArray = [];
  let animationFrameId;
  let canvas, ctx;

  function initParticles() {
    canvas = document.getElementById('wiki-particles');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'wiki-particles';
      document.body.appendChild(canvas);
    }
    ctx = canvas.getContext('2d');

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
      }
      reset() {
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.3 - 0.15;
        this.speedY = Math.random() * -0.4 - 0.15; // Float upwards gently
        this.opacity = Math.random() * 0.4 + 0.15;
        this.color = `rgba(139, 116, 255, ${this.opacity})`; // Soft magic purple glow
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
          this.y = canvas.height;
          this.x = Math.random() * canvas.width;
          this.reset();
        }
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    particlesArray = [];
    const numParticles = Math.min(60, Math.floor((window.innerWidth * window.innerHeight) / 25000));
    for (let i = 0; i < numParticles; i++) {
      particlesArray.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }
    if (animationFrameId) cancelAnimationFrame(animationFrameId);
    animateParticles();
  }

  function initPageAnimations() {
    // 1. 3D Tilt Effect on cards and pagers
    const tiltTargets = document.querySelectorAll('.wiki-card, .wiki-ref, .wiki-pager a:not(.disabled)');
    tiltTargets.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const width = rect.width;
        const height = rect.height;
        const rotateX = -((y / height) - 0.5) * 8; // Gentle tilt angle
        const rotateY = ((x / width) - 0.5) * 8;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
        card.style.transition = 'transform 0.1s ease, box-shadow 0.1s ease';
        card.style.boxShadow = '0 12px 28px rgba(139, 116, 255, 0.08)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        card.style.boxShadow = '';
      });
    });

    // 2. Scroll Reveal observer
    const revealTargets = document.querySelectorAll('.wiki-card, .wiki-ref, .wiki-callout, .wiki-article h2, .wiki-article h3, .wiki-table-wrap');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealTargets.forEach(target => {
      target.classList.add('reveal-item');
      revealObserver.observe(target);
    });
  }

  function currentFile(pathStr) {
    const path = (pathStr || location.pathname || '').replace(/\\/g, '/');
    return path.split('/').pop() || 'index.html';
  }

  function renderPageElements(file) {
    // 1. Highlight active nav link
    document.querySelectorAll('.wiki-nav a').forEach((a) => {
      const href = (a.getAttribute('href') || '').split('/').pop();
      if (href === file) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });

    const article = document.querySelector('.wiki-article');
    const page = pages.find((p) => p.file === file);

    // Remove old elements first
    const oldBreadcrumb = document.querySelector('.wiki-breadcrumb');
    if (oldBreadcrumb) oldBreadcrumb.remove();
    const oldPager = document.querySelector('.wiki-pager');
    if (oldPager) oldPager.remove();

    // 2. Add Breadcrumb
    if (article && page) {
      const groupName = page.group === 'start' ? 'Начало' : page.group === 'features' ? 'Особенности' : 'Информация';
      const bc = document.createElement('div');
      bc.className = 'wiki-breadcrumb';
      bc.innerHTML = `<a href="index.html">Wiki</a><span>/</span><span>${groupName}</span><span>/</span><span>${page.title}</span>`;
      article.insertBefore(bc, article.firstChild);
    }

    // 3. Add Pager
    const idx = pages.findIndex((p) => p.file === file);
    if (idx >= 0 && article) {
      const prev = pages[idx - 1];
      const next = pages[idx + 1];
      const pager = document.createElement('div');
      pager.className = 'wiki-pager';
      pager.innerHTML = `
        ${prev ? `<a href="${prev.file}"><span class="label">← Назад</span><span class="title">${prev.title}</span></a>` : `<a class="disabled"><span class="label">← Назад</span><span class="title">—</span></a>`}
        ${next ? `<a class="next" href="${next.file}"><span class="label">Далее →</span><span class="title">${next.title}</span></a>` : `<a class="next disabled"><span class="label">Далее →</span><span class="title">—</span></a>`}
      `;
      const main = document.querySelector('.wiki-main');
      if (main) main.appendChild(pager);
    }
    
    // Trigger page animations after rendering elements
    if (typeof initPageAnimations === 'function') {
      initPageAnimations();
    }
  }

  function loadPage(href, pushState = true) {
    const file = href.split('/').pop() || 'index.html';
    const main = document.querySelector('.wiki-main');
    const article = document.querySelector('.wiki-article');

    if (!main || !article) {
      if (pushState) location.href = href;
      return;
    }

    // Add fade-out class
    main.classList.add('fade-out');

    setTimeout(() => {
      fetch(href)
        .then((res) => {
          if (!res.ok) throw new Error('Network error');
          return res.text();
        })
        .then((html) => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          const newArticle = doc.querySelector('.wiki-article');

          if (newArticle) {
            article.innerHTML = newArticle.innerHTML;
            document.title = doc.title;

            if (pushState) {
              history.pushState({ href }, '', href);
            }

            renderPageElements(file);

            // Scroll content area back to top
            window.scrollTo({ top: 0, behavior: 'instant' });
          } else {
            location.href = href;
          }
        })
        .catch(() => {
          location.href = href;
        })
        .finally(() => {
          // Remove fade-out class to let content fade/slide back in
          main.classList.remove('fade-out');
        });
    }, 200); // 200ms duration aligns with transition speed variables
  }

  function boot() {
    const sidebar = document.querySelector('.wiki-sidebar');

    // 1. Inject mobile header bar dynamically
    let mobileHeader = document.querySelector('.wiki-mobile-header');
    if (!mobileHeader) {
      mobileHeader = document.createElement('div');
      mobileHeader.className = 'wiki-mobile-header';
      mobileHeader.innerHTML = `
        <button class="wiki-mobile-toggle" type="button" aria-label="Меню"><i class="fa-solid fa-bars"></i></button>
        <a href="index.html" class="wiki-brand-mobile">
          <img src="assets/logo_vanilla.png" alt="ShizCraft">
          <strong>ShizCraft Wiki</strong>
        </a>
      `;
      document.body.insertBefore(mobileHeader, document.body.firstChild);
    }

    if (sidebar && !sidebar.dataset.ready) {
      sidebar.innerHTML = nav;
      sidebar.dataset.ready = '1';

      // Attach search filter
      const search = sidebar.querySelector('#wiki-search');
      if (search) {
        search.addEventListener('input', () => {
          const q = search.value.trim().toLowerCase();
          sidebar.querySelectorAll('.wiki-nav a').forEach((a) => {
            a.style.display = !q || a.textContent.toLowerCase().includes(q) ? '' : 'none';
          });
        });
      }
    }

    // 2. Set up overlay toggling for mobile sidebar
    function closeSidebar() {
      const sb = document.querySelector('.wiki-sidebar');
      const mh = document.querySelector('.wiki-mobile-header');
      const ov = document.querySelector('.wiki-overlay');
      if (sb) sb.classList.remove('open');
      if (mh) mh.classList.remove('hidden');
      if (ov) ov.remove();
    }

    function toggleSidebar() {
      const sb = document.querySelector('.wiki-sidebar');
      const mh = document.querySelector('.wiki-mobile-header');
      if (sb) {
        const isOpen = sb.classList.toggle('open');
        if (isOpen) {
          // Hide mobile header
          if (mh) mh.classList.add('hidden');
          // Create overlay
          let overlay = document.querySelector('.wiki-overlay');
          if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'wiki-overlay';
            document.body.appendChild(overlay);
            overlay.addEventListener('click', closeSidebar);
          }
        } else {
          closeSidebar();
        }
      }
    }

    // Attach click handler to mobile header toggle
    const mobileToggle = mobileHeader.querySelector('.wiki-mobile-toggle');
    if (mobileToggle) {
      mobileToggle.addEventListener('click', toggleSidebar);
    }

    // Init current page styles and pagers
    renderPageElements(currentFile());
    
    // Init magical particles background
    if (typeof initParticles === 'function') {
      initParticles();
    }

    // Intercept click events on local links
    document.addEventListener('click', (e) => {
      const anchor = e.target.closest('a');
      if (!anchor) return;
      
      const href = anchor.getAttribute('href');
      if (!href) return;

      const file = href.split('/').pop();
      const page = pages.find((p) => p.file === file);
      
      if (page) {
        e.preventDefault();
        
        // Hide mobile sidebar and overlay if open
        closeSidebar();
        
        loadPage(href);
      }
    });

    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
      loadPage(location.pathname, false);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
