document.addEventListener('DOMContentLoaded', () => {
    // 1. Navbar Toggle for Mobile
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Close navbar when a link is clicked (for mobile)
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) { // Only close on smaller screens
                navLinks.classList.remove('active');
            }
        });
    });


    // 2. Smooth Scrolling for Navigation Links
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });


    // 3. Theme Toggle (Dark/Light Mode)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    } else {
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
    }

    themeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        if (body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
    });

    // 4. Typing Effect for Hero Section
    const rotatingTextElement = document.getElementById('rotating-text');
    const phrases = ["real-world problems.", "complex challenges.", "future needs.", "innovative solutions."];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 150; // Milliseconds per character

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            rotatingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            rotatingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 1000; // Pause at end of typing
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 150; // Speed up before next phrase
        }

        const delay = isDeleting ? typingSpeed / 2 : typingSpeed; // Faster deleting
        setTimeout(typeWriter, delay);
    }
    typeWriter(); // Start the typing effect


    // 5. Scroll Reveal Animations (using Intersection Observer)
    const scrollRevealElements = document.querySelectorAll('.scroll-reveal');

    const observerOptions = {
        threshold: 0.15 // When 15% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    scrollRevealElements.forEach(el => {
        observer.observe(el);
    });

    // 6. Contact Form Submission (using Fetch API for Formspree)
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitButton = document.getElementById('submit-button');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent default form submission

            submitButton.disabled = true;
            submitButton.textContent = 'Sending...';
            formStatus.textContent = '';
            formStatus.className = 'form-status-message'; // Reset class

            const formData = new FormData(contactForm);

            try {
                const response = await fetch(contactForm.action, {
                    method: contactForm.method,
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully! I will get back to you soon.';
                    formStatus.classList.add('success');
                    contactForm.reset(); // Clear the form
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        formStatus.textContent = data.errors.map(err => err.message).join(', ');
                    } else {
                        formStatus.textContent = 'Oops! There was a problem sending your message.';
                    }
                    formStatus.classList.add('error');
                }
            } catch (error) {
                formStatus.textContent = 'Network error. Please try again later.';
                formStatus.classList.add('error');
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Send Message';
            }
        });
    }

    // 7. Dynamically update current year in footer
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }


    // 8. Active Navbar Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLi = document.querySelectorAll('.nav-links li a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Adjust offset for fixed navbar
            if (scrollY >= sectionTop - 70) { // 70px is roughly navbar height
                current = section.getAttribute('id');
            }
        });

        navLi.forEach(li => {
            li.classList.remove('active');
            if (li.getAttribute('href') && li.getAttribute('href').includes(current)) {
                li.classList.add('active');
            }
        });
    });

    // Set initial active link for "Home" if at the top
    if (window.scrollY < document.getElementById('about').offsetTop - 70) {
        document.querySelector('.nav-links li a[href="#home"]').classList.add('active');
    } else {
         // Fallback for when page loads already scrolled down
        const firstVisibleSection = Array.from(sections).find(sec => {
            const rect = sec.getBoundingClientRect();
            return rect.top <= 70 && rect.bottom >= 70; // Is section top visible or crossing the top boundary
        });

        if (firstVisibleSection) {
            document.querySelector(`.nav-links li a[href="#${firstVisibleSection.id}"]`).classList.add('active');
        }
    }
});
