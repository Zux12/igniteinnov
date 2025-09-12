(function(){
// Mobile menu toggle
const menuBtn = document.getElementById('menuToggle');
const mobileMenu = document.getElementById('mobileMenu');
if(menuBtn && mobileMenu){
menuBtn.addEventListener('click', ()=>{
const open = mobileMenu.hasAttribute('hidden') === false;
if(open){ mobileMenu.setAttribute('hidden',''); menuBtn.setAttribute('aria-expanded','false'); }
else { mobileMenu.removeAttribute('hidden'); menuBtn.setAttribute('aria-expanded','true'); }
});
}

// Simple slider
const slider = document.querySelector('.slider');
if(slider){
const slides = Array.from(slider.querySelectorAll('.slide'));
const dotsWrap = slider.querySelector('.dots');
const prev = slider.querySelector('.prev');
const next = slider.querySelector('.next');
let idx = 0;

// build dots
slides.forEach((_, i)=>{
const b = document.createElement('button');
if(i===0) b.classList.add('active');
b.addEventListener('click', ()=>go(i));
dotsWrap.appendChild(b);
});
const dots = Array.from(dotsWrap.children);

function go(i){
slides[idx].classList.remove('active');
dots[idx].classList.remove('active');
idx = (i+slides.length)%slides.length;
slides[idx].classList.add('active');
dots[idx].classList.add('active');
}
prev.addEventListener('click', ()=>go(idx-1));
next.addEventListener('click', ()=>go(idx+1));

// autoplay
const period = parseInt(slider.getAttribute('data-autoplay')||'0',10);
if(period>0){ setInterval(()=>go(idx+1), period); }
}

// Contact form -> mailto
const form = document.getElementById('contactForm');
if(form){
form.addEventListener('submit', (e)=>{
e.preventDefault();
const name = document.getElementById('name').value.trim();
})();
