document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();

  const body = document.body;

  /* ---------- Mobile menu ---------- */
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navMenu.querySelectorAll('a').forEach(link =>
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        menuToggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* ---------- Smooth anchor scroll ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', event => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      const headerH = document.querySelector('.site-header')?.offsetHeight ?? 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH + 1;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Reveal on scroll ---------- */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* ---------- Animated counters ---------- */
  const fmt = n => n.toLocaleString('uk-UA');
  const counters = document.querySelectorAll('.stat-num[data-count]');
  const cObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const dur = 1100;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / dur, 1);
        el.textContent = fmt(Math.floor(p * target));
        if (p < 1) requestAnimationFrame(step);
        else el.textContent = fmt(target);
      };
      requestAnimationFrame(step);
      cObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => cObserver.observe(el));

  /* ---------- Gallery filter ---------- */
  const filterBtns = document.querySelectorAll('.gf-btn');
  const cards = document.querySelectorAll('.gallery-card');
  filterBtns.forEach(btn =>
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      const f = btn.dataset.filter;
      cards.forEach(card => {
        const show = f === 'all' || card.dataset.cat === f;
        card.classList.toggle('is-hidden', !show);
      });
    })
  );

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lbImg = document.getElementById('lbImg');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  let current = 0;
  const imgs = Array.from(cards).map(c => ({
    src: c.querySelector('img').getAttribute('src'),
    alt: c.querySelector('img').getAttribute('alt')
  }));

  const showImg = i => {
    const visible = Array.from(cards).filter(c => !c.classList.contains('is-hidden'));
    const visibleData = visible.map(c => ({
      src: c.querySelector('img').getAttribute('src'),
      alt: c.querySelector('img').getAttribute('alt')
    }));
    if (!visibleData.length) return;
    current = (i + visibleData.length) % visibleData.length;
    lbImg.src = visibleData[current].src;
    lbImg.alt = visibleData[current].alt;
    lightbox._data = visibleData;
  };

  cards.forEach(card =>
    card.addEventListener('click', () => {
      const visible = Array.from(cards).filter(c => !c.classList.contains('is-hidden'));
      const idx = visible.indexOf(card);
      showImg(idx);
      lightbox.classList.add('open');
      lightbox.setAttribute('aria-hidden', 'false');
      body.style.overflow = 'hidden';
    })
  );

  const closeLb = () => {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
  };
  lbClose?.addEventListener('click', closeLb);
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
  lbPrev?.addEventListener('click', () => showImg(current - 1));
  lbNext?.addEventListener('click', () => showImg(current + 1));
  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowLeft') showImg(current - 1);
    if (e.key === 'ArrowRight') showImg(current + 1);
  });

  /* ---------- Lead form (demo) ---------- */
  const form = document.getElementById('leadForm');
  const status = document.getElementById('formStatus');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const phoneOk = /[0-9]{9,}/.test(phone.replace(/\D/g, ''));
      form.querySelector('#lf-name').parentElement.classList.toggle('has-error', !name);
      form.querySelector('#lf-phone').parentElement.classList.toggle('has-error', !phoneOk);
      if (!name || !phoneOk) {
        status.textContent = 'Вкажіть ім’я та коректний номер телефону.';
        status.className = 'form-status err';
        return;
      }
      // ДЕМО: реальна відправка підключається через Telegram-бот / Formspree / бекенд.
      status.textContent = 'Дякуємо, ' + name + '! Ми передзвонимо найближчим часом.';
      status.className = 'form-status ok';
      form.reset();
    });
  }
});
