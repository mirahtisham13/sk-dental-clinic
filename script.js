/* ============================
   SK Dental & Cosmetic Clinic
   Main JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== DARK MODE TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check saved preference
    const savedTheme = localStorage.getItem('sk-dental-theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        html.setAttribute('data-theme', 'dark');
    }

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('sk-dental-theme', next);
    });


    // ========== HEADER SCROLL EFFECT ==========
    const header = document.getElementById('header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });


    // ========== MOBILE MENU ==========
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('open');
        document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    });

    // Close on nav link click
    navMenu.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    // ========== ACTIVE NAV HIGHLIGHTING ==========
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();


    // ========== PROCEDURES ACCORDION ==========
    const procedureCards = document.querySelectorAll('[data-procedure]');

    procedureCards.forEach(card => {
        const header = card.querySelector('.procedure__header');
        header.addEventListener('click', () => {
            const isActive = card.classList.contains('active');

            // Close all
            procedureCards.forEach(c => c.classList.remove('active'));

            // Toggle current
            if (!isActive) {
                card.classList.add('active');
            }
        });
    });


    // ========== SCROLL REVEAL (AOS) ==========
    const aosElements = document.querySelectorAll('[data-aos]');

    const revealOnScroll = () => {
        aosElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            if (rect.top < windowHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    };

    window.addEventListener('scroll', revealOnScroll, { passive: true });
    window.addEventListener('load', revealOnScroll);
    revealOnScroll();


    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ========== COUNTER ANIMATION (Trust Strip) ==========
    let countersAnimated = false;
    const trustSection = document.querySelector('.trust-strip');

    const animateCounters = () => {
        if (countersAnimated || !trustSection) return;
        const rect = trustSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.9) {
            countersAnimated = true;
            // Simple fade-in for trust items
            const items = trustSection.querySelectorAll('.trust__item');
            items.forEach((item, i) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                item.style.transition = `opacity 0.6s ease ${i * 0.15}s, transform 0.6s ease ${i * 0.15}s`;
                requestAnimationFrame(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                });
            });
        }
    };

    window.addEventListener('scroll', animateCounters, { passive: true });
    animateCounters();

});
