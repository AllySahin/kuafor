/**
 * Rizz Kuaför — main.js
 * Vanilla JS · No dependencies · ES6+
 */

(function () {
  'use strict';

  /* ============================================================
     1. PAGE LOADER
  ============================================================ */
  const loader = document.getElementById('loader');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      // Remove from DOM after transition
      loader.addEventListener('transitionend', () => loader.remove(), { once: true });
    }, 800);
  });

  /* ============================================================
     2. STICKY HEADER
  ============================================================ */
  const header = document.getElementById('header');

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 50);
    toggleBackToTop();
    highlightNavLink();
  };

  window.addEventListener('scroll', handleScroll, { passive: true });

  /* ============================================================
     3. MOBILE MENU
  ============================================================ */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    hamburger.setAttribute('aria-label', isOpen ? 'Menüyü kapat' : 'Menüyü aç');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close menu on nav link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.setAttribute('aria-label', 'Menüyü aç');
      document.body.style.overflow = '';
    });
  });

  // Close menu on outside click
  document.addEventListener('click', (e) => {
    if (navLinks.classList.contains('open') &&
        !navLinks.contains(e.target) &&
        !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });

  /* ============================================================
     4. SMOOTH SCROLL (anchor links)
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header.offsetHeight;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });

  /* ============================================================
     5. ACTIVE NAV LINK (scroll spy)
  ============================================================ */
  const sections    = document.querySelectorAll('main section[id]');
  const allNavLinks = document.querySelectorAll('.nav-link');

  function highlightNavLink() {
    const scrollPos = window.scrollY + header.offsetHeight + 60;

    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        allNavLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  /* ============================================================
     6. SERVICE TABS
  ============================================================ */
  const tabBtns    = document.querySelectorAll('.tab-btn');
  const tabPanels  = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.target;

      tabBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      tabPanels.forEach(p => {
        p.classList.remove('active');
        p.hidden = true;
      });

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const panel = document.getElementById(target);
      if (panel) {
        panel.classList.add('active');
        panel.hidden = false;
      }
    });
  });

  /* ============================================================
     7. TESTIMONIALS SLIDER
  ============================================================ */
  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('sliderDots');

  if (track) {
    const cards = track.querySelectorAll('.testimonial-card');
    let current = 0;
    let autoSlideTimer;

    // Create dots
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.setAttribute('aria-label', `Yorum ${i + 1}`);
      dot.setAttribute('role', 'tab');
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    });

    function goTo(index) {
      current = (index + cards.length) % cards.length;
      track.style.transform = `translateX(-${current * 100}%)`;
      dotsContainer.querySelectorAll('.dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
        d.setAttribute('aria-selected', String(i === current));
      });
    }

    function next() { goTo(current + 1); }
    function prev() { goTo(current - 1); }

    document.getElementById('nextBtn').addEventListener('click', () => { next(); resetTimer(); });
    document.getElementById('prevBtn').addEventListener('click', () => { prev(); resetTimer(); });

    function startTimer() {
      autoSlideTimer = setInterval(next, 5000);
    }
    function resetTimer() {
      clearInterval(autoSlideTimer);
      startTimer();
    }
    startTimer();

    // Pause on hover
    const wrapper = track.closest('.testimonials-wrapper');
    wrapper.addEventListener('mouseenter', () => clearInterval(autoSlideTimer));
    wrapper.addEventListener('mouseleave', startTimer);

    // Touch/swipe support
    let touchStartX = 0;
    wrapper.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].clientX; }, { passive: true });
    wrapper.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { diff > 0 ? next() : prev(); resetTimer(); }
    }, { passive: true });
  }

  /* ============================================================
     8. FAQ ACCORDION
  ============================================================ */
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const answer = btn.nextElementSibling;

      // Close all others
      document.querySelectorAll('.faq-q').forEach(other => {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          if (other.nextElementSibling) other.nextElementSibling.hidden = true;
        }
      });

      // Toggle current
      btn.setAttribute('aria-expanded', String(!isExpanded));
      answer.hidden = isExpanded;
    });
  });

  /* ============================================================
     9. SCROLL ANIMATIONS (Intersection Observer)
  ============================================================ */
  const animateEls = document.querySelectorAll('[data-animate], [data-animate-right]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // Stagger children of service grids
          const delay = entry.target.dataset.animateDelay || 0;
          setTimeout(() => entry.target.classList.add('visible'), Number(delay));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animateEls.forEach((el, i) => {
      // Stagger grid children
      if (el.classList.contains('service-card') ||
          el.classList.contains('team-card') ||
          el.classList.contains('stat-item')) {
        el.style.transitionDelay = `${(i % 6) * 80}ms`;
      }
      observer.observe(el);
    });
  } else {
    // Fallback: show all immediately
    animateEls.forEach(el => el.classList.add('visible'));
  }

  /* ============================================================
     10. COUNTER ANIMATION
  ============================================================ */
  const statNums = document.querySelectorAll('.stat-num[data-count]');

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => counterObserver.observe(el));
  }

  function animateCounter(el) {
    const target   = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start    = performance.now();

    function update(now) {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased    = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  /* ============================================================
     11. BACK TO TOP
  ============================================================ */
  const backToTop = document.getElementById('backToTop');

  function toggleBackToTop() {
    if (window.scrollY > 400) {
      backToTop.hidden = false;
    } else {
      backToTop.hidden = true;
    }
  }

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ============================================================
     12. CONTACT FORM
  ============================================================ */
  const form = document.getElementById('contactForm');

  if (form) {
    const nameInput  = document.getElementById('cf-name');
    const phoneInput = document.getElementById('cf-phone');
    const successMsg = document.getElementById('formSuccess');

    function showError(input, message) {
      const group = input.closest('.form-group');
      const errEl = group.querySelector('.form-error');
      input.classList.add('error');
      if (errEl) errEl.textContent = message;
    }

    function clearError(input) {
      const group = input.closest('.form-group');
      const errEl = group.querySelector('.form-error');
      input.classList.remove('error');
      if (errEl) errEl.textContent = '';
    }

    // Live validation
    [nameInput, phoneInput].forEach(input => {
      input.addEventListener('input', () => clearError(input));
    });

    const phoneRegex = /^(\+90|0)?[5][0-9]{9}$/;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;
      clearError(nameInput);
      clearError(phoneInput);

      if (!nameInput.value.trim() || nameInput.value.trim().length < 2) {
        showError(nameInput, 'Lütfen adınızı ve soyadınızı girin.');
        valid = false;
      }

      const rawPhone = phoneInput.value.replace(/\s/g, '');
      if (!rawPhone || !phoneRegex.test(rawPhone)) {
        showError(phoneInput, 'Geçerli bir Türkiye telefon numarası girin. (örn: 0532 123 45 67)');
        valid = false;
      }

      if (!valid) return;

      // Simulate form submission (replace with actual backend/Formspree/EmailJS)
      const submitBtn = form.querySelector('[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin" aria-hidden="true"></i> Gönderiliyor...';
      submitBtn.disabled = true;

      // Construct WhatsApp message as fallback
      const name    = encodeURIComponent(nameInput.value.trim());
      const phone   = encodeURIComponent(phoneInput.value.trim());
      const service = encodeURIComponent(document.getElementById('cf-service').value);
      const message = encodeURIComponent(document.getElementById('cf-message').value.trim());
      const waMsg   = `Merhaba%2C%20ben%20${name}.%20Telefon%3A%20${phone}.%20Hizmet%3A%20${service}.%20${message}`;

      setTimeout(() => {
        successMsg.hidden = false;
        form.reset();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Optionally open WhatsApp with pre-filled message
        // window.open(`https://wa.me/905326140015?text=${waMsg}`, '_blank', 'noopener,noreferrer');

        setTimeout(() => { successMsg.hidden = true; }, 6000);
      }, 900);
    });
  }

  /* ============================================================
     13. GALLERY: prevent empty clicks, add subtle tilt on hover
  ============================================================ */
  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('mousemove', (e) => {
      const rect  = item.getBoundingClientRect();
      const x     = (e.clientX - rect.left) / rect.width - 0.5;
      const y     = (e.clientY - rect.top)  / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`;
    });
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });

})();
