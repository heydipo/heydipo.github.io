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

const firstClone = slides[0].cloneNode(true);
const lastClone = slides[slides.length - 1].cloneNode(true);
firstClone.classList.add('clone');
lastClone.classList.add('clone');
track.appendChild(firstClone);
track.prepend(lastClone);

const totalSlides = slides.length;
let currentIndex = 1;

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
    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.6s ease';
    });
  }

  if (currentIndex === totalSlides + 1) {
    track.style.transition = 'none';
    currentIndex = 1;
    updateCarousel();
    requestAnimationFrame(() => {
      track.style.transition = 'transform 0.6s ease';
    });
  }
});

setInterval(() => {
  currentIndex += 1;
  updateCarousel();
}, 7000);

// Optional parallax floating effect
const heroVisual = document.querySelector('.hero-visual');
window.addEventListener('scroll', () => {
  const offset = window.scrollY * 0.15;
  heroVisual.style.transform = `translateY(${offset}px)`;
});
