document.addEventListener('DOMContentLoaded', () => {
  try {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

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

    // Loading Animation
    const loadingOverlay = document.getElementById('loading-overlay');
    const progressBar = document.getElementById('progress-bar');
    const progressText = document.getElementById('progress-text');
    
    if (loadingOverlay && progressBar && progressText) {
      let progress = 0;
      const totalDuration = 5000; // 5 seconds total
      const updateInterval = 30; // Update every 30ms
      const increment = 100 / (totalDuration / updateInterval);
      
      const progressInterval = setInterval(() => {
        progress += increment;
        
        if (progress >= 100) {
          progress = 100;
          clearInterval(progressInterval);
          
          // Hide loading overlay after reaching 100%
          setTimeout(() => {
            loadingOverlay.classList.add('hidden');
          }, 500);
        }
        
        progressBar.style.width = progress + '%';
        progressText.textContent = Math.round(progress) + '%';
      }, updateInterval);
      
      // Also hide when window loads (fallback)
      window.addEventListener('load', () => {
        setTimeout(() => {
          progress = 100;
          progressBar.style.width = '100%';
          progressText.textContent = '100%';
          clearInterval(progressInterval);
          
          setTimeout(() => {
            loadingOverlay.classList.add('hidden');
          }, 500);
        }, 500);
      });
    }
  } catch (error) {
    console.error('Error in main.js:', error);
  }
});

