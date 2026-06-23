// ============================================================
// 1. PAGE-LOAD CURTAIN — guaranteed removal via hard timer
//    Runs from script execution start, NOT from window.load,
//    so it works even if the load event has already fired
//    or if some resource is slow to load.
// ============================================================
(function removeCurtain() {
  const curtain = document.querySelector('.page-curtain');
  if (!curtain) return;
  // Hide it as soon as the slide-up animation finishes (~2.3s)
  setTimeout(() => curtain.classList.add('gone'), 2400);
  // Belt + suspenders: fully remove from DOM shortly after
  setTimeout(() => { if (curtain.parentNode) curtain.remove(); }, 3000);
})();

// ============================================================
// 2. SCROLL REVEAL
// ============================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger, .price-card').forEach(el => revealObs.observe(el));

// ============================================================
// 3. COUNTER ANIMATION — supports up OR down
// ============================================================
function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

function animateCounter(el) {
  const end = parseInt(el.dataset.end, 10);
  const start = parseInt(el.dataset.start || '0', 10);
  const isCountDown = start > end;
  const duration = isCountDown ? 2400 : 1800;
  const startTime = performance.now();

  function tick(now) {
    const p = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(p);
    el.textContent = Math.round(start + (end - start) * eased);
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = end;
      // Subtle pop when counter finishes — adds satisfaction
      el.classList.add('done');
      setTimeout(() => el.classList.remove('done'), 600);
    }
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });

document.querySelectorAll('.counter').forEach(el => {
  el.textContent = el.dataset.start || '0';
  counterObs.observe(el);
});

// ============================================================
// 4. PARALLAX — gentle multi-layer scroll
// ============================================================
const parallaxEls = document.querySelectorAll('[data-parallax]');
let scrollY = window.pageYOffset;
let parallaxTicking = false;

function updateParallax() {
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax);
    const rect = el.getBoundingClientRect();
    if (rect.bottom > -200 && rect.top < window.innerHeight + 200) {
      const offset = (rect.top + scrollY - window.innerHeight / 2) * speed * -0.3;
      el.style.transform = `translateY(${offset}px)`;
    }
  });
  parallaxTicking = false;
}

const supportsParallax = matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;

if (supportsParallax) {
  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    if (!parallaxTicking) {
      requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }, { passive: true });
  updateParallax();
}

// ============================================================
// 5. PROCESS TIMELINE — scroll-driven horizontal progress fill
// ============================================================
const processTrack = document.querySelector('.process-track');
const processSection = document.querySelector('.process');

if (processTrack && processSection && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let processTicking = false;

  function updateProcessProgress() {
    const rect = processSection.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when section just enters bottom; 1 when section center has passed viewport center
    const raw = (vh - rect.top - 200) / (rect.height - 200);
    const progress = Math.max(0, Math.min(1, raw));
    processTrack.style.setProperty('--progress', progress);
    processTicking = false;
  }

  window.addEventListener('scroll', () => {
    if (!processTicking) {
      requestAnimationFrame(updateProcessProgress);
      processTicking = true;
    }
  }, { passive: true });
  updateProcessProgress();
}

// ============================================================
// 6. 3D TILT ON OFFER CARDS — premium hover effect
// ============================================================
if (matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.offer-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;  // -1 to 1
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;  // -1 to 1
      const maxTilt = 5;
      card.style.transform =
        `perspective(1000px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) translateZ(12px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ============================================================
// 7. MAGNETIC BUTTONS
// ============================================================
if (matchMedia('(hover: hover)').matches) {
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ============================================================
// 8. FOOTER "LET'S BUILD" — letter-by-letter spring reveal
// ============================================================
document.querySelectorAll('[data-letter-reveal]').forEach(el => {
  // Walk text nodes and wrap each visible char in a span
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null);
  const textNodes = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode);

  let letterIndex = 0;
  textNodes.forEach(node => {
    const frag = document.createDocumentFragment();
    [...node.textContent].forEach(char => {
      if (char === ' ') {
        frag.appendChild(document.createTextNode('\u00A0'));
      } else {
        const span = document.createElement('span');
        span.className = 'ltr';
        span.textContent = char;
        span.style.transitionDelay = (letterIndex * 0.05) + 's';
        frag.appendChild(span);
        letterIndex++;
      }
    });
    node.replaceWith(frag);
  });

  // Trigger reveal when 30% in view
  const letterObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        el.classList.add('is-revealed');
        letterObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  letterObs.observe(el);
});

// ============================================================
// 9. MOBILE NAV
// ============================================================
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-menu .close');

if (navToggle && mobileMenu) {
  navToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============================================================
// 10. SMOOTH ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (id.length < 2 || id === '#') return;
    const tgt = document.querySelector(id);
    if (tgt) {
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// 11. FORM SUBMISSION via Web3Forms
// ============================================================
const form = document.getElementById('contact-form');
if (form) {
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const btnLabel = submitBtn ? submitBtn.querySelector('.btn-label') : null;
  const originalLabel = btnLabel ? btnLabel.textContent : '';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check the access key is set
    const accessKey = form.querySelector('input[name="access_key"]').value;
    if (accessKey === 'YOUR_WEB3FORMS_ACCESS_KEY_HERE' || !accessKey) {
      status.textContent = '⚠ Form not configured yet. Email info@xotic.dev directly.';
      status.className = 'form-status show error';
      return;
    }

    submitBtn.disabled = true;
    if (btnLabel) btnLabel.textContent = 'Sending…';
    status.textContent = '';
    status.className = 'form-status';

    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();

      if (data.success) {
        status.textContent = '✓ Sent — we will be in touch within 1 working day.';
        status.className = 'form-status show success';
        form.reset();
        // restore the access key after reset (since reset clears all inputs)
        form.querySelector('input[name="access_key"]').value = accessKey;
      } else {
        status.textContent = '✕ ' + (data.message || 'Something went wrong. Please email info@xotic.dev directly.');
        status.className = 'form-status show error';
      }
    } catch (err) {
      status.textContent = '✕ Network error. Please email info@xotic.dev directly.';
      status.className = 'form-status show error';
    } finally {
      submitBtn.disabled = false;
      if (btnLabel) btnLabel.textContent = originalLabel;
    }
  });
}

// ============================================================
// 12. NAV SHRINK ON SCROLL
// ============================================================
const nav = document.querySelector('.site-nav');
if (nav) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 60) {
      nav.style.padding = '0.3rem 0';
    } else {
      nav.style.padding = '';
    }
  }, { passive: true });
}
