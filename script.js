const navbar = document.getElementById('navbar');
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const backTop = document.getElementById('backTop');
const slides = [...document.querySelectorAll('.slide')];
const dotsWrap = document.getElementById('sliderDots');
let currentSlide = 0;
let slideTimer;

menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  menuToggle.textContent = open ? '✕' : '☰';
});

document.querySelectorAll('.nav-links a').forEach(link => link.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.textContent = '☰';
}));

slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.setAttribute('aria-label', `Show slide ${index + 1}`);
  dot.addEventListener('click', () => showSlide(index, true));
  dotsWrap.appendChild(dot);
});
const dots = [...dotsWrap.children];

function showSlide(index, restart = false){
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (index + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
  if(restart){ clearInterval(slideTimer); startSlider(); }
}
function startSlider(){ slideTimer = setInterval(() => showSlide(currentSlide + 1), 5000); }
dots[0].classList.add('active');
startSlider();

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting){ entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  });
}, {threshold: .12});
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 24);
  backTop.classList.toggle('show', window.scrollY > 650);
});
backTop.addEventListener('click', () => window.scrollTo({top:0, behavior:'smooth'}));

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxClose = document.getElementById('lightboxClose');
document.querySelectorAll('.gallery-item').forEach(item => {
  item.addEventListener('click', () => {
    lightboxImage.src = item.dataset.src;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  });
});
function closeLightbox(){
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', e => { if(e.target === lightbox) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeLightbox(); });

document.getElementById('year').textContent = new Date().getFullYear();

// Small 3D tilt effect on desktop devices.
if (window.matchMedia('(pointer:fine)').matches) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(900px) rotateY(${x*7}deg) rotateX(${-y*7}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => card.style.transform = '');
  });
}
