document.addEventListener('DOMContentLoaded', () => {
  const scrollProgressBar = document.getElementById('scroll-progress-bar');
  
  if (!scrollProgressBar) return;

  let ticking = false;

  const updateScrollProgress = () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollProgress = (scrollTop / scrollHeight) * 100;
    
    scrollProgressBar.style.width = `${Math.min(scrollProgress, 100)}%`;
    ticking = false;
  };

  const requestTick = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateScrollProgress);
      ticking = true;
    }
  };

  window.addEventListener('scroll', requestTick, { passive: true });
  
  updateScrollProgress();
});
