/* SK Dental & Cosmetic Clinic — Main JavaScript */

document.addEventListener('DOMContentLoaded', () => {

    const header = document.getElementById('header');
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileMenuClose = document.getElementById('mobileMenuClose');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const lightboxClose = document.getElementById('lightboxClose');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');

    // Theme toggle (dark default, persists in localStorage)
    const applyTheme = (theme) => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('sk-theme', theme);
    };

    const toggleTheme = () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        applyTheme(current === 'dark' ? 'light' : 'dark');
    };

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    if (themeToggleMobile) themeToggleMobile.addEventListener('click', toggleTheme);

    // Header scroll shadow
    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile menu toggle
    const setMenuOpen = (open) => {
        mobileMenu.classList.toggle('open', open);
        hamburger.classList.toggle('active', open);
        hamburger.setAttribute('aria-expanded', String(open));
        mobileMenu.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            setMenuOpen(!mobileMenu.classList.contains('open'));
        });
    }

    if (mobileMenuClose) {
        mobileMenuClose.addEventListener('click', () => setMenuOpen(false));
    }

    if (mobileMenu) {
        mobileMenu.querySelectorAll('.mobile-menu__link, .mobile-menu__cta').forEach(link => {
            link.addEventListener('click', () => setMenuOpen(false));
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (mobileMenu.classList.contains('open')) setMenuOpen(false);
            if (lightbox?.classList.contains('open')) closeLightbox();
        }
    });

    // Active nav highlighting
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav__link, .mobile-menu__link');

    const highlightNav = () => {
        const scrollPos = window.scrollY + 120;
        let currentId = 'home';

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            if (scrollPos >= top && scrollPos < top + height) {
                currentId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            link.classList.toggle('active', href === `#${currentId}`);
        });
    };

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

    // FAQ accordion
    const faqItems = document.querySelectorAll('.faq__item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq__question');
        if (!btn) return;

        btn.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            faqItems.forEach(i => {
                i.classList.remove('active');
                const q = i.querySelector('.faq__question');
                if (q) q.setAttribute('aria-expanded', 'false');
            });

            if (!isActive) {
                item.classList.add('active');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // Gallery lightbox
    const galleryItems = document.querySelectorAll('.gallery__item[data-full]');
    let lastFocused = null;

    const openLightbox = (src, alt) => {
        lastFocused = document.activeElement;
        lightboxImg.src = src;
        lightboxImg.alt = alt || 'Clinic photo';
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lightboxClose.focus();
    };

    const closeLightbox = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
        if (lastFocused) lastFocused.focus();
    };

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const src = item.getAttribute('data-full');
            const img = item.querySelector('img');
            openLightbox(src, img?.alt || '');
        });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });
    }

    // Scroll reveal
    const aosElements = document.querySelectorAll('[data-aos]');

    if (prefersReducedMotion) {
        aosElements.forEach(el => el.classList.add('visible'));
    } else {
        const revealOnScroll = () => {
            aosElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.92) {
                    el.classList.add('visible');
                }
            });
        };

        window.addEventListener('scroll', revealOnScroll, { passive: true });
        window.addEventListener('load', revealOnScroll);
        revealOnScroll();
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth',
                    block: 'start'
                });
            }
        });
    });

});
