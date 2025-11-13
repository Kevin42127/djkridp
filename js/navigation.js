document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const navOverlay = document.querySelector('.nav-overlay');

  function smoothScrollTo(targetId) {
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      const headerHeight = header ? header.offsetHeight : 0;
      const targetPosition = targetElement.offsetTop - headerHeight;
      window.scrollTo({
        top: Math.max(0, targetPosition),
        behavior: 'smooth'
      });
    }
  }

  function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function openMenu() {
    const overlayOffset = header ? header.offsetHeight : 0;
    nav.classList.remove('hidden');
    nav.classList.add('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.add('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    if (navOverlay) {
      navOverlay.classList.add('active');
      navOverlay.style.top = `${overlayOffset}px`;
      navOverlay.style.left = '0';
      navOverlay.style.right = '0';
      navOverlay.style.bottom = '0';
      navOverlay.style.height = `calc(100vh - ${overlayOffset}px)`;
    }
    document.body.style.overflow = 'hidden';
  }

  function closeMenu({ restoreFocus } = { restoreFocus: false }) {
    nav.classList.remove('active');
    nav.classList.add('hidden');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      if (restoreFocus) {
        mobileMenuToggle.focus();
      }
    }
    if (navOverlay) {
      navOverlay.classList.remove('active');
      navOverlay.style.top = '';
      navOverlay.style.height = '';
      navOverlay.style.left = '';
      navOverlay.style.right = '';
      navOverlay.style.bottom = '';
    }
    document.body.style.overflow = '';
  }

  function isMobileMenuActive() {
    return nav && nav.classList.contains('active') && window.innerWidth <= 768;
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
        if (isMobileMenuActive()) {
          closeMenu();
        }
      }
    });
  });

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const isActive = isMobileMenuActive();
      if (isActive) {
        closeMenu();
      } else {
        openMenu();
      }
    });
  }

  if (navOverlay) {
    navOverlay.addEventListener('click', () => {
      if (isMobileMenuActive()) {
        closeMenu();
      }
    });
  }

  document.addEventListener('click', (event) => {
    if (!isMobileMenuActive()) return;
    const clickInsideNav = nav.contains(event.target);
    const clickToggle = mobileMenuToggle && mobileMenuToggle.contains(event.target);
    if (!clickInsideNav && !clickToggle) {
      closeMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && isMobileMenuActive()) {
      closeMenu({ restoreFocus: true });
    }
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && nav) {
      nav.classList.remove('active', 'hidden');
      if (navOverlay) {
        navOverlay.classList.remove('active');
        navOverlay.style.top = '';
        navOverlay.style.height = '';
        navOverlay.style.left = '';
        navOverlay.style.right = '';
        navOverlay.style.bottom = '';
      }
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
      }
      document.body.style.overflow = '';
    }
  });


  const scrollUpButton = document.getElementById('scroll-up');
  if (scrollUpButton) {
    function toggleScrollUp() {
      if (window.pageYOffset > 300) {
        scrollUpButton.classList.add('_show-scroll');
      } else {
        scrollUpButton.classList.remove('_show-scroll');
      }
    }

    window.addEventListener('scroll', toggleScrollUp, { passive: true });
    toggleScrollUp();

    scrollUpButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      smoothScrollTo(hash);
    }, 100);
  }

});
