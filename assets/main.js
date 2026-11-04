(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  $('#year').textContent = new Date().getFullYear();

  /* Header shadow on scroll */
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 8);
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Mobile menu */
  const menuBtn = $('#menuBtn'), nav = $('#siteNav');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    menuBtn.setAttribute('aria-expanded', open);
    menuBtn.textContent = open ? 'Close' : 'Menu';
  };
  menuBtn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  $$('#siteNav a').forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* Barefoot Walk route: one tick per day (17 days) */
  const ticks = $('.route-ticks');
  const NS = 'http://www.w3.org/2000/svg';
  for (let d = 0; d < 17; d++) {
    const x = 16 + (488 / 16) * d;
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', x); l.setAttribute('x2', x); l.setAttribute('y1', 46); l.setAttribute('y2', 66);
    ticks.appendChild(l);
  }

  /* Scroll reveal + route draw */
  const reveals = $$('.reveal');
  const route = $('.walk-route');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      if (e.target.contains(route)) route.classList.add('animate');
      io.unobserve(e.target);
    }), { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach((el, i) => { el.style.transitionDelay = (i % 3) * 80 + 'ms'; io.observe(el); });
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* Photo filter */
  const figures = $$('.photo-grid figure');
  $$('.filters button').forEach(btn => btn.addEventListener('click', () => {
    $$('.filters button').forEach(b => b.classList.remove('is-active'));
    btn.classList.add('is-active');
    const f = btn.dataset.filter;
    figures.forEach(fig => { fig.hidden = f !== 'all' && fig.dataset.cat !== f; });
  }));

  /* Lightbox */
  const lb = $('#lightbox'), lbImg = $('img', lb), lbCap = $('figcaption', lb);
  let current = 0;
  const visible = () => figures.filter(f => !f.hidden);
  const show = i => {
    const list = visible();
    current = (i + list.length) % list.length;
    const fig = list[current];
    lbImg.src = $('a', fig).href;
    lbImg.alt = $('img', fig).alt;
    lbCap.textContent = $('figcaption', fig).textContent;
  };
  figures.forEach(fig => $('a', fig).addEventListener('click', e => {
    e.preventDefault();
    show(visible().indexOf(fig));
    lb.hidden = false;
    $('.lb-close', lb).focus();
  }));
  const close = () => { lb.hidden = true; };
  $('.lb-close').addEventListener('click', close);
  $('.lb-prev').addEventListener('click', () => show(current - 1));
  $('.lb-next').addEventListener('click', () => show(current + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  /* Contact form: validates on the page. Connect to a form service or WordPress endpoint before launch. */
  const form = $('#contactForm'), status = $('#formStatus');
  form.addEventListener('submit', e => {
    e.preventDefault();
    let ok = true;
    $$('[required]', form).forEach(el => {
      const bad = !el.value.trim() || (el.type === 'email' && !/^\S+@\S+\.\S+$/.test(el.value));
      el.classList.toggle('invalid', bad);
      if (bad) ok = false;
    });
    if (!ok) { status.textContent = 'Please add your name, a valid email and a message.'; return; }
    status.textContent = 'Thank you. Your enquiry has been received.';
    form.reset();
  });
})();
