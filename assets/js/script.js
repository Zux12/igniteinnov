(function(){
  // Mobile menu toggle + a11y
  const menuBtn = document.getElementById('menuToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  if(menuBtn && mobileMenu){
    menuBtn.addEventListener('click', ()=>{
      const open = mobileMenu.classList.toggle('show');
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Simple slider with dots + autoplay
  const slider = document.querySelector('.slider');
  if(slider){
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const dotsWrap = slider.querySelector('.dots') || (() => {
      const d = document.createElement('div'); d.className='dots';
      slider.querySelector('.slider-controls')?.appendChild(d); return d;
    })();
    const prev = slider.querySelector('.prev') || (() => {
      const b = document.createElement('button'); b.className='prev'; b.innerText='‹';
      slider.querySelector('.slider-controls')?.prepend(b); return b;
    })();
    const next = slider.querySelector('.next') || (() => {
      const b = document.createElement('button'); b.className='next'; b.innerText='›';
      slider.querySelector('.slider-controls')?.append(b); return b;
    })();

    let idx = 0, timer = null;

    // build dots
    slides.forEach((_, i)=>{
      const b = document.createElement('button');
      if(i===0) b.classList.add('active');
      b.addEventListener('click', ()=>go(i,true));
      dotsWrap.appendChild(b);
    });
    const dots = Array.from(dotsWrap.children);

    function go(i, user=false){
      slides[idx].classList.remove('active');
      dots[idx].classList.remove('active');
      idx = (i+slides.length)%slides.length;
      slides[idx].classList.add('active');
      dots[idx].classList.add('active');
      if(user) restart();
    }
    function nextFn(){ go(idx+1); }
    function restart(){
      if(timer) clearInterval(timer);
      const period = parseInt(slider.getAttribute('data-autoplay')||'0',10);
      if(period>0) timer = setInterval(nextFn, period);
    }

    prev.addEventListener('click', ()=>go(idx-1,true));
    next.addEventListener('click', ()=>go(idx+1,true));
    restart();
  }

  // Contact form -> mailto (email-only phase)
  const form = document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const message = document.getElementById('message').value.trim();
      if(!name || !email || !message){ alert('Please fill in all fields.'); return; }
      const subject = encodeURIComponent('Website Inquiry — IgniteInnov');
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:info@igniteinnov.com?subject=${subject}&body=${body}`;
    });
  }

  // “Show more” for large project lists
  function setupShowMore(sectionId, visibleCount){
    const wrap = document.querySelector(sectionId);
    if(!wrap) return;
    const cards = Array.from(wrap.querySelectorAll('.card'));
    if(cards.length <= visibleCount) return;
    cards.forEach((c,i)=>{ if(i>=visibleCount) c.style.display='none'; });
    const btn = document.createElement('button');
    btn.className = 'btn ghost';
    btn.textContent = 'Show more';
    btn.style.marginTop = '16px';
    btn.addEventListener('click', ()=>{
      const hidden = cards.filter(c=>c.style.display==='none');
      hidden.splice(0, visibleCount).forEach(c=>c.style.display='block');
      if(hidden.length<=visibleCount) btn.remove();
    });
    wrap.appendChild(btn);
  }

  setupShowMore('#completed-projects', 6);
  setupShowMore('#ongoing-projects', 9);
})();
