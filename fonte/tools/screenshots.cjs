const puppeteer = require('/home/elton/projetos/joice-borges-estetica/node_modules/puppeteer-core');
(async () => {
  const b = await puppeteer.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'] });
  const R = '/home/elton/projetos/liaa-reconai/.impeccable/review/';
  const U = 'http://127.0.0.1:4317/liaa-elton.github.io/';
  for (const [n, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }]]) {
    const p = await b.newPage(); await p.setViewport(vp);
    await p.goto(U, { waitUntil: 'networkidle0' });
    const m = await p.evaluate(() => {
      const W = document.documentElement.clientWidth; const out = [];
      for (const el of document.querySelectorAll('body *')) { const r = el.getBoundingClientRect(); if (r.right > W + 1 && r.width > 0 && !el.closest('[data-rolavel],.overflow-x-auto')) out.push(el.tagName + '.' + (el.className?.baseVal ?? el.className).toString().slice(0, 60) + ' r=' + Math.round(r.right)); }
      return { W, sw: document.documentElement.scrollWidth, h: document.documentElement.scrollHeight, over: out.slice(0, 12) };
    });
    console.log(n, JSON.stringify(m));
    await p.screenshot({ path: R + n + '.png', fullPage: true });
  }
  await b.close();
})();
