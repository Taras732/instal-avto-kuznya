document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide) lucide.createIcons();
  const body = document.body;

  /* header scrolled state */
  const header = document.querySelector('.site-header');
  const onScrollHeader = () => header.classList.toggle('scrolled', window.scrollY > 24);
  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });

  /* mobile menu */
  const toggle = document.getElementById('menuToggle');
  const nav = document.getElementById('navMenu');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
    });
    nav.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* smooth anchors */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href');
      if (!id || id === '#') return;
      const t = document.querySelector(id);
      if (!t) return;
      e.preventDefault();
      const h = header?.offsetHeight ?? 0;
      window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - h + 1, behavior: 'smooth' });
    });
  });

  /* reveal on scroll */
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    });
  }, { threshold: 0.14, rootMargin: '0px 0px -50px 0px' });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* counters */
  const fmt = n => n.toLocaleString('uk-UA');
  const cio = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el = en.target, target = parseInt(el.dataset.count, 10), dur = 1300;
      let s = null;
      const step = ts => {
        if (!s) s = ts;
        const p = Math.min((ts - s) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.floor(eased * target));
        if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target);
      };
      requestAnimationFrame(step);
      cio.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

  /* parallax bands */
  const paras = document.querySelectorAll('[data-parallax]');
  let ticking = false;
  const parallax = () => {
    paras.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const speed = parseFloat(el.dataset.parallax) || 0.15;
      const shift = (r.top + r.height / 2 - window.innerHeight / 2) * -speed;
      const img = el.querySelector('img');
      if (img) img.style.transform = `translateY(${shift}px)`;
    });
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }, { passive: true });
  parallax();

  /* service card spotlight */
  document.querySelectorAll('.s-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  });

  /* gallery filter */
  const gfs = document.querySelectorAll('.gf');
  const cards = document.querySelectorAll('.g-card');
  gfs.forEach(b =>
    b.addEventListener('click', () => {
      gfs.forEach(x => x.classList.remove('on'));
      b.classList.add('on');
      const f = b.dataset.filter;
      cards.forEach(c => c.classList.toggle('hide', !(f === 'all' || c.dataset.cat === f)));
    })
  );

  /* lightbox */
  const lb = document.getElementById('lb');
  const lbImg = document.getElementById('lbImg');
  let cur = 0, pool = [];
  const refresh = () => Array.from(cards).filter(c => !c.classList.contains('hide'));
  const show = i => {
    pool = refresh().map(c => c.querySelector('img'));
    if (!pool.length) return;
    cur = (i + pool.length) % pool.length;
    lbImg.src = pool[cur].src; lbImg.alt = pool[cur].alt;
  };
  cards.forEach(c =>
    c.addEventListener('click', () => {
      show(refresh().indexOf(c));
      lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false'); body.style.overflow = 'hidden';
    })
  );
  const close = () => { lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true'); body.style.overflow = ''; };
  document.getElementById('lbX')?.addEventListener('click', close);
  lb?.addEventListener('click', e => { if (e.target === lb) close(); });
  document.getElementById('lbPrev')?.addEventListener('click', () => show(cur - 1));
  document.getElementById('lbNext')?.addEventListener('click', () => show(cur + 1));
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  /* lead form (demo) */
  const form = document.getElementById('leadForm');
  const status = document.getElementById('fStatus');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const name = form.name.value.trim();
      const phone = form.phone.value.trim();
      const phoneOk = /[0-9]{9,}/.test(phone.replace(/\D/g, ''));
      form.querySelector('#lf-name').parentElement.classList.toggle('err', !name);
      form.querySelector('#lf-phone').parentElement.classList.toggle('err', !phoneOk);
      if (!name || !phoneOk) {
        status.textContent = 'Вкажіть ім’я та коректний номер телефону.';
        status.className = 'f-status bad'; return;
      }
      // ДЕМО: підключити Telegram-бот / Formspree / бекенд для реальної відправки.
      status.textContent = 'Дякуємо, ' + name + '! Передзвонимо найближчим часом.';
      status.className = 'f-status ok';
      form.reset();
    });
  }
});
