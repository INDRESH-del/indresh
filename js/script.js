/* Mumbai A2Z IT Solution - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initPerformanceMode();
  initParticleBackground();
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initTestimonialSlider();
  initFaqAccordion();
  initFormHandlers();
  initNavHighlight();
  initScrollNav();
  initServiceCardImageFill();
});

/* ---- Performance / smooth scrolling ---- */
function isPerfLite() {
  return (
    document.documentElement.classList.contains('perf-lite') ||
    window.matchMedia('(max-width: 1024px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

function initPerformanceMode() {
  const root = document.documentElement;
  const lite =
    window.matchMedia('(max-width: 1024px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    window.matchMedia('(hover: none)').matches;

  root.classList.add('fast-scroll');

  if (lite) {
    root.classList.add('perf-lite');
  }

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    root.classList.add('reduce-motion');
  }

  document.body.classList.remove('nav-open');
  document.body.style.overflow = '';
}

/* ---- Animated particle network background ---- */
function initParticleBackground() {
  if (document.getElementById('particles-bg')) return;

  const canvas = document.createElement('canvas');
  canvas.id = 'particles-bg';
  canvas.setAttribute('aria-hidden', 'true');
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const lite = isPerfLite();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const particleCount = lite ? 28 : 42;
  const connectDistance = lite ? 95 : 120;
  const colors = ['#06b6d4', '#67e8f9', '#afd2fc', '#a855f7', '#ec4899', '#84cc16', '#9bdefb'];

  let width = 0;
  let height = 0;
  let particles = [];
  let animationId = 0;
  let isScrolling = false;
  let scrollStopTimer = 0;
  let frameSkip = 0;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  function createParticle() {
    const yRatio = 0.3 + Math.pow(Math.random(), 0.55) * 0.7;
    return {
      x: Math.random() * width,
      y: height * yRatio,
      vx: (Math.random() - 0.5) * (lite ? 0.5 : 0.85),
      vy: (Math.random() - 0.5) * (lite ? 0.5 : 0.85),
      r: Math.random() * 2.2 + 1.1,
      color: colors[Math.floor(Math.random() * colors.length)],
      alpha: Math.random() * 0.45 + 0.55
    };
  }

  function resetParticles() {
    resize();
    particles = Array.from({ length: particleCount }, createParticle);
  }

  function draw() {
    ctx.fillStyle = '#030712';
    ctx.fillRect(0, 0, width, height);

    const topFade = ctx.createLinearGradient(0, 0, 0, height);
    topFade.addColorStop(0, 'rgba(3, 7, 18, 0)');
    topFade.addColorStop(0.5, 'rgba(6, 182, 212, 0.03)');
    topFade.addColorStop(1, 'rgba(6, 182, 212, 0.08)');
    ctx.fillStyle = topFade;
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
      if (!reducedMotion) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < height * 0.22 || p.y > height) p.vy *= -1;
      }
    });

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = connectDistance * connectDistance;
        if (distSq < maxDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / connectDistance) * 0.32;
          ctx.strokeStyle = `rgba(34, 211, 238, ${opacity})`;
          ctx.lineWidth = 0.55;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }

  function animate() {
    if (!reducedMotion) {
      if (isScrolling) {
        frameSkip += 1;
        if (frameSkip % 3 !== 0) {
          animationId = requestAnimationFrame(animate);
          return;
        }
      } else {
        frameSkip = 0;
      }
      draw();
      animationId = requestAnimationFrame(animate);
    }
  }

  resetParticles();
  animate();

  window.addEventListener(
    'scroll',
    () => {
      isScrolling = true;
      clearTimeout(scrollStopTimer);
      scrollStopTimer = setTimeout(() => {
        isScrolling = false;
      }, 120);
    },
    { passive: true }
  );

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resetParticles, 200);
  });

  document.addEventListener('visibilitychange', () => {
    if (reducedMotion) return;
    if (document.hidden) {
      cancelAnimationFrame(animationId);
    } else {
      animate();
    }
  });
}

/* ---- Service Card Image Fill (blur backdrop, no crop) ---- */
function initServiceCardImageFill() {
  document.querySelectorAll('.card--service .card-marked-area').forEach(area => {
    const img = area.querySelector('.card-marked-area__media img') || area.querySelector(':scope > img');
    if (!img) return;

    let media = area.querySelector('.card-marked-area__media');
    if (!media) {
      media = document.createElement('div');
      media.className = 'card-marked-area__media';
      area.insertBefore(media, img);
      media.appendChild(img);
    }

    const applyFill = () => {
      const src = img.currentSrc || img.src;
      if (!src || isPerfLite() || document.documentElement.classList.contains('fast-scroll')) return;

      media.style.setProperty('--card-img-url', `url("${src}")`);
      media.classList.add('has-image-fill');
    };

    if (img.complete) {
      applyFill();
    } else {
      img.addEventListener('load', applyFill, { once: true });
    }
  });
}

