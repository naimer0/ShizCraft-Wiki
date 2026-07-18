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
    { file: 'guard.html', title: 'Гвардия', group: 'features' },
    { file: 'reports.html', title: 'Репорты', group: 'features' },
    { file: 'playtime.html', title: 'Онлайн', group: 'features' },
    { file: 'features.html', title: 'Уникальные функции', group: 'features' },
    { file: 'crafts.html', title: 'Кастомные крафты', group: 'features' },
    { file: 'generation.html', title: 'Кастомная генерация', group: 'features' },
    { file: 'donate.html', title: 'Донат и подписка', group: 'features' },
    { file: 'folia.html', title: 'Ядро Folia', group: 'info' },
    { file: 'plugins.html', title: 'Сводная таблица систем', group: 'info' }
  ];

  const nav = `
    <a href="index.html" class="wiki-brand">
      <img src="assets/logo_vanilla.png" alt="ShizCraft" width="34" height="34" decoding="async">
      <div><strong>ShizCraft</strong><span>Wiki</span></div>
    </a>
    <div class="wiki-search">
      <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
      <label class="wiki-sr-only" for="wiki-search">Поиск по разделам</label>
      <input type="search" id="wiki-search" placeholder="Поиск..." autocomplete="off">
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
        <a href="guard.html"><i class="fa-solid fa-user-shield"></i> Гвардия</a>
        <a href="reports.html"><i class="fa-solid fa-flag"></i> Репорты</a>
        <a href="playtime.html"><i class="fa-solid fa-clock"></i> Онлайн</a>
        <a href="features.html"><i class="fa-solid fa-star"></i> Уникальные функции</a>
        <a href="crafts.html"><i class="fa-solid fa-screwdriver-wrench"></i> Кастомные крафты</a>
        <a href="generation.html"><i class="fa-solid fa-mountain-sun"></i> Кастомная генерация</a>
        <a href="donate.html"><i class="fa-solid fa-gem"></i> Донат и подписка</a>
      </div>
      <div class="wiki-nav-group">
        <div class="wiki-nav-title">Справка</div>
        <a href="folia.html"><i class="fa-solid fa-microchip"></i> Ядро Folia</a>
        <a href="plugins.html"><i class="fa-solid fa-list-check"></i> Все системы</a>
      </div>
    </nav>`;

  function initPageAnimations() {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    // Keep the pointer tilt for desktop mice only.
    const tiltTargets = document.querySelectorAll('.wiki-card, .wiki-ref, .wiki-pager a:not(.disabled)');
    if (supportsHover && !reduceMotion) tiltTargets.forEach(card => {
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

    const revealTargets = document.querySelectorAll('.wiki-card, .wiki-ref, .wiki-callout, .wiki-article h2, .wiki-article h3, .wiki-table-wrap');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((target) => target.classList.add('reveal-active'));
      return;
    }
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
        a.setAttribute('aria-current', 'page');
      } else {
        a.classList.remove('active');
        a.removeAttribute('aria-current');
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
      const bc = document.createElement('nav');
      bc.className = 'wiki-breadcrumb';
      bc.setAttribute('aria-label', 'Хлебные крошки');
      bc.innerHTML = `<a href="index.html">Wiki</a><span aria-hidden="true">/</span><span>${groupName}</span><span aria-hidden="true">/</span><span aria-current="page">${page.title}</span>`;
      article.insertBefore(bc, article.firstChild);
    }

    // 3. Add Pager
    const idx = pages.findIndex((p) => p.file === file);
    if (idx >= 0 && article) {
      const prev = pages[idx - 1];
      const next = pages[idx + 1];
      const pager = document.createElement('nav');
      pager.className = 'wiki-pager';
      pager.setAttribute('aria-label', 'Навигация по страницам');
      pager.innerHTML = `
        ${prev ? `<a href="${prev.file}"><span class="label">← Назад</span><span class="title">${prev.title}</span></a>` : `<span class="disabled" aria-hidden="true"><span class="label">← Назад</span><span class="title">—</span></span>`}
        ${next ? `<a class="next" href="${next.file}"><span class="label">Далее →</span><span class="title">${next.title}</span></a>` : `<span class="next disabled" aria-hidden="true"><span class="label">Далее →</span><span class="title">—</span></span>`}
      `;
      const main = document.querySelector('.wiki-main');
      if (main) main.appendChild(pager);
    }
    
    // Trigger page animations after rendering elements
    if (typeof initPageAnimations === 'function') {
      initPageAnimations();
    }
  }

  function boot() {
    const sidebar = document.querySelector('.wiki-sidebar');
    const main = document.querySelector('.wiki-main');
    if (sidebar) {
      sidebar.id = 'wiki-sidebar';
      sidebar.setAttribute('aria-label', 'Навигация по вики');
    }
    if (main) {
      main.id = 'wiki-content';
      main.setAttribute('tabindex', '-1');
    }

    const skipLink = document.createElement('a');
    skipLink.className = 'wiki-skip-link';
    skipLink.href = '#wiki-content';
    skipLink.textContent = 'Перейти к содержанию';
    document.body.insertBefore(skipLink, document.body.firstChild);

    // 1. Inject mobile header bar dynamically
    let mobileHeader = document.querySelector('.wiki-mobile-header');
    if (!mobileHeader) {
      mobileHeader = document.createElement('header');
      mobileHeader.className = 'wiki-mobile-header';
      mobileHeader.innerHTML = `
        <button class="wiki-mobile-toggle" type="button" aria-label="Открыть меню" aria-controls="wiki-sidebar" aria-expanded="false"><i class="fa-solid fa-bars" aria-hidden="true"></i></button>
        <a href="index.html" class="wiki-brand-mobile">
          <img src="assets/logo_vanilla.png" alt="ShizCraft" width="24" height="24" decoding="async">
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
          sidebar.querySelectorAll('.wiki-nav-group').forEach((group) => {
            const hasVisibleLink = [...group.querySelectorAll('a')].some((a) => a.style.display !== 'none');
            group.hidden = !hasVisibleLink;
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
      document.body.classList.remove('menu-open');
      mobileHeader.querySelector('.wiki-mobile-toggle')?.setAttribute('aria-expanded', 'false');
    }

    function toggleSidebar() {
      const sb = document.querySelector('.wiki-sidebar');
      const mh = document.querySelector('.wiki-mobile-header');
      if (sb) {
        const isOpen = sb.classList.toggle('open');
        if (isOpen) {
          // Hide mobile header
          if (mh) mh.classList.add('hidden');
          document.body.classList.add('menu-open');
          mobileHeader.querySelector('.wiki-mobile-toggle')?.setAttribute('aria-expanded', 'true');
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

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && document.querySelector('.wiki-sidebar.open')) {
        closeSidebar();
        mobileToggle?.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeSidebar();
    });

    // Init current page styles and pagers
    renderPageElements(currentFile());

    document.querySelectorAll('.fa-solid').forEach((icon) => {
      icon.setAttribute('aria-hidden', 'true');
    });
    document.querySelectorAll('.wiki-table th').forEach((header) => {
      if (!header.hasAttribute('scope')) header.setAttribute('scope', 'col');
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
