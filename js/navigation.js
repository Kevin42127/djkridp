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

  // 處理 logo 點擊
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

  const hash = window.location.hash;
  if (hash) {
    setTimeout(() => {
      smoothScrollTo(hash);
    }, 100);
  }

  // 滾動指示器功能
  if (scrollIndicator) {
    // 點擊滾動到下一個 section
    scrollIndicator.addEventListener('click', () => {
      const nextSection = getNextSection();
      if (nextSection) {
        smoothScrollTo(`#${nextSection.id}`);
      }
    });

    // 滾動時隱藏指示器
    function handleScrollIndicatorVisibility() {
      const scrollPosition = window.pageYOffset;
      const windowHeight = window.innerHeight;
      
      // 當滾動超過第一個視窗高度時隱藏指示器
      if (scrollPosition > windowHeight * 0.5) {
        scrollIndicator.style.opacity = '0';
        scrollIndicator.style.pointerEvents = 'none';
      } else {
        scrollIndicator.style.opacity = '1';
        scrollIndicator.style.pointerEvents = 'auto';
      }

      // 檢查是否到達最後一個 section
      const sections = document.querySelectorAll('section[id]');
      if (sections.length > 0) {
        const lastSection = sections[sections.length - 1];
        const lastSectionTop = lastSection.offsetTop;
        const scrollBottom = scrollPosition + windowHeight;
        
        // 接近最後一個 section 時隱藏指示器
        if (scrollBottom >= lastSectionTop - 200) {
          scrollIndicator.style.opacity = '0';
          scrollIndicator.style.pointerEvents = 'none';
        }
      }
    }

    // 節流處理滾動事件
    const throttledHandleScrollIndicator = throttle(handleScrollIndicatorVisibility, 100);
    window.addEventListener('scroll', throttledHandleScrollIndicator, { passive: true });
    
    // 初始化檢查
    handleScrollIndicatorVisibility();
  }

});
