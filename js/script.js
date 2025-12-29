document.addEventListener('DOMContentLoaded', () => {
    // Navigation Scroll Effect
    const header = document.querySelector('.main-header');

    const path = window.location.pathname;
    const isHomePage = path === '/' || path === '/index' || path.endsWith('/index.html') || path === '';

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

    // Testimonial Slider Logic
    let currentTestimonial = 0;
    const testimonials = document.querySelectorAll('.testimonial-slide');

    // Function to show a specific testimonial
    window.showTestimonial = (n) => {
        if (testimonials.length === 0) return;

        // Wrap around logic
        if (n >= testimonials.length) currentTestimonial = 0;
        else if (n < 0) currentTestimonial = testimonials.length - 1;
        else currentTestimonial = n;

        // Hide all
        testimonials.forEach(slide => {
            slide.classList.remove('active');
        });

        // Show current
        testimonials[currentTestimonial].classList.add('active');
    };

    // Global function for buttons
    window.changeTestimonial = (direction) => {
        showTestimonial(currentTestimonial + direction);
    };

    // Initialize the first one
    if (testimonials.length > 0) {
        showTestimonial(0);
    }
});

// Photo Slideshow Logic
let currentSlideIndex = 0;
let autoplayInterval;
let isAutoplayRunning = true;

function showSlide(n) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length === 0) return;

    if (n >= slides.length) currentSlideIndex = 0;
    else if (n < 0) currentSlideIndex = slides.length - 1;
    else currentSlideIndex = n;

    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    slides[currentSlideIndex].classList.add('active');
    if (dots.length > 0) dots[currentSlideIndex].classList.add('active');
}

function changeSlide(direction) {
    showSlide(currentSlideIndex + direction);
    stopAutoplay(); // Stop on manual interaction
}

function goToSlide(n) {
    showSlide(n);
    stopAutoplay(); // Stop on manual interaction
}

function startAutoplay() {
    if (document.querySelectorAll('.slide').length === 0) return;

    autoplayInterval = setInterval(() => {
        showSlide(currentSlideIndex + 1);
    }, 4000);
    isAutoplayRunning = true;
    const toggleBtn = document.querySelector('.autoplay-toggle');
    if (toggleBtn) toggleBtn.textContent = '⏸ Pause Autoplay';
}

function stopAutoplay() {
    clearInterval(autoplayInterval);
    isAutoplayRunning = false;
    const toggleBtn = document.querySelector('.autoplay-toggle');
    if (toggleBtn) toggleBtn.textContent = '▶ Start Autoplay';
}

function toggleAutoplay() {
    if (isAutoplayRunning) {
        stopAutoplay();
    } else {
        startAutoplay();
    }
}

// Initialize on page load if elements exist
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.slideshow-container')) {
        startAutoplay();
    }

    // Contact Form Handler (EmailJS)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Sending...';
            submitBtn.disabled = true;

            // These IDs from your EmailJS dashboard
            const serviceID = 'YOUR_SERVICE_ID';
            const templateID = 'YOUR_TEMPLATE_ID';

            // Parameters to match your EmailJS template
            const templateParams = {
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                service: document.getElementById('service').value,
                message: document.getElementById('message').value,
                to_name: 'Pavani Studios',
            };

            emailjs.send(serviceID, templateID, templateParams)
                .then(() => {
                    submitBtn.innerText = 'Message Sent!';
                    alert('Thank you! Your message has been sent successfully. We will get back to you soon.');
                    contactForm.reset();
                    setTimeout(() => {
                        submitBtn.innerText = originalBtnText;
                        submitBtn.disabled = false;
                    }, 3000);
                }, (err) => {
                    submitBtn.innerText = originalBtnText;
                    submitBtn.disabled = false;
                    alert('Failed to send message. Please check your internet connection or try again later.\nError: ' + JSON.stringify(err));
                    console.error('EmailJS Error:', err);
                });
        });
    }


    // ==========================================
    // Portfolio Case Study Logic
    // ==========================================
    const projectTitle = document.getElementById('project-title');
    if (projectTitle) {
        // We are on portfolio-details.html
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = urlParams.get('id');

        // Mock Data (Replace with real image paths later)
        const portfolioData = {
            "ajay-sweety": {
                title: "Ajay weds Sweety",
                category: "Wedding Photography",
                tabs: {
                    "engagement": ["images/portfolio-item-5.jpg", "images/portfolio-item-7.jpg", "images/portfolio-item-8.jpg"],
                    "pre-wedding": ["images/portfolio-item-3.jpg", "images/portfolio-user-2.jpg", "images/portfolio-item-4.jpg"],
                    "sangeet": ["images/portfolio-item-9.jpg", "images/portfolio-user-1.jpg"],
                    "marriage": ["images/portfolio-user-1.jpg", "images/portfolio-item-5.jpg", "images/portfolio-item-7.jpg"],
                    "reception": ["images/portfolio-item-8.jpg", "images/portfolio-item-9.jpg"],
                    "highlights": ["images/portfolio-user-1.jpg", "images/portfolio-user-2.jpg"],
                    "videos": [] // Video placeholders if needed
                }
            },
            "rohan-meera": {
                title: "Rohan & Meera",
                category: "Pre-Wedding Shoot",
                tabs: {
                    "engagement": [],
                    "pre-wedding": ["images/portfolio-item-3.jpg", "images/portfolio-item-4.jpg"],
                    "sangeet": [],
                    "marriage": [],
                    "reception": [],
                    "highlights": ["images/portfolio-item-3.jpg"],
                    "videos": []
                }
            }
            // Add other cases as needed
        };

        const currentProject = portfolioData[projectId];

        if (currentProject) {
            // Set Title & Category
            projectTitle.innerHTML = `${currentProject.title}`;
            document.getElementById('project-category').innerText = currentProject.category;

            // Tab Switching Logic
            const tabs = document.querySelectorAll('.tab-btn');
            const galleryContainer = document.getElementById('gallery-container');

            function loadGallery(tabName) {
                galleryContainer.innerHTML = ''; // Clear existing
                const images = currentProject.tabs[tabName] || [];

                if (images.length === 0) {
                    galleryContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: #777;">No images available for this section.</p>';
                    return;
                }

                images.forEach(imgSrc => {
                    const div = document.createElement('div');
                    div.className = 'gallery-item fade-in';
                    div.innerHTML = `<img src="${imgSrc}" alt="${tabName} image">`;
                    galleryContainer.appendChild(div);
                });
            }

            // Initial Load
            loadGallery('engagement');

            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    // Remove active class
                    tabs.forEach(t => t.classList.remove('active'));
                    // Add active class
                    tab.classList.add('active');
                    // Load content
                    loadGallery(tab.dataset.tab);
                });
            });

        } else {
            // Fallback if ID not found
            if (projectTitle) projectTitle.innerText = "Project Not Found";
        }
    }
});
