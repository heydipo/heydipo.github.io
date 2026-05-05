const smoothLinks = document.querySelectorAll('a[href^="#"]');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
const trackableButtonSelector = 'button, a.primary-btn, a.ghost-btn';

const trackButtonClick = (meta) => {
  if (typeof window.gtag !== 'function') return;
  window.gtag('event', 'button_click', meta);
};

const normalizeClasses = (element) => Array.from(element.classList).join(' ').trim();

const getDestinationUrl = (element) => {
  if (element.tagName === 'A') {
    const href = element.getAttribute('href');
    if (!href) return '';
    try {
      return new URL(href, window.location.href).href;
    } catch (error) {
      return href;
    }
  }

  const onclickValue = element.getAttribute('onclick') || '';
  const match = onclickValue.match(/window\.location(?:\.href)?\s*=\s*['"]([^'"]+)['"]/i);
  if (!match) return '';

  try {
    return new URL(match[1], window.location.href).href;
  } catch (error) {
    return match[1];
  }
};

const getInteractionKind = (element, destinationUrl) => {
  if (element.matches('[type="submit"], .submit-btn')) return 'form_submit';
  if (element.id === 'prevTestimonial' || element.id === 'nextTestimonial' || element.closest('.carousel-controls')) {
    return 'carousel_control';
  }
  if (element.classList.contains('nav-toggle')) return 'ui_toggle';
  if (element.tagName === 'A' || destinationUrl) return 'navigation';
  return 'other';
};

document.addEventListener('click', (event) => {
  if (!event.isTrusted) return;
  if (!(event.target instanceof Element)) return;

  const clickedButton = event.target.closest(trackableButtonSelector);
  if (!clickedButton) return;

  const destinationUrl = getDestinationUrl(clickedButton);
  const buttonText = (clickedButton.dataset.trackLabel || clickedButton.textContent || clickedButton.getAttribute('aria-label') || '')
    .replace(/\s+/g, ' ')
    .trim();
  const section = clickedButton.closest('section[id], header[id], footer[id], main[id]');

  trackButtonClick({
    button_text: buttonText,
    button_id: clickedButton.id || '',
    button_classes: normalizeClasses(clickedButton),
    button_type: clickedButton.tagName === 'A' ? 'link_button' : 'button',
    section: section?.id || 'unknown',
    destination_url: destinationUrl,
    interaction_kind: getInteractionKind(clickedButton, destinationUrl)
  });
});

