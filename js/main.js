document.addEventListener('DOMContentLoaded', () => {
  try {
    const lang = localStorage.getItem('language') || 'de';
    document.documentElement.lang = lang;
    
    const elements = document.querySelectorAll('[data-language]');
    elements.forEach(element => {
      element.style.opacity = '1';
    });

    if ('scrollBehavior' in document.documentElement.style === false) {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/gh/cferdinandi/smooth-scroll@15.0.0/dist/smooth-scroll.polyfills.min.js';
      document.head.appendChild(script);
    }
  } catch (error) {
    console.error('Error in main.js:', error);
  }
});

