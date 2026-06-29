/* ==========================================================================
   INSTAL AVTO LVIV - WHITE ATELIER EDITION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // 2. Scroll Reveal Animations
  const reveals = document.querySelectorAll('.reveal');
  const revealOnScroll = () => {
    const triggerBottom = window.innerHeight * 0.88;
    reveals.forEach(el => {
      const top = el.getBoundingClientRect().top;
      if (top < triggerBottom) {
        el.classList.add('in');
      }
    });
  };
  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll();

  // 3. Calculator Logic
  const btWhites = document.querySelectorAll('.bt-white');
  const chkWhites = document.querySelectorAll('.chk-white input');
  const whiteTotal = document.getElementById('whiteTotal');
  let currentFactor = 1.0;

  btWhites.forEach(btn => {
    btn.addEventListener('click', () => {
      btWhites.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFactor = parseFloat(btn.getAttribute('data-factor')) || 1.0;
      updateWhiteTotal();
    });
  });

  chkWhites.forEach(chk => {
    chk.addEventListener('change', updateWhiteTotal);
  });

  function updateWhiteTotal() {
    let sum = 0;
    chkWhites.forEach(chk => {
      if (chk.checked) sum += parseInt(chk.value, 10);
    });
    const total = Math.round(sum * currentFactor);
    whiteTotal.textContent = total.toLocaleString('uk-UA') + ' грн';
  }

  // 4. Form Mock Handler
  const whiteForm = document.getElementById('whiteForm');
  if (whiteForm) {
    whiteForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert('Дякуємо! Вашу заявку у стерильне біле ательє Інстал Авто успішно прийнято. Майстер зателефонує вам найближчим часом.');
      whiteForm.reset();
    });
  }
});
