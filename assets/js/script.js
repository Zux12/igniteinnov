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
    if(slides.length){
      let controls = slider.querySelector('.slider-controls');
      if(!controls){
        controls = document.createElement('div');
        controls.className = 'slider-controls';
        slider.appendChild(controls);
      }
      let prev = controls.querySelector('.prev');
      let next = controls.querySelector('.next');
      let dotsWrap = controls.querySelector('.dots');

      if(!prev){ prev = document.createElement('button'); prev.className='prev'; prev.textContent='‹'; controls.prepend(prev); }
      if(!next){ next = document.createElement('button'); next.className='next'; next.textContent='›'; controls.append(next); }
      if(!dotsWrap){ dotsWrap = document.createElement('div'); dotsWrap.className='dots'; controls.append(dotsWrap); }

      const dots = slides.map((_, i)=>{
        const b = document.createElement('button');
        if(i===0) b.classList.add('active');
        b.addEventListener('click', ()=>go(i,true));
        dotsWrap.appendChild(b);
        return b;
      });

      let idx = 0, timer = null;
      function go(i, user=false){
        slides[idx].classList.remove('active');
        dots[idx].classList.remove('active');
        idx = (i + slides.length) % slides.length;
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
  }

  // Contact form -> mailto
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
})();
