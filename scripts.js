const smoothLinks = document.querySelectorAll('a[href^="#"]');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

smoothLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (targetId.length > 1) {
      event.preventDefault();
      document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
      if (navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });
});

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.testimonial'));
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
const carousel = document.querySelector('.carousel');

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
firstClone.classList.add('clone');
lastClone.classList.add('clone');
track.appendChild(firstClone);
track.prepend(lastClone);

const totalSlides = slides.length;
let currentIndex = 1;
let autoAdvanceTimer = null;

const updateCarousel = () => {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
};

track.style.transition = 'transform 0.6s ease';
updateCarousel();

prevBtn.addEventListener('click', () => {
  currentIndex -= 1;
  updateCarousel();
});

nextBtn.addEventListener('click', () => {
  currentIndex += 1;
  updateCarousel();
});

track.addEventListener('transitionend', () => {
  if (currentIndex === 0) {
    track.style.transition = 'none';
    currentIndex = totalSlides;
    updateCarousel();
    // Force a reflow before re-enabling transition
    void track.offsetHeight;
    track.style.transition = 'transform 0.6s ease';
  }

  if (currentIndex === totalSlides + 1) {
    track.style.transition = 'none';
    currentIndex = 1;
    updateCarousel();
    // Force a reflow before re-enabling transition
    void track.offsetHeight;
    track.style.transition = 'transform 0.6s ease';
  }
});

const startAutoAdvance = () => {
  if (autoAdvanceTimer) return; // Already running
  autoAdvanceTimer = setInterval(() => {
    currentIndex += 1;
    updateCarousel();
  }, 7000);
};

const stopAutoAdvance = () => {
  if (autoAdvanceTimer) {
    clearInterval(autoAdvanceTimer);
    autoAdvanceTimer = null;
  }
};

// Hover pause/resume functionality
carousel.addEventListener('mouseenter', stopAutoAdvance);
carousel.addEventListener('mouseleave', startAutoAdvance);

// Start the carousel auto-advance on page load
startAutoAdvance();

// Optional parallax floating effect
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('scroll', () => {
  const offset = window.scrollY * 0.15;
  heroVisual.style.transform = `translateY(${offset}px)`;
});

// Basin contact form handling
const contactForm = document.getElementById('contactFormBasin');
const formFeedback = document.getElementById('formFeedback');
const basinToken = '53960b8e9ba6';

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);

    try {
      const response = await fetch(`https://usebasin.com/api/v1/submit/${basinToken}`, {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        formFeedback.textContent = 'Message sent successfully! I\'ll get back to you within 48 hours.';
        formFeedback.classList.remove('error');
        formFeedback.classList.add('success');
        contactForm.reset();
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      formFeedback.textContent = 'Oops! Something went wrong. Please try again.';
      formFeedback.classList.remove('success');
      formFeedback.classList.add('error');
    }

    // Clear feedback message after 5 seconds
    setTimeout(() => {
      formFeedback.classList.remove('success', 'error');
    }, 5000);
  });
}