/* ---- Mobile Navigation ---- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('is-open');
    document.body.classList.remove('nav-open');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  }

  closeMenu();

  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('is-open');
    document.body.classList.add('nav-open');
    hamburger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navLinks.classList.contains('open')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.addEventListener('click', (e) => {
    if (e.target === navLinks) {
      closeMenu();
    }
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ---- Smooth Scrolling ---- */
function smoothScrollTo(top) {
  window.scrollTo({ top, behavior: 'smooth' });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!animatedElements.length) return;

  animatedElements.forEach(el => el.classList.add('visible'));
}

/* ---- Testimonial Slider ---- */
function initTestimonialSlider() {
  const testimonials = [
    {
      text: 'Excellent service and very professional. They fixed my laptop screen within hours.',
      name: 'John Smith',
      role: 'Business Owner'
    },
    {
      text: 'Fixed my laptop within one day. Highly recommend TechFix for any IT issues.',
      name: 'Michael Chen',
      role: 'Software Developer'
    },
    {
      text: 'Great business support. Our entire office network was upgraded seamlessly.',
      name: 'Sarah Johnson',
      role: 'Office Manager'
    },
    {
      text: 'Affordable pricing and transparent communication throughout the repair process.',
      name: 'David Williams',
      role: 'Freelancer'
    },
    {
      text: 'Their onsite support saved our business during a critical server failure.',
      name: 'Emily Davis',
      role: 'IT Director'
    }
  ];

  const box = document.querySelector('.testimonial');
  const dotsContainer = document.querySelector('.testimonial-dots');

  if (!box) return;

  let currentIndex = 0;
  let intervalId;

  function renderTestimonial(index) {
    const t = testimonials[index];
    box.style.opacity = '0';

    setTimeout(() => {
      box.innerHTML = `
        <div class="testimonial-stars">
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
          <i class="fas fa-star"></i>
        </div>
        <p>"${t.text}"</p>
        <h4>- ${t.name}</h4>
        <p style="font-size:0.85rem;color:var(--text-light);font-style:normal;margin-top:0.25rem;">${t.role}</p>
      `;
      box.style.opacity = '1';
    }, 300);

    if (dotsContainer) {
      dotsContainer.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    }
  }

  if (dotsContainer) {
    testimonials.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('testimonial-dot');
      dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        currentIndex = i;
        renderTestimonial(currentIndex);
        resetInterval();
      });

      dotsContainer.appendChild(dot);
    });
  }

  function resetInterval() {
    clearInterval(intervalId);
    const delay = isPerfLite() ? 8000 : 5000;
    intervalId = setInterval(() => {
      if (document.hidden) return;
      currentIndex = (currentIndex + 1) % testimonials.length;
      renderTestimonial(currentIndex);
    }, delay);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(intervalId);
    } else {
      resetInterval();
    }
  });

  box.style.transition = isPerfLite() ? 'opacity 0.2s ease' : 'opacity 0.3s ease';
  renderTestimonial(0);
  resetInterval();
}

/* ---- FAQ Accordion ---- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => other.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ---- Form Handlers ---- */
function initFormHandlers() {
  const forms = document.querySelectorAll('form[data-form]');

  forms.forEach(form => {
    if (!form.querySelector('[name="botcheck"]')) {
      const honeypot = document.createElement('input');
      honeypot.type = 'checkbox';
      honeypot.name = 'botcheck';
      honeypot.tabIndex = -1;
      honeypot.autocomplete = 'off';
      honeypot.hidden = true;
      form.appendChild(honeypot);
    }

    form.addEventListener('submit', async e => {
      e.preventDefault();
      await handleFormSubmit(form);
    });
  });
}

function isFormConfigured() {
  const key = window.FORM_CONFIG?.accessKey;
  return Boolean(key && key !== 'YOUR_WEB3FORMS_ACCESS_KEY_HERE');
}

