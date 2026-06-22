// ============================================================
// 1. SPLIT WORDS — wrap each word in a span for stagger animation
// ============================================================
document.querySelectorAll('.split-words').forEach((el, parentIdx) => {
  const txt = el.dataset.words || el.textContent;
  el.textContent = '';
  txt.split(' ').forEach((word, i) => {
    const span = document.createElement('span');
    span.className = 'word';
    span.innerHTML = word + '&nbsp;';
    span.style.animationDelay = (0.55 + parentIdx * 0.18 + i * 0.06) + 's';
    el.appendChild(span);
  });
});

// ============================================================
// 2. ENSO LOGO DRAW-IN on load
// ============================================================
document.querySelectorAll('.enso-svg').forEach(svg => {
  requestAnimationFrame(() => svg.classList.add('draw'));
});

// ============================================================
// 3. SCROLL REVEAL
// ============================================================
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      e.target.classList.add('is-visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => revealObs.observe(el));

// ============================================================
// 4. COUNTER ANIMATION — supports counting up OR down
// ============================================================
function easeOutCubic(t){ return 1 - Math.pow(1 - t, 3); }

function animateCounter(el){
  const end       = parseInt(el.dataset.end, 10);
  const start     = parseInt(el.dataset.start || '0', 10);
  const isCountDown = start > end;
  // Slower duration for countdowns — more dramatic
  const duration  = isCountDown ? 2400 : 1800;
  const startTime = performance.now();

  function tick(now){
    const p = Math.min((now - startTime) / duration, 1);
    const eased = easeOutCubic(p);
    el.textContent = Math.round(start + (end - start) * eased);
    if(p < 1) requestAnimationFrame(tick);
    else el.textContent = end;
  }
  requestAnimationFrame(tick);
}

const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){
      animateCounter(e.target);
      counterObs.unobserve(e.target);
    }
  });
}, { threshold: 0.25 });

// Initialize counter elements to their start value so the first
// visible number is the high price, then it ticks down.
document.querySelectorAll('.counter').forEach(el => {
  el.textContent = el.dataset.start || '0';
  counterObs.observe(el);
});

// ============================================================
// 5. PARALLAX
// ============================================================
const parallaxEls = document.querySelectorAll('[data-parallax]');
let scrollY = window.pageYOffset;
let parallaxTicking = false;

function updateParallax(){
  parallaxEls.forEach(el => {
    const speed = parseFloat(el.dataset.parallax);
    const rect = el.getBoundingClientRect();
    if(rect.bottom > -200 && rect.top < window.innerHeight + 200){
      const offset = (rect.top + scrollY - window.innerHeight/2) * speed * -0.3;
      el.style.transform = `translateY(${offset}px)`;
    }
  });
  parallaxTicking = false;
}

const supportsParallax = matchMedia('(hover: hover)').matches && !matchMedia('(prefers-reduced-motion: reduce)').matches;

if(supportsParallax){
  window.addEventListener('scroll', () => {
    scrollY = window.pageYOffset;
    if(!parallaxTicking){
      requestAnimationFrame(updateParallax);
      parallaxTicking = true;
    }
  }, { passive: true });
  updateParallax();
}

// ============================================================
// 6. MAGNETIC BUTTONS
// ============================================================
if(matchMedia('(hover: hover)').matches){
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
// 7. MOBILE NAV
// ============================================================
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileClose = document.querySelector('.mobile-menu .close');

if(navToggle){
  navToggle.addEventListener('click', () => mobileMenu.classList.add('open'));
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ============================================================
// 8. SMOOTH ANCHOR LINKS
// ============================================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if(id.length < 2 || id === '#') return;
    const tgt = document.querySelector(id);
    if(tgt){
      e.preventDefault();
      tgt.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================================================
// 9. FORM
// ============================================================
const form = document.getElementById('contact-form');
if(form){
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const s = document.getElementById('form-status');
    s.textContent = '✓ Sent — we\'ll be in touch within 1 working day.';
    s.classList.add('show');
    form.reset();
  });
}

// ============================================================
// 10. NAV SHRINK ON SCROLL
// ============================================================
const nav = document.querySelector('.site-nav');
window.addEventListener('scroll', () => {
  if(window.pageYOffset > 60){
    nav.style.padding = '0.3rem 0';
  } else {
    nav.style.padding = '';
  }
}, { passive: true });
