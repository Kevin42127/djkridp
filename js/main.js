document.addEventListener('DOMContentLoaded', () => {
  try {
    const lang = localStorage.getItem('language') || 'de';
    document.documentElement.lang = lang;

    const elements = document.querySelectorAll('[data-language]');
    elements.forEach(element => {
      element.style.opacity = '1';
    });

    // Scroll Reveal Animation
    const observerOptions = {
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, observerOptions);

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));
  } catch (error) {
    console.error('Error in main.js:', error);
  }
});

