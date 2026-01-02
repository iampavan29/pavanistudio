// Global variable for Intersection Observer
let observer;

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

    observer = new IntersectionObserver((entries) => {
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

    // Contact Form Handler (WhatsApp Redirection)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // Construct the WhatsApp message
            const whatsappMessage = `Hello Pavani Studios,%0A%0AI would like to enquire about *${service}*.%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Phone:* ${phone}%0A*Message:* ${message}`;

            // Target WhatsApp Number (from footer link)
            const phoneNumber = '918341847112';

            // Open WhatsApp
            const whatsappURL = `https://wa.me/${phoneNumber}?text=${whatsappMessage}`;
            window.open(whatsappURL, '_blank');

            // Optional: Reset form or show success message on page
            contactForm.reset();
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
                    "engagement": ["images/portfolio-item-5.jpg", "images/portfolio-item-11.jpg", "images/portfolio-item-12.jpg", "images/portfolio-item-7.jpg"],
                    "pre-wedding": ["images/portfolio-item-3.jpg", "images/portfolio-user-2.jpg", "images/portfolio-item-4.jpg", "images/client-anita-rohan.png"],
                    "sangeet": ["images/portfolio-item-9.jpg", "images/portfolio-user-1.jpg", "images/recent-1.jpg"],
                    "marriage": ["images/portfolio-user-1.jpg", "images/portfolio-item-5.jpg", "images/portfolio-item-8.jpg", "images/client-sita-ram.png"],
                    "reception": ["images/portfolio-item-8.jpg", "images/portfolio-item-10.jpg", "images/recent-2.jpg"],
                    "highlights": ["images/portfolio-user-1.jpg", "images/portfolio-item-12.jpg", "images/hero-bg.jpg"],
                    "videos": [] // Video placeholders to be added
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
            },
            "anniversary-70": {
                title: "70th Wedding Anniversary",
                category: "Event Photography",
                tabs: {
                    "father-mother-70-years": [
                        "images/70th-anniversary/221A1912.jpg", "images/70th-anniversary/221A1926.jpg", "images/70th-anniversary/221A1946.jpg", "images/70th-anniversary/221A1955.jpg", "images/70th-anniversary/221A1961.jpg",
                        "images/70th-anniversary/221A1965.jpg", "images/70th-anniversary/221A1968.jpg", "images/70th-anniversary/221A2011.jpg", "images/70th-anniversary/221A2024.jpg", "images/70th-anniversary/221A2119.jpg",
                        "images/70th-anniversary/221A2134.jpg", "images/70th-anniversary/221A2140.jpg", "images/70th-anniversary/221A2141.jpg", "images/70th-anniversary/NNK04293.jpg", "images/70th-anniversary/NNK04297.jpg",
                        "images/70th-anniversary/NNK04304%202.jpg", "images/70th-anniversary/NNK04304.jpg", "images/70th-anniversary/NNK04317%202.jpg", "images/70th-anniversary/NNK04317.jpg", "images/70th-anniversary/NNK04331%202.jpg",
                        "images/70th-anniversary/NNK04331.jpg", "images/70th-anniversary/NNK04357%202.jpg", "images/70th-anniversary/NNK04357.jpg", "images/70th-anniversary/NNK04359.jpg", "images/70th-anniversary/NNK04365.jpg"
                    ],
                    "sons-and-grandchildren": [
                        "images/70th-anniversary/221A2181.jpg", "images/70th-anniversary/221A2194.jpg", "images/70th-anniversary/221A2196.jpg", "images/70th-anniversary/221A2241.jpg", "images/70th-anniversary/221A2242.jpg",
                        "images/70th-anniversary/221A2245.jpg", "images/70th-anniversary/221A2264.jpg", "images/70th-anniversary/221A2274.jpg", "images/70th-anniversary/NNK04392.jpg", "images/70th-anniversary/NNK04399.jpg",
                        "images/70th-anniversary/NNK04403.jpg", "images/70th-anniversary/NNK04416.jpg", "images/70th-anniversary/NNK04474.jpg", "images/70th-anniversary/NNK04478.jpg", "images/70th-anniversary/NNK04480.jpg",
                        "images/70th-anniversary/NNK04484.jpg", "images/70th-anniversary/NNK04518.jpg", "images/70th-anniversary/NNK04530.jpg", "images/70th-anniversary/NNK04542.jpg", "images/70th-anniversary/NNK04551.jpg"
                    ],
                    "sons-photoshoot": [
                        "images/70th-anniversary/221A2359.jpg", "images/70th-anniversary/221A2383.jpg", "images/70th-anniversary/221A2389.jpg", "images/70th-anniversary/NNK04561.jpg", "images/70th-anniversary/NNK04579.jpg",
                        "images/70th-anniversary/NNK04601.jpg", "images/70th-anniversary/NNK04602.jpg", "images/70th-anniversary/NNK04621.jpg", "images/70th-anniversary/NNK04623.jpg", "images/70th-anniversary/NNK04638.jpg",
                        "images/70th-anniversary/NNK04639.jpg", "images/70th-anniversary/NNK04651.jpg", "images/70th-anniversary/NNK04658.jpg"
                    ]
                }
            }
        };

        const currentProject = portfolioData[projectId];

        if (currentProject) {
            // Set Title & Category
            projectTitle.innerHTML = `${currentProject.title}`;
            document.getElementById('project-category').innerText = currentProject.category;

            // Tab Switching Logic
            const tabsContainer = document.querySelector('.portfolio-tabs');
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

                // Add fade-in observation for new items
                const fadeElements = galleryContainer.querySelectorAll('.fade-in');
                fadeElements.forEach(el => observer.observe(el));
            }

            // Generate Tabs Dynamically
            if (tabsContainer) {
                tabsContainer.innerHTML = '';
                Object.keys(currentProject.tabs).forEach((tabKey, index) => {
                    const btn = document.createElement('button');
                    btn.className = `tab-btn ${index === 0 ? 'active' : ''}`;
                    btn.dataset.tab = tabKey;

                    // Format tab label: father-mother-70-years -> Father & Mother (70 Years)
                    let label = tabKey;
                    if (tabKey === 'father-mother-70-years') label = 'Father & Mother (70 Years)';
                    else if (tabKey === 'sons-and-grandchildren') label = 'Sons & Grandchildren';
                    else if (tabKey === 'sons-photoshoot') label = "Sons' Photoshoot";
                    else label = tabKey.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

                    btn.innerText = label;

                    btn.addEventListener('click', () => {
                        document.querySelectorAll('.tab-btn').forEach(t => t.classList.remove('active'));
                        btn.classList.add('active');
                        loadGallery(tabKey);
                    });

                    tabsContainer.appendChild(btn);
                });
            }

            // Initial Load
            const firstTab = Object.keys(currentProject.tabs)[0];
            if (firstTab) loadGallery(firstTab);

        } else {
            // Fallback if ID not found
            if (projectTitle) projectTitle.innerText = "Project Not Found";
        }
    }
});
