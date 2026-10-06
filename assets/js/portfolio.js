/* Portfolio motion + interactions. Language-specific bits come from data attributes in the markup. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const root = document.documentElement;
  const locale = root.dataset.locale || 'en-US';
  const fmt = n => Math.round(n).toLocaleString(locale);
  // words to highlight in the hero title and to tint in the contact heading, per language
  const heroEl = document.getElementById('heroTitle'), ctaEl = document.getElementById('ctaHead');
  const hlRe = new RegExp(heroEl && heroEl.dataset.hl || '$^', 'i');
  const tintA = ctaEl && ctaEl.dataset.tintA, tintB = ctaEl && ctaEl.dataset.tintB;
  const showAll = () => document.querySelectorAll('.will-reveal').forEach(el => el.style.visibility = 'visible');

  /* ---------- copy to clipboard (works without GSAP too) ---------- */
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const text = btn.dataset.copy, label = btn.querySelector('span') || btn, prev = label.textContent;
      const done = ok => {
        label.textContent = ok ? (root.dataset.copied || 'Copied ✓') : text;
        if (hasGSAP && !reduce) gsap.fromTo(btn, { scale: .94 }, { scale: 1, duration: .5, ease: 'back.out(3)' });
        setTimeout(() => { label.textContent = prev; }, 1800);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => done(true), () => done(false));
      else done(false);
    });
  });

  /* ---------- get in touch toggle ---------- */
  const gitBtn = document.getElementById('gitBtn'), card = document.getElementById('contactCard'), closeBtn = document.getElementById('closeCard');
  function openCard() {
    card.classList.add('open'); gitBtn.setAttribute('aria-expanded', 'true');
    if (hasGSAP && !reduce) {
      gsap.timeline()
        .to(gitBtn, { scale: .85, duration: .15, ease: 'power2.in' })
        .to(gitBtn, { scale: 1, rotation: 360, duration: .7, ease: 'back.out(1.7)' })
        .fromTo(card.children, { y: 60, autoAlpha: 0, rotationX: -25, transformPerspective: 800 },
          { y: 0, autoAlpha: 1, rotationX: 0, duration: .8, ease: 'power4.out', stagger: .08 }, .1)
        .add(() => ScrollTrigger.refresh());
    }
    card.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'nearest' });
  }
  function closeCard() {
    const finish = () => { card.classList.remove('open'); gitBtn.setAttribute('aria-expanded', 'false'); gitBtn.focus(); if (hasGSAP) ScrollTrigger.refresh(); };
    if (hasGSAP && !reduce) gsap.to(card.children, { y: 30, autoAlpha: 0, duration: .35, stagger: .05, ease: 'power2.in', onComplete: finish });
    else finish();
  }
  gitBtn.addEventListener('click', () => card.classList.contains('open') ? closeCard() : openCard());
  closeBtn.addEventListener('click', closeCard);

  if (!hasGSAP || reduce) {
    showAll();
    document.querySelectorAll('.count').forEach(el => el.textContent = fmt(+el.dataset.to));
    document.querySelectorAll('.job').forEach(j => j.classList.add('on'));
    document.querySelectorAll('.reveal-mask').forEach(m => m.remove());
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power4.out', duration: 1 });

  /* ---------- text splitting ---------- */
  let heroSplit, headSplits = [];
  function splitHero() {
    heroSplit = new SplitType('#heroTitle', { types: 'lines,words' });
    heroSplit.words.forEach(w => { if (hlRe.test(w.textContent)) w.classList.add('hl'); });
  }
  function tintCta() {
    document.querySelectorAll('#ctaHead .word').forEach(w => {
      if (tintA && w.textContent === tintA) w.style.color = 'var(--blue)';
      if (tintB && w.textContent.startsWith(tintB)) w.style.color = 'var(--cyan)';
    });
  }
  function splitHeads() {
    headSplits = [...document.querySelectorAll('.h2.split')].map(el => new SplitType(el, { types: 'lines,words,chars' }));
    tintCta();
  }

  function init() {
    splitHero(); splitHeads();

    /* ===== SCENE 1 · HERO ===== */
    const q = s => document.querySelector(s);
    gsap.set('.hero .will-reveal', { visibility: 'visible' });
    const hero = gsap.timeline({ delay: .15 });
    hero.from('.eyebrow', { y: 20, autoAlpha: 0, duration: .8 })
      .from('.hero-name', { y: 20, autoAlpha: 0, duration: .8 }, '-=.6')
      .from(heroSplit.words, { yPercent: 115, rotation: 6, transformOrigin: '0% 100%', duration: 1.1, stagger: .08 }, '-=.55')
      .from('.hero-sub', { y: 30, autoAlpha: 0, duration: .9 }, '-=.7')
      .from('.hero-cta .btn', { y: 24, autoAlpha: 0, duration: .8, stagger: .08 }, '-=.7')
      .from('.chips .chip', { y: 16, scale: .8, autoAlpha: 0, duration: .7, stagger: .08, ease: 'back.out(1.7)' }, '-=.6')
      .from('#term', { y: 80, rotationX: 18, rotationY: -12, transformPerspective: 1200, autoAlpha: 0, duration: 1.3 }, .5)
      .from('#term .tl-line', { x: -14, autoAlpha: 0, duration: .45, stagger: .16, ease: 'power3.out' }, 1.2)
      .from('#term .ok', { scale: .4, autoAlpha: 0, duration: .45, stagger: .16, ease: 'back.out(1.7)' }, 1.45);
    const tc = { v: 0 }, tcEl = q('#termCount');
    hero.to(tc, { v: 6000, duration: 1.6, ease: 'power3.out', onUpdate: () => tcEl.textContent = fmt(tc.v) }, 2.1);

    // hero parallax on scroll
    gsap.to('#term', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-title', { yPercent: -10, autoAlpha: .25, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'center top', end: 'bottom top', scrub: true } });

    // ambient glows
    gsap.to('.blob.a', { x: '20vw', y: '30vh', duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blob.b', { x: '-20vw', y: '-25vh', duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // nav progress
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 } });

    // marquee
    gsap.to('#marquee', { xPercent: -50, duration: 32, ease: 'none', repeat: -1 });

    /* ===== section headings: char reveal ===== */
    headSplits.forEach(s => {
      gsap.from(s.chars, { yPercent: 110, rotation: 8, autoAlpha: 0, duration: 1, stagger: .018,
        scrollTrigger: { trigger: s.elements[0], start: 'top 85%' } });
    });
    gsap.utils.toArray('.kicker').forEach(k => gsap.from(k, { x: -30, autoAlpha: 0, duration: .9, scrollTrigger: { trigger: k, start: 'top 88%' } }));
    gsap.utils.toArray('.fade').forEach(el => {
      gsap.set(el, { visibility: 'visible' });
      gsap.from(el, { y: 30, autoAlpha: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 88%' } });
    });

    /* ===== SCENE 2 · STACK ===== */
    const cards = gsap.utils.toArray('.bento .card');
    gsap.set(cards, { visibility: 'visible', autoAlpha: 0, y: 70, rotationX: -12, transformPerspective: 1000 });
    ScrollTrigger.batch(cards, {
      start: 'top 88%', once: true,
      onEnter: batch => {
        gsap.to(batch, { autoAlpha: 1, y: 0, rotationX: 0, duration: 1.1, stagger: .08, overwrite: true });
        batch.forEach((c, i) => gsap.from(c.querySelectorAll('.badge'), { y: 16, scale: .7, autoAlpha: 0, duration: .6, ease: 'back.out(1.7)', stagger: .08, delay: .25 + i * .08 }));
      }
    });
    // glow follows pointer + magnetic float
    cards.forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    gsap.utils.toArray('.badge').forEach(b => {
      b.addEventListener('pointerenter', () => gsap.to(b, { y: -4, scale: 1.06, duration: .3, ease: 'back.out(3)' }));
      b.addEventListener('pointerleave', () => gsap.to(b, { y: 0, scale: 1, duration: .4, ease: 'power3.out' }));
    });

    /* ===== SCENE 3 · EXPERIENCE ===== */
    const metrics = gsap.utils.toArray('.metric');
    gsap.set(metrics, { visibility: 'visible' });
    gsap.from(metrics, { y: 60, autoAlpha: 0, duration: 1, stagger: .08, scrollTrigger: { trigger: '.metrics', start: 'top 85%' } });
    gsap.utils.toArray('.count').forEach(el => {
      const to = +el.dataset.to, o = { v: 0 };
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true,
        onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', onUpdate: () => el.textContent = fmt(o.v) }) });
    });
    gsap.to('#tlProg', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '#timeline', start: 'top 65%', end: 'bottom 65%', scrub: .4 } });
    gsap.utils.toArray('.job').forEach(job => {
      ScrollTrigger.create({ trigger: job, start: 'top 65%', toggleClass: { targets: job, className: 'on' } });
      const tl = gsap.timeline({ scrollTrigger: { trigger: job, start: 'top 82%' } });
      tl.from(job.querySelector('.job-when'), { x: -40, autoAlpha: 0, duration: .9 })
        .from(job.querySelectorAll('h3, .job-body > p'), { y: 24, autoAlpha: 0, duration: .8, stagger: .08 }, '<.1')
        .from(job.querySelectorAll('li'), { y: 20, autoAlpha: 0, duration: .7, stagger: .08 }, '<.15')
        .from(job.querySelectorAll('.tools span'), { y: 10, scale: .8, autoAlpha: 0, duration: .5, stagger: .04, ease: 'back.out(1.7)' }, '<.2');
    });
    const edu = gsap.utils.toArray('.edu > div');
    gsap.set(edu, { visibility: 'visible' });
    gsap.from(edu, { y: 40, autoAlpha: 0, duration: .9, stagger: .08, scrollTrigger: { trigger: '.edu', start: 'top 88%' } });

    /* ===== SCENE 4 · PROJECTS ===== */
    const mm = gsap.matchMedia();
    const track = document.getElementById('projTrack');
    const panels = gsap.utils.toArray('.proj');
    function panelReveal(p, st) {
      const tl = gsap.timeline({ scrollTrigger: st });
      tl.to(p.querySelector('.reveal-mask'), { scaleX: 0, duration: 1, ease: 'power4.inOut' })
        .from(p.querySelectorAll('.mock-body > :not(.reveal-mask)'), { scale: 1.08, duration: 1.2 }, '<.2')
        .from(p.querySelectorAll('.proj-n, h3, p, .impact'), { y: 30, autoAlpha: 0, duration: .8, stagger: .08 }, '<')
        .from(p.querySelectorAll('.tools span'), { y: 10, autoAlpha: 0, duration: .5, stagger: .08, ease: 'back.out(1.7)' }, '<.3');
      const bars = p.querySelectorAll('.bars i');
      if (bars.length) tl.from(bars, { scaleY: 0, duration: .9, stagger: .08, ease: 'back.out(1.7)' }, '<');
      return tl;
    }
    mm.add('(min-width: 900px)', () => {
      const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
      const horiz = gsap.to(track, { x: () => -dist(), ease: 'none',
        scrollTrigger: { trigger: '.proj-viewport', start: 'top 12%', end: () => '+=' + dist(), pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 } });
      panels.forEach((p, i) => panelReveal(p, i === 0
        ? { trigger: p, start: 'top 75%' }
        : { trigger: p, containerAnimation: horiz, start: 'left 80%' }));
    });
    mm.add('(max-width: 899px)', () => {
      panels.forEach(p => panelReveal(p, { trigger: p, start: 'top 80%' }));
    });
    // hover tilt
    document.querySelectorAll('[data-tilt]').forEach(m => {
      const rx = gsap.quickTo(m, 'rotationX', { duration: .6, ease: 'power3.out' });
      const ry = gsap.quickTo(m, 'rotationY', { duration: .6, ease: 'power3.out' });
      gsap.set(m, { transformPerspective: 1000 });
      m.addEventListener('pointermove', e => {
        const r = m.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - .5) * 14);
        rx(-((e.clientY - r.top) / r.height - .5) * 12);
      });
      m.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });
    // live loops inside mockups
    gsap.to('.vtile.speak', { boxShadow: 'inset 0 0 0 4px #3BE8A8', duration: .6, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.utils.toArray('#bars i').forEach((b, i) => gsap.to(b, { scaleY: () => gsap.utils.random(.55, 1.05), duration: 1.2, repeat: -1, yoyo: true, repeatRefresh: true, ease: 'sine.inOut', delay: 1.5 + i * .12 }));

    /* ===== SCENE 5 · CONTACT ===== */
    const socials = gsap.utils.toArray('.socials .btn');
    gsap.set([...socials, '#git'], { visibility: 'visible' });
    gsap.from(socials, { y: 30, scale: .85, autoAlpha: 0, duration: .8, stagger: .08, ease: 'back.out(1.7)', scrollTrigger: { trigger: '.socials', start: 'top 92%' } });
    gsap.from('#git', { scale: 0, rotation: -120, duration: 1.2, ease: 'back.out(1.7)', scrollTrigger: { trigger: '#git', start: 'top 90%' } });
    gsap.to('#gitBtn', { boxShadow: '0 30px 80px rgba(61,123,255,.35), 0 0 0 22px rgba(45,212,245,0)', duration: 1.6, repeat: -1, ease: 'power1.out' });

    // magnetic buttons
    document.querySelectorAll('.magnetic, .git-btn').forEach(b => {
      const xTo = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3.out' }), yTo = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3.out' });
      const k = b.classList.contains('git-btn') ? .35 : .25;
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * k); yTo((e.clientY - r.top - r.height / 2) * k); });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });

    // safety: anything not yet handled becomes visible
    gsap.set('.will-reveal', { visibility: 'visible' });
    ScrollTrigger.refresh();
  }

  /* ---------- re-split on resize (lines change) ---------- */
  let lastW = innerWidth, t;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (Math.abs(innerWidth - lastW) < 40) return;
      lastW = innerWidth;
      heroSplit && heroSplit.split();
      heroSplit.words.forEach(w => { if (hlRe.test(w.textContent)) w.classList.add('hl'); });
      headSplits.forEach(s => s.split()); tintCta();
      ScrollTrigger.refresh();
    }, 250);
  });

  const start = () => init();
  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]).then(start);
  else addEventListener('load', start);
})();