function getFormPayload(form) {
  const formType = form.getAttribute('data-form');
  const data = Object.fromEntries(new FormData(form).entries());

  const subject =
    formType === 'booking'
      ? `New Repair Booking - ${data.name || 'Client'}`
      : `New Contact Message - ${data.subject || data.name || 'Client'}`;

  const message =
    formType === 'booking'
      ? [
          'New repair booking request from the website.',
          '',
          `Name: ${data.name || '-'}`,
          `Email: ${data.email || '-'}`,
          `Phone: ${data.phone || '-'}`,
          `Service: ${data.service || '-'}`,
          `Preferred Date: ${data.date || '-'}`,
          `Service Type: ${data.type || '-'}`,
          '',
          'Issue:',
          data.issue || '-'
        ].join('\n')
      : [
          'New contact message from the website.',
          '',
          `Name: ${data.name || '-'}`,
          `Email: ${data.email || '-'}`,
          `Phone: ${data.phone || '-'}`,
          `Subject: ${data.subject || '-'}`,
          '',
          'Message:',
          data.message || '-'
        ].join('\n');

  return {
    access_key: window.FORM_CONFIG.accessKey,
    subject,
    from_name: data.name || 'Website Visitor',
    email: data.email || window.FORM_CONFIG.toEmail,
    message,
    form_type: formType,
    ...data
  };
}

function showFormError(form, message) {
  let errorEl = form.parentElement.querySelector('.form-error');

  if (!errorEl) {
    errorEl = document.createElement('div');
    errorEl.className = 'form-error';
    errorEl.setAttribute('role', 'alert');
    form.parentElement.insertBefore(errorEl, form.nextSibling);
  }

  errorEl.textContent = message;
  errorEl.classList.add('show');
}

function hideFormError(form) {
  const errorEl = form.parentElement.querySelector('.form-error');
  if (errorEl) {
    errorEl.classList.remove('show');
  }
}

function showFormSuccess(form) {
  const successMsg = form.parentElement.querySelector('.form-success');

  if (successMsg) {
    form.classList.add('hidden');
    successMsg.classList.add('show');
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalHtml = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Sent Successfully!';
  btn.style.background = '#16a34a';
  form.reset();

  setTimeout(() => {
    btn.innerHTML = originalHtml;
    btn.style.background = '';
  }, 3000);
}

async function handleFormSubmit(form) {
  hideFormError(form);

  if (!isFormConfigured()) {
    showFormError(
      form,
      'Form email is not configured yet. Add your Web3Forms access key in js/form-config.js.'
    );
    return;
  }

  const btn = form.querySelector('button[type="submit"]');
  const originalHtml = btn.innerHTML;
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(getFormPayload(form))
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'Unable to send your request. Please try again.');
    }

    showFormSuccess(form);
  } catch (error) {
    showFormError(
      form,
      error.message || 'Something went wrong. Please call us or try again later.'
    );
  } finally {
    btn.disabled = false;
    btn.innerHTML = originalHtml;
  }
}

/* ---- Page Scroll Navigation ---- */
function initScrollNav() {
  if (document.querySelector('.scroll-nav')) return;

  const nav = document.createElement('nav');
  nav.className = 'scroll-nav';
  nav.setAttribute('aria-label', 'Page scroll shortcuts');

  const buttons = [
    {
      label: 'Scroll to top',
      title: 'Go to top',
      icon: 'fa-chevron-up',
      action: scrollToTop
    },
    {
      label: 'Scroll to middle',
      title: 'Go to middle',
      icon: 'fa-minus',
      action: scrollToMiddle,
      middle: true
    },
    {
      label: 'Scroll to bottom',
      title: 'Go to end',
      icon: 'fa-chevron-down',
      action: scrollToBottom
    }
  ];

  buttons.forEach(({ label, title, icon, action, middle }) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = middle ? 'scroll-nav__btn scroll-nav__btn--middle' : 'scroll-nav__btn';
    btn.setAttribute('aria-label', label);
    btn.title = title;
    btn.innerHTML = `<i class="fas ${icon}" aria-hidden="true"></i>`;
    btn.addEventListener('click', action);
    nav.appendChild(btn);
  });

  document.body.appendChild(nav);
}

function scrollToTop() {
  smoothScrollTo(0);
}

function scrollToMiddle() {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  smoothScrollTo(Math.max(0, maxScroll / 2));
}

function scrollToBottom() {
  smoothScrollTo(document.documentElement.scrollHeight);
}

/* ---- Active Nav Highlight (single-page sections) ---- */
function initNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.3, rootMargin: `-${getComputedStyle(document.documentElement).getPropertyValue('--nav-height')} 0px -50% 0px` }
  );

  sections.forEach(section => observer.observe(section));
}