smoothLinks.forEach(link => {
  link.addEventListener('click', event => {
    const targetId = link.getAttribute('href');
    if (targetId.length > 1) {
      event.preventDefault();
      if (targetId === '#top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
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
    // Guard: if index went out of range (transitionend missed while off-screen), reset
    if (currentIndex > totalSlides + 1 || currentIndex < 0) {
      track.style.transition = 'none';
      currentIndex = 1;
      updateCarousel();
      void track.offsetHeight;
      track.style.transition = 'transform 0.6s ease';
      return;
    }
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

if (contactForm) {
  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = contactForm.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://usebasin.com/f/53960b8e9ba6', {
        method: 'POST',
        body: formData
      });

      formFeedback.textContent = 'Message sent successfully! I\'ll get back to you within 48 hours.';
      formFeedback.classList.remove('error');
      formFeedback.classList.add('success');
      contactForm.reset();
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    } catch (error) {
      formFeedback.textContent = 'Oops! Something went wrong. Please try again.';
      formFeedback.classList.remove('success');
      formFeedback.classList.add('error');
      submitBtn.textContent = originalText;
      submitBtn.disabled = false;
    }

    // Clear feedback message after 5 seconds
    setTimeout(() => {
      formFeedback.classList.remove('success', 'error');
    }, 5000);
  });
}

// Organic Water Surface — underwater caustic waves
(function () {
  var canvas = document.getElementById('heroWaves');
  if (!canvas) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var hero = document.querySelector('.hero');
  var width, height;
  var time = 0;
  var mouse = { x: -1000, y: -1000 };
  var isVisible = true;
  var ripples = [];
  var WAVE_COUNT = 12;
  var STEP = 4; // pixel step for smooth curves

  function resize() {
    width = canvas.width = hero.offsetWidth;
    height = canvas.height = hero.offsetHeight;
  }

  function addRipple(x, y) {
    ripples.push({ x: x, y: y, t: 0 });
    if (ripples.length > 4) ripples.shift();
  }

  // Multi-layered organic displacement
  function wave(px, py, t) {
    var d = Math.sin(px * 0.006 + t * 0.4) * 18
          + Math.sin(py * 0.008 - t * 0.3) * 12
          + Math.sin(px * 0.012 + py * 0.006 + t * 0.7) * 8
          + Math.sin(px * 0.003 - py * 0.004 + t * 0.15) * 25
          + Math.cos(px * 0.009 + t * 0.5) * Math.sin(py * 0.007 - t * 0.35) * 10;

    // Mouse disturbance — soft radial push
    var dx = px - mouse.x, dy = py - mouse.y;
    var dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 250) {
      var proximity = 1 - dist / 250;
      d += Math.sin(dist * 0.03 - t * 2.5) * proximity * proximity * 20;
    }

    // Click ripples — concentric rings that expand & fade
    for (var i = 0; i < ripples.length; i++) {
      var r = ripples[i];
      var rx = px - r.x, ry = py - r.y;
      var rd = Math.sqrt(rx * rx + ry * ry);
      var ring = rd - r.t * 200;
      if (Math.abs(ring) < 60) {
        var fade = Math.max(0, 1 - r.t / 2.5);
        d += Math.sin(ring * 0.1) * 18 * fade * Math.exp(-ring * ring / 2000);
      }
    }

    return d;
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Age ripples
    for (var i = ripples.length - 1; i >= 0; i--) {
      ripples[i].t += 0.016;
      if (ripples[i].t > 2.5) ripples.splice(i, 1);
    }

    // --- Flowing wave lines ---
    var waveSpacing = height / (WAVE_COUNT + 1);

    for (var w = 0; w < WAVE_COUNT; w++) {
      var baseY = (w + 1) * waveSpacing;
      // Each wave has slightly different speed/phase offset
      var phase = w * 0.7;
      var depthFactor = (w + 1) / WAVE_COUNT; // deeper waves = brighter

      ctx.beginPath();
      for (var px = 0; px <= width; px += STEP) {
        var d = wave(px + phase * 40, baseY, time + phase * 0.3);
        var y = baseY + d;
        if (px === 0) ctx.moveTo(px, y);
        else ctx.lineTo(px, y);
      }

      // Gradient opacity — waves toward bottom are brighter (closer to surface light)
      var alpha = 0.03 + depthFactor * 0.07;
      ctx.strokeStyle = 'rgba(138,211,255,' + alpha + ')';
      ctx.lineWidth = 1 + depthFactor * 0.8;
      ctx.stroke();

      // Second pass — thin bright highlight offset slightly above
      ctx.beginPath();
      for (var px2 = 0; px2 <= width; px2 += STEP) {
        var d2 = wave(px2 + phase * 40, baseY, time + phase * 0.3);
        var y2 = baseY + d2 - 2;
        if (px2 === 0) ctx.moveTo(px2, y2);
        else ctx.lineTo(px2, y2);
      }
      ctx.strokeStyle = 'rgba(181,241,255,' + (alpha * 0.5) + ')';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // --- Caustic light patches ---
    // Soft glowing spots that shift with the wave pattern
    for (var cy = 0; cy < height; cy += 80) {
      for (var cx = 0; cx < width; cx += 80) {
        var noiseVal = Math.sin(cx * 0.008 + time * 0.5) *
                       Math.cos(cy * 0.006 - time * 0.3) *
                       Math.sin((cx + cy) * 0.005 + time * 0.8);

        // Only show positive peaks as light patches
        if (noiseVal > 0.2) {
          var intensity = (noiseVal - 0.2) / 0.8;
          var size = 30 + intensity * 50;
          var wobbleX = Math.sin(cy * 0.01 + time * 0.6) * 15;
          var wobbleY = Math.cos(cx * 0.01 + time * 0.4) * 15;

          var grad = ctx.createRadialGradient(
            cx + wobbleX, cy + wobbleY, 0,
            cx + wobbleX, cy + wobbleY, size
          );
          grad.addColorStop(0, 'rgba(138,211,255,' + (intensity * 0.06) + ')');
          grad.addColorStop(1, 'rgba(138,211,255,0)');
          ctx.fillStyle = grad;
          ctx.fillRect(cx + wobbleX - size, cy + wobbleY - size, size * 2, size * 2);
        }
      }
    }

    time += 0.016;
  }

  function animate() {
    if (isVisible) draw();
    requestAnimationFrame(animate);
  }

  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(hero);

  hero.addEventListener('mousemove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  });

  hero.addEventListener('click', function (e) {
    if (e.target.closest('a, button')) return;
    var rect = canvas.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top);
  });

  hero.addEventListener('touchmove', function (e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x = e.touches[0].clientX - rect.left;
    mouse.y = e.touches[0].clientY - rect.top;
  }, { passive: true });
  hero.addEventListener('touchend', function () {
    mouse.x = -1000;
    mouse.y = -1000;
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  animate();
})();

// Underwater Caustics overlay on hero-visual image
(function () {
  var canvas = document.getElementById('heroCaustics');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var ctx = canvas.getContext('2d');
  var visual = document.querySelector('.hero-visual');
  var width, height;
  var time = 0;
  var mouse = { x: 0.5, y: 0.5 }; // normalized 0-1
  var isVisible = true;

  function resize() {
    width = canvas.width = visual.offsetWidth;
    height = canvas.height = visual.offsetHeight;
  }

  // Simplex-like noise using layered sine for caustic patterns
  function caustic(x, y, t, mx, my) {
    // Shift pattern origin toward mouse
    var ox = mx * 60;
    var oy = my * 60;
    var v = 0;
    v += Math.sin(x * 0.015 + t * 0.4 + ox * 0.003);
    v += Math.sin(y * 0.012 - t * 0.35 + oy * 0.003);
    v += Math.sin((x + y) * 0.01 + t * 0.6);
    v += Math.sin(Math.sqrt(x * x + y * y) * 0.008 - t * 0.25);
    v += Math.sin(x * 0.02 - y * 0.015 + t * 0.55) * 0.7;
    v += Math.cos(x * 0.009 + y * 0.011 + t * 0.7) * 0.5;
    return v;
  }

  function draw() {
    var imgData = ctx.createImageData(width, height);
    var data = imgData.data;

    // Use a coarser step and fill blocks for performance
    var step = 4;
    var mx = mouse.x, my = mouse.y;

    for (var py = 0; py < height; py += step) {
      for (var px = 0; px < width; px += step) {
        var v = caustic(px, py, time, mx, my);

        // Sharpen caustic lines — use abs and power curve
        var bright = Math.pow(Math.abs(v) / 3.5, 3);
        bright = Math.min(bright, 1);

        // Color: light blue-cyan caustic
        var r = Math.round(138 * bright);
        var g = Math.round(220 * bright);
        var b = Math.round(255 * bright);
        var a = Math.round(bright * 180);

        // Fill the step x step block
        for (var dy = 0; dy < step && py + dy < height; dy++) {
          for (var dx = 0; dx < step && px + dx < width; dx++) {
            var idx = ((py + dy) * width + (px + dx)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = a;
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    time += 0.02;
  }

  var lastFrame = 0;
  var FRAME_INTERVAL = 1000 / 30; // 30fps cap

  function animate(timestamp) {
    if (isVisible && timestamp - lastFrame >= FRAME_INTERVAL) {
      draw();
      lastFrame = timestamp;
    }
    requestAnimationFrame(animate);
  }

  var observer = new IntersectionObserver(function (entries) {
    isVisible = entries[0].isIntersecting;
  }, { threshold: 0 });
  observer.observe(visual);

  visual.addEventListener('mousemove', function (e) {
    var rect = visual.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width;
    mouse.y = (e.clientY - rect.top) / rect.height;
  });
  visual.addEventListener('mouseleave', function () {
    mouse.x = 0.5;
    mouse.y = 0.5;
  });

  visual.addEventListener('touchmove', function (e) {
    var rect = visual.getBoundingClientRect();
    mouse.x = (e.touches[0].clientX - rect.left) / rect.width;
    mouse.y = (e.touches[0].clientY - rect.top) / rect.height;
  }, { passive: true });

  window.addEventListener('resize', resize);
  resize();
  animate();
})();