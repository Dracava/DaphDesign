'use strict';

console.log('🎉 NEW SCRIPT VERSION 2.0 LOADED! 🎉'); // Debug log
console.log('Script.js loaded successfully'); // Debug log

// Simple click test - REMOVED to prevent conflicts with new modal system

// element toggle function
const elementToggleFunc = function (elem) { elem.classList.toggle("active"); }

// sidebar variables
const sidebar = document.querySelector("[data-sidebar]");
const sidebarBtn = document.querySelector("[data-sidebar-btn]");

// sidebar toggle functionality for mobile
sidebarBtn.addEventListener("click", function () { elementToggleFunc(sidebar); });

// custom select variables
const select = document.querySelector("[data-select]");
const selectItems = document.querySelectorAll("[data-select-item]");
const selectValue = document.querySelector("[data-select-value]");
const filterBtn = document.querySelectorAll("[data-filter-btn]");

select?.addEventListener("click", function () { elementToggleFunc(this); });

// add event in all select items
for (let i = 0; i < selectItems.length; i++) {
  selectItems[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    elementToggleFunc(select);
    filterFunc(selectedValue);
  });
}

// filter variables
const filterItems = document.querySelectorAll("[data-filter-item]");

const filterFunc = function (selectedValue) {
  for (let i = 0; i < filterItems.length; i++) {
    if (selectedValue === "all") {
      filterItems[i].classList.add("active");
    } else if (selectedValue === filterItems[i].dataset.category) {
      filterItems[i].classList.add("active");
    } else {
      filterItems[i].classList.remove("active");
    }
  }
}

// add event in all filter button items for large screen
let lastClickedBtn = filterBtn[0];

for (let i = 0; i < filterBtn.length; i++) {
  filterBtn[i].addEventListener("click", function () {
    let selectedValue = this.innerText.toLowerCase();
    selectValue.innerText = this.innerText;
    filterFunc(selectedValue);

    lastClickedBtn.classList.remove("active");
    this.classList.add("active");
    lastClickedBtn = this;
  });
}

// contact form variables
const form = document.querySelector("[data-form]");
const formInputs = document.querySelectorAll("[data-form-input]");
const formBtn = document.querySelector("[data-form-btn]");

// add event to all form input field
for (let i = 0; i < formInputs.length; i++) {
  formInputs[i].addEventListener("input", function () {
    // check form validation
    if (form.checkValidity()) {
      formBtn.removeAttribute("disabled");
    } else {
      formBtn.setAttribute("disabled", "");
    }
  });
}

// page navigation variables
const navigationLinks = document.querySelectorAll("[data-nav-link]");
const pages = document.querySelectorAll("[data-page]");

// --- Lazy load section resources (images/iframes/videos) ---
function deferSectionResources(sectionEl) {
  if (!sectionEl || sectionEl.dataset.deferred === 'true') return;
  const mediaSelectors = 'img, iframe, video, source';
  sectionEl.querySelectorAll(mediaSelectors).forEach(node => {
    // Skip if already handled or explicitly marked keep-src
    if (node.dataset.keepSrc === 'true') return;
    if (node.hasAttribute('src')) {
      node.dataset.src = node.getAttribute('src');
      node.removeAttribute('src');
    }
    if (node.hasAttribute('srcset')) {
      node.dataset.srcset = node.getAttribute('srcset');
      node.removeAttribute('srcset');
    }
    if (!node.hasAttribute('loading') && node.tagName.toLowerCase() === 'iframe') {
      node.setAttribute('loading', 'lazy');
    }
  });
  sectionEl.dataset.deferred = 'true';
}

function loadSectionResources(sectionEl) {
  if (!sectionEl) return;
  const mediaSelectors = 'img, iframe, video, source';
  sectionEl.querySelectorAll(mediaSelectors).forEach(node => {
    if (node.dataset.src && !node.hasAttribute('src')) {
      node.setAttribute('src', node.dataset.src);
    }
    if (node.dataset.srcset && !node.hasAttribute('srcset')) {
      node.setAttribute('srcset', node.dataset.srcset);
    }
  });
}

