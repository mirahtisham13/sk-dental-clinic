/* ============================
   SK Dental & Cosmetic Clinic
   Main JavaScript
   ============================ */

document.addEventListener('DOMContentLoaded', () => {

    // ========== THEME TOGGLE ==========
    const themeToggle = document.getElementById('themeToggle');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Check local storage for theme preference
    const currentTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
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



});
