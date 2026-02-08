const smoothLinks = document.querySelectorAll('a[href^="#"]');
const modal = document.getElementById('contactModal');
const openButtons = [document.getElementById('openModal'), document.getElementById('openModalHero')];
const closeBackdrop = document.getElementById('closeModal');
const closeBtn = document.getElementById('closeModalBtn');
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

openButtons.forEach(btn => {
  if (!btn) return;
  btn.addEventListener('click', () => {
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
  });
});

[closeBackdrop, closeBtn].forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modal.classList.contains('active')) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  }
});

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.testimonial'));
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentIndex = 0;

const updateCarousel = () => {
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
};

prevBtn.addEventListener('click', () => {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  updateCarousel();
});

nextBtn.addEventListener('click', () => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
});

setInterval(() => {
  currentIndex = (currentIndex + 1) % slides.length;
  updateCarousel();
}, 7000);

// Optional parallax floating effect
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('scroll', () => {
  const offset = window.scrollY * 0.15;
  heroVisual.style.transform = `translateY(${offset}px)`;
});
