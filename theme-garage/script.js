/* ==========================================================================
   INSTAL AVTO LVIV - INTERACTIVE JAVASCRIPT
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
  revealOnScroll(); // Initial check

  // 3. Header scroll background adjust
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.style.background = 'rgba(10, 14, 23, 0.95)';
      header.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
    } else {
      header.style.background = 'rgba(10, 14, 23, 0.8)';
      header.style.boxShadow = 'none';
    }
  });

  // 4. Interactive Price Calculator
  const btCards = document.querySelectorAll('.bt-card');
  const calcCheckboxes = document.querySelectorAll('.calc-checkbox-card input');
  const calcTotalEl = document.getElementById('calcTotal');

  let currentFactor = 1.0;

  btCards.forEach(card => {
    card.addEventListener('click', () => {
      btCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentFactor = parseFloat(card.getAttribute('data-factor')) || 1.0;
      updateTotal();
    });
  });

  calcCheckboxes.forEach(chk => {
    chk.addEventListener('change', updateTotal);
  });

  function updateTotal() {
    let baseSum = 0;
    calcCheckboxes.forEach(chk => {
      if (chk.checked) {
        baseSum += parseInt(chk.value, 10);
      }
    });
    const finalTotal = Math.round(baseSum * currentFactor);
    calcTotalEl.textContent = finalTotal.toLocaleString('uk-UA') + ' грн';
  }

  // 5. Media Tabs Switcher in Showcase
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabImg = document.getElementById('tabImg');
  const tabCaption = document.getElementById('tabCaption');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const newImg = btn.getAttribute('data-img');
      const newCap = btn.getAttribute('data-cap');

      tabImg.style.opacity = '0.3';
      setTimeout(() => {
        tabImg.src = newImg;
        tabCaption.textContent = newCap;
        tabImg.style.opacity = '1';
      }, 200);
    });
  });

  // 6. Contact Form Submission mock handler
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.innerHTML = 'Надсилання...';
      submitBtn.disabled = true;

      setTimeout(() => {
        alert('Дякуємо! Ваша заявка прийнята. Майстер Інстал Авто зателефонує вам найближчим часом.');
        contactForm.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
      }, 800);
    });
  }
});
