/* =====================================================
   ISLAND COUNSELLING GUERNSEY — script.js
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* -----------------------------------------------
       1. SCROLL ANIMATIONS (IntersectionObserver)
       ----------------------------------------------- */
    const animatables = document.querySelectorAll('.animate-on-scroll');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.10,
        rootMargin: '0px 0px -40px 0px'
    });

    animatables.forEach(el => scrollObserver.observe(el));


    /* -----------------------------------------------
       2. STICKY NAVBAR — shadow boost on scroll
       ----------------------------------------------- */
    const mainNav = document.getElementById('mainNav');

    const onScroll = () => {
        if (window.scrollY > 60) {
            mainNav.classList.add('scrolled');
        } else {
            mainNav.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });


    /* -----------------------------------------------
       3. SMOOTH SCROLL for internal anchor links
       ----------------------------------------------- */
    const smoothLinks = document.querySelectorAll('a.smoothscroll, a[href^="#"]');

    smoothLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href && href.startsWith('#') && href.length > 1) {
                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const navHeight = mainNav ? mainNav.offsetHeight : 70;
                const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

                window.scrollTo({ top: targetTop, behavior: 'smooth' });

                // Close mobile menu if open
                const mobileCollapse = document.getElementById('navbarNav');
                if (mobileCollapse && mobileCollapse.classList.contains('show')) {
                    const toggler = document.querySelector('.navbar-toggler');
                    if (toggler) toggler.click();
                }
            }
        });
    });


    /* -----------------------------------------------
       4. HERO CAROUSEL — animate caption on each slide
       ----------------------------------------------- */
    const heroCarousel = document.getElementById('heroCarousel');

    if (heroCarousel) {
        heroCarousel.addEventListener('slid.bs.carousel', () => {
            const activeItem = heroCarousel.querySelector('.carousel-item.active');
            if (!activeItem) return;

            const captionInner = activeItem.querySelector('.caption-inner');
            if (captionInner) {
                // Reset animation
                captionInner.style.animation = 'none';
                captionInner.offsetHeight; // Force reflow
                captionInner.style.animation = '';
            }
        });
    }


    /* -----------------------------------------------
       5. SERVICE BLOCKS — subtle 3-D tilt on hover
       ----------------------------------------------- */
    const serviceBlocks = document.querySelectorAll('.service-block');

    serviceBlocks.forEach(block => {
        block.addEventListener('mousemove', (e) => {
            const rect = block.getBoundingClientRect();
            const cx = rect.left + rect.width  / 2;
            const cy = rect.top  + rect.height / 2;
            const dx = (e.clientX - cx) / (rect.width  / 2);
            const dy = (e.clientY - cy) / (rect.height / 2);

            block.style.transform = `translateY(-7px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
            block.style.transition = 'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.1s ease';
        });

        block.addEventListener('mouseleave', () => {
            block.style.transform = '';
            block.style.transition = 'border-color 0.35s ease, box-shadow 0.35s ease, transform 0.4s ease';
        });
    });


    /* -----------------------------------------------
       6. CONTACT FORM — feedback on submission
       ----------------------------------------------- */
    const contactForm = document.querySelector('.contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            const action = contactForm.getAttribute('action');

            // Only intercept if a real Formspree ID is set (not placeholder)
            if (!action || action.includes('YOUR_FORM_ID')) {
                e.preventDefault();
                alert('⚠️  Please configure your Formspree form ID in index.html before the form can send messages.');
                return;
            }

            // Show loading state
            const submitBtn = contactForm.querySelector('.submit-btn');
            if (submitBtn) {
                const original = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="bi bi-hourglass-split me-2"></i>Sending…';
                submitBtn.disabled = true;

                // Re-enable after a timeout as fallback
                setTimeout(() => {
                    submitBtn.innerHTML = original;
                    submitBtn.disabled = false;
                }, 8000);
            }
        });
    }


    /* -----------------------------------------------
       7. NAVBAR ACTIVE LINK on scroll (sections)
       ----------------------------------------------- */
    const sections   = document.querySelectorAll('section[id]');
    const navLinks   = document.querySelectorAll('.navbar-nav .nav-link');

    const activateNavLink = () => {
        let current = '';
        const navH  = mainNav ? mainNav.offsetHeight : 70;

        sections.forEach(sec => {
            if (window.scrollY >= sec.offsetTop - navH - 50) {
                current = sec.id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    };

    window.addEventListener('scroll', activateNavLink, { passive: true });

});
