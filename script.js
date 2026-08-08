const header = document.getElementById('siteHeader');
const progress = document.getElementById('scrollProgress');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  const height = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = `${(window.scrollY / height) * 100}%`;
});

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// My Story slideshow — automatically changes every 2.5 seconds.
(() => {
  const slideshow = document.querySelector('.story-slideshow');
  if (!slideshow) return;

  const slides = [...slideshow.querySelectorAll('.story-slide')];
  const dots = [...slideshow.querySelectorAll('.story-slide-dots span')];
  if (slides.length < 2) return;

  let current = 0;
  let timer;

  const showSlide = (next) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = next;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };

  const start = () => {
    clearInterval(timer);
    timer = setInterval(() => showSlide((current + 1) % slides.length), 2500);
  };

  // Preload the remaining photos so transitions stay smooth.
  slides.slice(1).forEach(slide => {
    const img = new Image();
    img.src = slide.src;
  });

  start();

  // Save battery while the tab is not visible, then resume at the same speed.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else start();
  });
})();
