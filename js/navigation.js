document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const logo = document.querySelector('.logo');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;
  const navOverlay = document.querySelector('.nav-overlay');
  const scrollIndicator = document.querySelector('.scroll-indicator');

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

  function getNextSection() {
    const sections = document.querySelectorAll('section[id]');
    const currentScroll = window.pageYOffset + headerHeight + 100;
    
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTop = section.offsetTop;
      
      if (sectionTop > currentScroll) {
        return section;
      }
    }
    return null;
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
    nav.classList.remove('hidden');
    nav.classList.add('active');
    if (mobileMenuToggle) {
      mobileMenuToggle.classList.add('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'true');
    }
    if (navOverlay) {
      navOverlay.classList.add('active');
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
    }
    document.body.style.overflow = '';
  }

  function isMobileMenuActive() {
    return nav && nav.classList.contains('active') && window.innerWidth <= 768;
  }

  // Logo-Klick behandeln
  if (logo) {
    logo.addEventListener('click', () => {
      const target = logo.getAttribute('data-target');
      if (target) {
        smoothScrollTo(`#${target}`);
        if (isMobileMenuActive()) {
          closeMenu();
        }
      }
    });
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
    const clickHeader = header && header.contains(event.target);
    if (!clickInsideNav && !clickToggle && !clickHeader) {
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

  // Hash-basiertes Scrollen nur für manuelle Navigation, nicht für Reload
  // Browser-Standardverhalten für Scroll-Restoration beibehalten

  // Scroll-Indikator-Funktion
  if (scrollIndicator) {
    // Klick zum Scrollen zur nächsten Section
    scrollIndicator.addEventListener('click', () => {
      const nextSection = getNextSection();
      if (nextSection) {
        smoothScrollTo(`#${nextSection.id}`);
      }
    });

    // Indikator beim Scrollen ausblenden
    function handleScrollIndicatorVisibility() {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // Indikator ausblenden wenn über erste Fensterhöhe gescrollt
      if (scrollPosition > windowHeight * 0.5) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }

      // Prüfen ob letzte Section erreicht
      const sections = document.querySelectorAll('section[id]');
      if (sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        const lastSectionTop = lastSection.offsetTop;
        const scrollBottom = scrollPosition + windowHeight;
        
        // Indikator ausblenden wenn nahe der letzten Section
        if (scrollBottom >= lastSectionTop - 200) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.pointerEvents = 'none';
        }
      }
    }

    // Scroll-Ereignisse drosseln
    const throttledHandleScrollIndicator = throttle(handleScrollIndicatorVisibility, 100);
    window.addEventListener('scroll', throttledHandleScrollIndicator, { passive: true });
    
    // Initialisierungsprüfung verzögern um Browser-Scroll-Restoration nicht zu stören
    setTimeout(() => {
      handleScrollIndicatorVisibility();
    }, 500);
  }

});
