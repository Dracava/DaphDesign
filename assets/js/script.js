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

// add event to all nav link
for (let i = 0; i < navigationLinks.length; i++) {
  navigationLinks[i].addEventListener("click", function () {
    for (let j = 0; j < pages.length; j++) {
      if (this.innerHTML.toLowerCase() === pages[j].dataset.page) {
        pages[j].classList.add("active");
        navigationLinks[i].classList.add("active");
        window.scrollTo(0, 0);
      } else {
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

// Super Simple Portfolio Toggle System
console.log('🎯 Simple Portfolio Toggle System Loaded!');

// Simple toggle function
function toggleDetails(button) {
  console.log('🔄 Toggling details for button:', button);
  
  const details = button.previousElementSibling;
  const isHidden = details.style.display === 'none' || details.style.display === '';
  
  if (isHidden) {
    details.style.display = 'block';
    button.textContent = 'Hide Details';
    console.log('✅ Details shown');
  } else {
    details.style.display = 'none';
    button.textContent = 'Show Details';
    console.log('✅ Details hidden');
  }
}

// Contact tabs selection with deselect and Other support
(function() {
  const tabs = document.querySelectorAll('.contact-tab');
  const hidden = document.getElementById('selected-service');
  const otherWrapper = document.getElementById('other-service-wrapper');
  const otherInput = document.getElementById('other-service-input');
  if (!tabs.length || !hidden) return;

  function setOtherVisible(visible) {
    if (!otherWrapper) return;
    otherWrapper.setAttribute('aria-hidden', visible ? 'false' : 'true');
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
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
    });
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

  // Show reCAPTCHA when user clicks on message input
  const messageInput = form.querySelector('#message');
  const recaptchaWrapper = document.getElementById('recaptcha-wrapper');
  
  if (messageInput && recaptchaWrapper) {
    messageInput.addEventListener('focus', function() {
      recaptchaWrapper.setAttribute('aria-hidden', 'false');
      
      // Render reCAPTCHA if not already rendered
      if (typeof grecaptcha !== 'undefined' && !document.querySelector('.g-recaptcha iframe')) {
        grecaptcha.render(recaptchaWrapper.querySelector('.g-recaptcha'), {
          'sitekey': '6LfzfbsrAAAAAKg9xDZ2_jSiVNA-QSrvTzE1Eu3q'
        });
      }
    });
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

      const res = await fetch('/.netlify/functions/contact', {
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
