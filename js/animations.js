document.addEventListener('DOMContentLoaded', () => {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('_animate');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const sectionTitles = document.querySelectorAll('.section-title');
  sectionTitles.forEach(title => {
    observer.observe(title);
  });

  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    observer.observe(card);
  });

  const countryItems = document.querySelectorAll('.country-item');
  countryItems.forEach(item => {
    observer.observe(item);
  });

  const contactLinks = document.querySelectorAll('.contact-link');
  contactLinks.forEach(link => {
    observer.observe(link);
  });
});

