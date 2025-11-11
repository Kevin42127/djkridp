document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('.nav-link');
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.nav');
  const header = document.querySelector('.header');
  const headerHeight = header ? header.offsetHeight : 0;

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


  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        smoothScrollTo(href);
        
        if (nav && window.innerWidth <= 768) {
          nav.classList.remove('active');
          nav.classList.add('hidden');
          if (mobileMenuToggle) {
            mobileMenuToggle.classList.remove('active');
            mobileMenuToggle.setAttribute('aria-expanded', 'false');
          }
          document.body.style.overflow = '';
        }
      }
    });
  });

  if (mobileMenuToggle && nav) {
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const isActive = nav.classList.contains('active');
      
      if (isActive) {
        nav.classList.remove('active');
        nav.classList.add('hidden');
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      } else {
        nav.classList.remove('hidden');
        nav.classList.add('active');
        mobileMenuToggle.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('active') && window.innerWidth <= 768) {
      nav.classList.remove('active');
      nav.classList.add('hidden');
      if (mobileMenuToggle) {
        mobileMenuToggle.classList.remove('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenuToggle.focus();
      }
      document.body.style.overflow = '';
    }
  });
  
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      nav.classList.remove('active', 'hidden');
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
