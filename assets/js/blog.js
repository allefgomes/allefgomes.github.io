/* Blog motion — mirrors the portfolio (index.html) animation vocabulary */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const showAll = () => document.querySelectorAll('.will-reveal').forEach(el => el.style.visibility = 'visible');

  // code block language label (rouge only emits a language-* class)
  document.querySelectorAll('.prose .highlighter-rouge[class*="language-"]').forEach(el => {
    const m = el.className.match(/language-(\S+)/);
    if (m && m[1] !== 'plaintext') el.dataset.lang = m[1];
  });

  if (!hasGSAP || reduce) {
    showAll();
    document.querySelectorAll('.reveal-mask').forEach(m => m.remove());
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ ease: 'power4.out', duration: 1 });

  let splits = [];
  const hasSplit = typeof SplitType !== 'undefined';
  function split() {
    if (!hasSplit) return;
    splits = [...document.querySelectorAll('.split')].map(el => new SplitType(el, { types: 'lines,words,chars' }));
  }

  function init() {
    split();

    // ambient glows + nav progress
    gsap.to('.blob.a', { x: '20vw', y: '30vh', duration: 18, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.blob.b', { x: '-20vw', y: '-25vh', duration: 22, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('#progress', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: .3 } });

    // headings: char reveal (first one plays on load)
    gsap.set('.split', { visibility: 'visible' });
    splits.forEach((s, i) => {
      gsap.from(s.chars, { yPercent: 110, rotation: 8, autoAlpha: 0, duration: 1, stagger: .018, delay: i === 0 ? .15 : 0,
        scrollTrigger: i === 0 ? undefined : { trigger: s.elements[0], start: 'top 85%' } });
    });
    gsap.utils.toArray('.kicker').forEach(k => gsap.from(k, { x: -30, autoAlpha: 0, duration: .9, scrollTrigger: { trigger: k, start: 'top 92%' } }));
    gsap.utils.toArray('.fade').forEach(el => {
      gsap.set(el, { visibility: 'visible' });
      gsap.from(el, { y: 30, autoAlpha: 0, duration: 1, delay: .3, scrollTrigger: { trigger: el, start: 'top 92%' } });
    });

    // post cards
    const cards = gsap.utils.toArray('.posts .card, .post-nav .card');
    gsap.set(cards, { visibility: 'visible', autoAlpha: 0, y: 70, rotationX: -12, transformPerspective: 1000 });
    ScrollTrigger.batch(cards, {
      start: 'top 92%', once: true,
      onEnter: batch => {
        gsap.to(batch, { autoAlpha: 1, y: 0, rotationX: 0, duration: 1.1, stagger: .08, overwrite: true });
        batch.forEach((c, i) => {
          const mask = c.querySelector('.reveal-mask');
          if (mask) gsap.to(mask, { scaleX: 0, duration: 1, ease: 'power4.inOut', delay: .15 + i * .08 });
          const tags = c.querySelectorAll('.tag');
          if (tags.length) gsap.from(tags, { y: 10, scale: .8, autoAlpha: 0, duration: .5, stagger: .05, ease: 'back.out(1.7)', delay: .4 + i * .08 });
        });
      }
    });
    document.querySelectorAll('.card').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    // post cover: mask wipe + tilt
    const cover = document.querySelector('.cover');
    if (cover) {
      gsap.set(cover, { visibility: 'visible' });
      gsap.timeline({ delay: .4 })
        .from(cover, { y: 80, rotationX: 14, transformPerspective: 1200, autoAlpha: 0, duration: 1.3 })
        .to(cover.querySelector('.reveal-mask'), { scaleX: 0, duration: 1, ease: 'power4.inOut' }, '<.3')
        .from(cover.querySelector('img'), { scale: 1.1, duration: 1.4 }, '<.1');
      gsap.to(cover.querySelector('img'), { yPercent: 8, ease: 'none', scrollTrigger: { trigger: cover, start: 'top 60%', end: 'bottom top', scrub: true } });
    }

    // post meta + prose blocks
    const metaBits = gsap.utils.toArray('.post-meta > *');
    if (metaBits.length) { gsap.set('.post-meta', { visibility: 'visible' }); gsap.from(metaBits, { y: 16, autoAlpha: 0, duration: .7, stagger: .06, delay: .5, ease: 'back.out(1.7)' }); }
    gsap.utils.toArray('.prose > *').forEach(el => gsap.from(el, { y: 26, autoAlpha: 0, duration: .9, scrollTrigger: { trigger: el, start: 'top 92%' } }));

    // tags page
    gsap.utils.toArray('.tag-group').forEach(g => {
      gsap.set(g, { visibility: 'visible' });
      gsap.timeline({ scrollTrigger: { trigger: g, start: 'top 88%' } })
        .from(g.querySelector('h2'), { x: -40, autoAlpha: 0, duration: .9 })
        .from(g.querySelectorAll('li'), { y: 20, autoAlpha: 0, duration: .7, stagger: .06 }, '<.1');
    });
    const cloud = gsap.utils.toArray('.tag-cloud .tag');
    if (cloud.length) { gsap.set('.tag-cloud', { visibility: 'visible' }); gsap.from(cloud, { y: 16, scale: .7, autoAlpha: 0, duration: .6, stagger: .03, delay: .4, ease: 'back.out(1.7)' }); }

    // tag hover float
    gsap.utils.toArray('a.tag').forEach(b => {
      b.addEventListener('pointerenter', () => gsap.to(b, { y: -3, scale: 1.05, duration: .3, ease: 'back.out(3)' }));
      b.addEventListener('pointerleave', () => gsap.to(b, { y: 0, scale: 1, duration: .4, ease: 'power3.out' }));
    });

    // magnetic buttons
    document.querySelectorAll('.magnetic').forEach(b => {
      const xTo = gsap.quickTo(b, 'x', { duration: .5, ease: 'power3.out' }), yTo = gsap.quickTo(b, 'y', { duration: .5, ease: 'power3.out' });
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); xTo((e.clientX - r.left - r.width / 2) * .25); yTo((e.clientY - r.top - r.height / 2) * .25); });
      b.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });

    gsap.set('.will-reveal', { visibility: 'visible' });
    ScrollTrigger.refresh();
  }

  let lastW = innerWidth, t;
  addEventListener('resize', () => {
    clearTimeout(t);
    t = setTimeout(() => {
      if (Math.abs(innerWidth - lastW) < 40) return;
      lastW = innerWidth;
      splits.forEach(s => s.split());
      ScrollTrigger.refresh();
    }, 250);
  });

  if (document.fonts && document.fonts.ready) Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 1500))]).then(init);
  else addEventListener('load', init);
})();
