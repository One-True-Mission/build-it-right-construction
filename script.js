/* =============================================
   BUILT RIGHT CONSTRUCTION & REMODELING
   script.js
   ============================================= */

// ---- CUSTOM CURSOR ----
const cursor     = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mouseX = 0, mouseY = 0;
let ringX  = 0, ringY  = 0;

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

(function animateRing() {
  ringX += (mouseX - ringX) * 0.12;
  ringY += (mouseY - ringY) * 0.12;
  cursorRing.style.left = ringX + 'px';
  cursorRing.style.top  = ringY + 'px';
  requestAnimationFrame(animateRing);
})();

document.querySelectorAll('a, button, input, select, textarea, .service-card, .gallery-item, .ba-handle').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1.8)';
    cursorRing.style.width  = '52px';
    cursorRing.style.height = '52px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.width  = '36px';
    cursorRing.style.height = '36px';
  });
});

// ---- SCROLL PROGRESS ----
const progressBar = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  progressBar.style.width = (scrollTop / docHeight * 100) + '%';
}, { passive: true });

// ---- NAV SCROLL STATE ----
const nav = document.getElementById('mainNav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ---- BACK TO TOP ----
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ---- FLOATING CTA ----
const floatingCta = document.querySelector('.floating-cta');
window.addEventListener('scroll', () => {
  const heroHeight = document.querySelector('.hero').offsetHeight;
  floatingCta.classList.toggle('visible', window.scrollY > heroHeight * 0.6);
}, { passive: true });

// ---- SCROLL REVEAL ----
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
reveals.forEach(r => revealObserver.observe(r));

// ---- BEFORE / AFTER SLIDER ----
function initBASlider(sliderId, handleId, afterImgId) {
  const slider   = document.getElementById(sliderId);
  const handle   = document.getElementById(handleId);
  const afterImg = document.getElementById(afterImgId);
  if (!slider || !handle || !afterImg) return;

  let dragging = false;

  function setPos(clientX) {
    const rect = slider.getBoundingClientRect();
    let pct = Math.min(Math.max((clientX - rect.left) / rect.width * 100, 1), 99);
    afterImg.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = pct + '%';
  }

  // Init at 50%
  afterImg.style.clipPath = 'inset(0 50% 0 0)';
  handle.style.left = '50%';

  // Mouse
  slider.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });

  // Touch
  slider.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });
}

initBASlider('baSlider1', 'baHandle1', 'baAfterImg1');

// ---- CONTACT FORM ----
const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const data = new FormData(form);

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' }
      });
      if (res.ok) {
        submitBtn.textContent = 'Request Sent!';
        form.reset();
        setTimeout(() => {
          submitBtn.textContent = 'Send Request \u2192';
          submitBtn.disabled = false;
        }, 4000);
      } else {
        throw new Error();
      }
    } catch {
      submitBtn.textContent = 'Send Request \u2192';
      submitBtn.disabled = false;
      alert('Something went wrong. Please try again.');
    }
  });
}