// On initial load: defer non-active sections
document.addEventListener('DOMContentLoaded', () => {
  pages.forEach(page => {
    const isActive = page.classList.contains('active');
    if (!isActive && page.dataset.page !== 'contact') {
      deferSectionResources(page);
    } else {
      loadSectionResources(page);
    }
  });
});

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        // Load resources for the activated section on demand
        loadSectionResources(pages[j]);
        if (pages[j].dataset.page === 'contact') {
          // Make sure reCAPTCHA becomes visible and renders
          try { ensureRecaptcha && ensureRecaptcha(); } catch (_) {}
        }
        window.scrollTo(0, 0);
      } else {
        // Defer resources of sections that become inactive (only once)
        if (!pages[j].classList.contains('active') && pages[j].dataset.page !== 'contact') {
          deferSectionResources(pages[j]);
        }
        pages[j].classList.remove("active");
        navigationLinks[j].classList.remove("active");
      }
    }
  });
}

// Slideshow functionality
let slideIndex = 1;
showSlides(slideIndex);

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let slides = document.getElementsByClassName("slides");
  let dots = document.getElementsByClassName("dot");
  
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (let i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// Auto advance slides
setInterval(function() {
  slideIndex++;
  showSlides(slideIndex);
}, 5000);

// Preload slideshow images
function preloadImages() {
  const images = [
    './assets/images/waterpolo.jpg',
    './assets/images/programming.jpg',
    './assets/images/video.jpg',
    './assets/images/animalrights.jpg'
  ];
  
  images.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

window.addEventListener('load', preloadImages);

// Portfolio system now uses dedicated pages - no JavaScript needed!
console.log('🎯 Portfolio system using dedicated pages - no JavaScript required!');

// Contact tabs selection with deselect and Other support
(function() {
  const tabsContainer = document.querySelector('.contact-tabs');
  const tabs = document.querySelectorAll('.contact-tab');
  const hidden = document.getElementById('selected-service');
  const otherWrapper = document.getElementById('other-service-wrapper');
  const otherInput = document.getElementById('other-service-input');
  if (!hidden) return;

  function setOtherVisible(visible) {
    if (!otherWrapper) return;
    otherWrapper.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  function onTabClick(tab) {
      const isActive = tab.classList.contains('active');

      // Deselect if already active
      if (isActive) {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
        hidden.value = '';
        setOtherVisible(false);
        return;
      }

      // Select clicked tab, deselect others
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const service = tab.getAttribute('data-service') || '';
      hidden.value = service;

      // Show other text input when 'Other' is selected
      if (tab.hasAttribute('data-other')) {
        setOtherVisible(true);
        otherInput && otherInput.focus();
      } else {
        setOtherVisible(false);
      }
  }

  // Prefer event delegation to avoid losing handlers due to DOM changes
  if (tabsContainer) {
    tabsContainer.addEventListener('click', (e) => {
      const target = e.target.closest('.contact-tab');
      if (target) {
        e.preventDefault();
        onTabClick(target);
      }
    });
  } else {
    // Fallback: attach to existing tabs
    tabs.forEach(tab => {
      tab.addEventListener('click', () => onTabClick(tab));
    });
  }

  // Global delegation as ultimate fallback
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.contact-tab');
    if (t) {
      onTabClick(t);
    }
  });

  // Sync hidden field with Other text when typing and Other tab selected
  if (otherInput) {
    otherInput.addEventListener('input', () => {
      const activeOther = document.querySelector('.contact-tab[data-other].active');
      if (activeOther) {
        hidden.value = otherInput.value.trim();
      }
    });
  }
})();

// Contact form submit → Netlify Function
(function() {
  const form = document.querySelector('article.contact form.form');
  if (!form) return;

  // Show and (re)render reCAPTCHA when the contact page becomes active or message focused
  const messageInput = form.querySelector('#message');
  const recaptchaWrapper = document.getElementById('recaptcha-wrapper');

  // Load reCAPTCHA script if missing, then render
  function loadRecaptchaScript(callback) {
    if (typeof grecaptcha !== 'undefined') { callback && callback(); return; }
    if (document.getElementById('recaptcha-api')) { window.__onGreReady = callback; return; }
    const s = document.createElement('script');
    s.id = 'recaptcha-api';
    s.src = 'https://www.google.com/recaptcha/api.js?onload=__onGreReady&render=explicit';
    window.__onGreReady = function() { callback && callback(); };
    document.head.appendChild(s);
  }

  function ensureRecaptcha() {
    if (!recaptchaWrapper) return;
    recaptchaWrapper.setAttribute('aria-hidden', 'false');
    const container = recaptchaWrapper.querySelector('.g-recaptcha');
    const render = () => {
      if (typeof grecaptcha !== 'undefined' && container && !container.querySelector('iframe')) {
        grecaptcha.render(container, { 'sitekey': '6LfzfbsrAAAAAKg9xDZ2_jSiVNA-QSrvTzE1Eu3q' });
      }
    };
    // If not yet available, load then render
    if (typeof grecaptcha === 'undefined') {
      loadRecaptchaScript(render);
    } else {
      render();
    }
  }

  if (messageInput && recaptchaWrapper) {
    messageInput.addEventListener('focus', ensureRecaptcha);
  }

  // Also ensure recaptcha when navigating to contact section
  document.addEventListener('click', (e) => {
    const nav = e.target.closest('[data-nav-link]');
    if (nav && nav.innerHTML.toLowerCase().includes('contact')) {
      if (!window.DISABLE_AUTO_RECAPTCHA) setTimeout(ensureRecaptcha, 0);
    }
  });

  // Also ensure on initial load if Contact is the active page (e.g., direct visit)
  const contactArticle = document.querySelector('article.contact');
  if (contactArticle && contactArticle.classList.contains('active')) {
    if (!window.DISABLE_AUTO_RECAPTCHA) ensureRecaptcha();
  }

  // Add honeypot field (hidden) to trap bots
  const honeypot = document.createElement('input');
  honeypot.type = 'text';
  honeypot.name = 'website';
  honeypot.style.display = 'none';
  form.appendChild(honeypot);

  const submitBtn = form.querySelector('.form-btn');
  const inputs = form.querySelectorAll('[data-form-input], textarea.form-input');

  function setLoading(loading) {
    if (!submitBtn) return;
    submitBtn.disabled = loading;
    submitBtn.dataset.loading = loading ? 'true' : 'false';
  }

  function serializeForm() {
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());
    return payload;
  }

  function showNotification(message, type = 'info') {
    const container = document.getElementById('form-notifications');
    if (!container) return;

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    // Get appropriate icon based on type
    let icon = 'ℹ️';
    switch (type) {
      case 'warning':
        icon = '⚠️';
        break;
      case 'error':
        icon = '🚫';
        break;
      case 'success':
        icon = '✅';
        break;
      default:
        icon = 'ℹ️';
    }

    notification.innerHTML = `
      <span class="notification-icon">${icon}</span>
      <span class="notification-message">${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">×</button>
    `;

    container.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  }

  function clearNotifications() {
    const container = document.getElementById('form-notifications');
    if (container) {
      container.innerHTML = '';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure reCAPTCHA v2 is solved (only if it's visible)
    const recaptchaWrapper = document.getElementById('recaptcha-wrapper');
    if (recaptchaWrapper && recaptchaWrapper.getAttribute('aria-hidden') === 'false') {
      const widget = document.querySelector('.g-recaptcha');
      if (widget && typeof grecaptcha !== 'undefined') {
        const token = grecaptcha.getResponse();
        if (!token) {
          showNotification('Please complete the reCAPTCHA', 'warning');
          return;
        }
      }
    }

    setLoading(true);

    try {
      const payload = serializeForm();
      // Attach reCAPTCHA token if present and reCAPTCHA is visible
      if (typeof grecaptcha !== 'undefined' && recaptchaWrapper && recaptchaWrapper.getAttribute('aria-hidden') === 'false') {
        payload.recaptcha = grecaptcha.getResponse();
      }

      const endpoint = (typeof window !== 'undefined' && window.CONTACT_ENDPOINT)
        ? window.CONTACT_ENDPOINT
        : '/.netlify/functions/contact';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to send');

      form.reset();
      if (typeof grecaptcha !== 'undefined') {
        grecaptcha.reset();
      }
      const serviceHidden = document.getElementById('selected-service');
      if (serviceHidden) serviceHidden.value = '';
      const activeTab = document.querySelector('.contact-tab.active');
      if (activeTab) activeTab.classList.remove('active');
      clearNotifications();
      showNotification('Message sent successfully!', 'success');
    } catch (err) {
      showNotification('Could not send message. Please try again later.', 'error');
    } finally {
      setLoading(false);
    }
  });
})();
