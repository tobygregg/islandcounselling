/* ============================================================
   VICTORIA GREGG — ISLAND COUNSELLING GUERNSEY
   script.js  |  Easy-to-edit, well-commented JavaScript
   ============================================================ */

'use strict';

/* ============================================================
   1. NAVBAR: Add shadow when page is scrolled
   ============================================================ */
(function initNavbarScroll() {
  const navbar = document.getElementById('mainNav');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load
})();


/* ============================================================
   2. SCROLL ANIMATIONS (Intersection Observer)
      Elements with .animate-left, .animate-right, .animate-hero,
      and .news-block-two-col will fade in as they scroll into view.
   ============================================================ */
(function initScrollAnimations() {
  const animatedEls = document.querySelectorAll(
    '.animate-left, .animate-right, .animate-hero, .news-block-two-col'
  );

  if (!animatedEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger cards slightly when multiple appear at once
          const delay = entry.target.classList.contains('news-block-two-col')
            ? i * 80
            : 0;

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, delay);

          observer.unobserve(entry.target); // only animate once
        }
      });
    },
    {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    }
  );

  animatedEls.forEach(el => observer.observe(el));
})();


/* ============================================================
   3. DROPDOWN: Hover-open on desktop (accessibility-safe)
   ============================================================ */
(function initDropdownHover() {
  if (window.innerWidth < 992) return; // skip on mobile

  document.querySelectorAll('.navbar .dropdown').forEach(dropdown => {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    const menu   = dropdown.querySelector('.dropdown-menu');
    if (!toggle || !menu) return;

    dropdown.addEventListener('mouseenter', () => {
      menu.classList.add('show');
      toggle.setAttribute('aria-expanded', 'true');
    });

    dropdown.addEventListener('mouseleave', () => {
      menu.classList.remove('show');
      toggle.setAttribute('aria-expanded', 'false');
    });
  });
})();


/* ============================================================
   4. CONTACT FORM: Formspree AJAX submission
      - Shows spinner while sending
      - Shows success/error message without page reload
   ============================================================ */
(function initContactForm() {
  const form        = document.getElementById('contactForm');
  const submitBtn   = document.getElementById('submitBtn');
  const btnText     = submitBtn?.querySelector('.btn-text');
  const btnSpinner  = submitBtn?.querySelector('.btn-spinner');
  const successMsg  = document.getElementById('formSuccess');
  const errorMsg    = document.getElementById('formError');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // --- Show loading state ---
    btnText.classList.add('d-none');
    btnSpinner.classList.remove('d-none');
    submitBtn.disabled = true;
    successMsg.classList.add('d-none');
    errorMsg.classList.add('d-none');

    // --- Build form data ---
    const formData = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        // Success!
        successMsg.classList.remove('d-none');
        form.reset();
      } else {
        // Formspree returned an error
        const data = await response.json();
        console.error('Formspree error:', data);
        errorMsg.classList.remove('d-none');
      }
    } catch (err) {
      // Network error
      console.error('Network error:', err);
      errorMsg.classList.remove('d-none');
    } finally {
      // --- Restore button state ---
      btnText.classList.remove('d-none');
      btnSpinner.classList.add('d-none');
      submitBtn.disabled = false;
    }
  });
})();


/* ============================================================
   5. FORM INPUTS: Ripple / focus animations on fields
      Adds a brief highlight class when a field is focused.
   ============================================================ */
(function initFormAnimations() {
  document.querySelectorAll('.subscribe-form .form-control').forEach(input => {
    input.addEventListener('focus', () => {
      input.closest('.form-floating-group')?.classList.add('field-focused');
    });

    input.addEventListener('blur', () => {
      input.closest('.form-floating-group')?.classList.remove('field-focused');
    });
  });
})();


/* ============================================================
   6. SMOOTH SCROLL for internal anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });

      // Close mobile nav if open
      const navCollapse = document.getElementById('navbarNav');
      if (navCollapse?.classList.contains('show')) {
        navCollapse.classList.remove('show');
      }
    });
  });
})();
