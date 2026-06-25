/* Mumbai A2Z IT Solution - Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {
  initMobileNav();
  initSmoothScroll();
  initScrollAnimations();
  initTestimonialSlider();
  initFaqAccordion();
  initFormHandlers();
  initNavHighlight();
});

/* ---- Mobile Navigation ---- */
function initMobileNav() {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* ---- Smooth Scrolling ---- */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

/* ---- Scroll Animations ---- */
function initScrollAnimations() {
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right');

  if (!animatedElements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
  );

  animatedElements.forEach(el => observer.observe(el));
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
    intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonials.length;
      renderTestimonial(currentIndex);
    }, 5000);
  }

  box.style.transition = 'opacity 0.3s ease';
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
    form.addEventListener('submit', e => {
      e.preventDefault();

      const successMsg = form.parentElement.querySelector('.form-success');
      if (successMsg) {
        form.classList.add('hidden');
        successMsg.classList.add('show');
      } else {
        const btn = form.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Sent Successfully!';
        btn.style.background = '#16a34a';
        form.reset();

        setTimeout(() => {
          btn.textContent = originalText;
          btn.style.background = '';
        }, 3000);
      }
    });
  });
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
