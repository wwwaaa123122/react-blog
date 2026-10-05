import { chromium } from 'playwright';
const browser = await chromium.launch();
const p = await browser.newPage();
const errs = [];
p.on('pageerror', e => errs.push(e.message));
p.on('console', m => { if (m.type()==='error') errs.push(m.text().slice(0,100)); });
await p.goto('http://localhost:5200/', { waitUntil: 'networkidle' });
// prod preview is stale build; check dev instead
await p.goto('http://localhost:5199/', { waitUntil: 'networkidle' });
const links = await p.evaluate(() => [...document.querySelectorAll('footer a[aria-label]')].map(a => a.getAttribute('aria-label') + ' -> ' + a.getAttribute('href')));
console.log(links.join('\n'));
const resp = await p.goto('http://localhost:5199/sitemap.xml').catch(()=>null);
console.log('sitemap status:', resp && resp.status());
console.log('ERRORS:', errs.length);
await p.screenshot({ path: '/tmp/footer.png' });
await browser.close();
