'use strict';

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

// Portfolio Modal Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all modal triggers
  const modalTriggers = document.querySelectorAll('.modal-trigger');
  const modals = document.querySelectorAll('.portfolio-modal');
  const closeButtons = document.querySelectorAll('.close-modal');

  // Function to open modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
  }

  // Function to close modal
  function closeModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore background scrolling
  }

  // Add click event listeners to modal triggers
  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute('data-modal');
      openModal(modalId);
    });
  });

  // Add click event listeners to close buttons
  closeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.portfolio-modal');
      closeModal(modal);
    });
  });

  // Close modal when clicking outside the modal content
  modals.forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Close modal when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modals.forEach(modal => {
        if (modal.classList.contains('active')) {
          closeModal(modal);
        }
      });
    }
  });
});

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

  function showToast(msg, ok = true) {
    let el = document.getElementById('contact-toast');
    if (!el) {
      el = document.createElement('div');
      el.id = 'contact-toast';
      el.style.position = 'fixed';
      el.style.bottom = '24px';
      el.style.right = '24px';
      el.style.zIndex = '9999';
      el.style.padding = '12px 16px';
      el.style.borderRadius = '10px';
      el.style.boxShadow = '0 12px 28px rgba(0,0,0,0.35)';
      el.style.fontSize = '14px';
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.background = ok ? 'hsl(140, 65%, 35%)' : 'hsl(0, 60%, 40%)';
    el.style.color = 'white';
    el.style.opacity = '0.95';
    setTimeout(() => { el.style.opacity = '0'; }, 3000);
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ensure reCAPTCHA v2 is solved
    const widget = document.querySelector('.g-recaptcha');
    if (widget && typeof grecaptcha !== 'undefined') {
      const token = grecaptcha.getResponse();
      if (!token) {
        showToast('Please complete the reCAPTCHA', false);
        return;
      }
    }

    setLoading(true);

    try {
      const payload = serializeForm();
      // Attach reCAPTCHA token if present
      if (typeof grecaptcha !== 'undefined') {
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
      showToast('Message sent successfully');
    } catch (err) {
      showToast('Could not send message. Please try again later.', false);
    } finally {
      setLoading(false);
    }
  });
})();
