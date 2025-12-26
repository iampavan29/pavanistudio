document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const header = document.querySelector('.main-header');

    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/') || window.location.pathname === '';

    const updateHeader = () => {
        if (window.scrollY > 50 || !isHomePage) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Run on load

    // Mobile Menu Toggle
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links li a');

    if (menuBtn) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active'); // You might want to style this active state
            navLinks.classList.toggle('active');

            // Toggle icon
            const icon = menuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Close mobile menu when clicking a link
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                menuBtn.querySelector('i').classList.remove('fa-times');
                menuBtn.querySelector('i').classList.add('fa-bars');
            }
        });
    });

    // Timeline Scroll Logic
    const timeline = document.querySelector('.timeline');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');

    if (timeline && timelineProgress) {
        window.addEventListener('scroll', () => {
            const timelineRect = timeline.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Calculate how much of the timeline is scrolled
            // Start filling when the top of timeline reaches middle of screen
            // Finish when bottom reaches middle
            const startPoint = windowHeight / 2;
            const scrollDistance = startPoint - timelineRect.top;
            const timelineHeight = timelineRect.height;

            let progress = (scrollDistance / timelineHeight) * 100;
            progress = Math.min(Math.max(progress, 0), 100);

            timelineProgress.style.height = `${progress}%`;

            // Active Nodes & Reveal Items
            timelineItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                if (itemRect.top < windowHeight * 0.8) {
                    item.classList.add('visible');

                    // Activate dot/node if progress has reached it
                    if (itemRect.top < windowHeight / 2) {
                        item.classList.add('node-active');
                    } else {
                        item.classList.remove('node-active');
                    }
                }
            });
        });
    }

    // Intersection Observer for Fade-in Animations (General)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter-number');
    let hasAnimatedCounters = false;

    const statsSection = document.querySelector('.stats-section');

    if (statsSection) {
        const counterObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimatedCounters) {
                hasAnimatedCounters = true;
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-target'));
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current).toLocaleString('en-US');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target.toLocaleString('en-US') + '+';
                        }
                    };
                    updateCounter();
                });
            }
        }, { threshold: 0.5 });

        counterObserver.observe(statsSection);
    }

    // Simple Testimonial Slider (Auto-play)
    // For a real production app, use Swiper.js or Slick
    // This is a placeholder logic for now
    let currentSlide = 0;
    // const slides = document.querySelectorAll('.testimonial-slide');
    // if (slides.length > 1) {
    //     setInterval(() => {
    //         slides[currentSlide].style.display = 'none';
    //         currentSlide = (currentSlide + 1) % slides.length;
    //         slides[currentSlide].style.display = 'block';
    //     }, 5000);
    // }
});
