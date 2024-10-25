import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';
import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var merger = new PDFMerger();

// Launch the browser and open a new blank page
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
//await page.goto('https://mail.mathsbot.com/primary/year5Mini');
await page.goto('file://'+path.resolve(__dirname, 'html/Year 5 Mathematics Arithmetic Paper - Compact Version.html'));

// Set screen size.
await page.setViewport({width: 1080, height: 1024});

// difficulty = hard; 1 for easier
await page.$eval('#totalQ', el => el.value = '40');

const [button] = await page.$$("xpath/.//button[contains(., 'New')]");
for (let i = 1; i <= 10; ++i) {
  await button.click();
  let pdf = await page.pdf();
  await merger.add(pdf);
  console.log("generated page " + i)
}

fs.mkdir("./out", { recursive: true })
  .then(() => console.log('"./out" created successfully'))
  .catch((err) => console.error('Error creating "./out":', err));

await merger.save('./out/year5.pdf');


// // Type into search box.
// await page.locator('.devsite-search-field').fill('automate beyond recorder');

// // Wait and click on first result.
// await page.locator('.devsite-result-item-link').click();

// // Locate the full title with a unique string.
// const textSelector = await page
//   .locator('text/Customize and automate')
//   .waitHandle();
// const fullTitle = await textSelector?.evaluate(el => el.textContent);

// // Print the full title.
// console.log('The title of this blog post is "%s".', fullTitle);

await browser.close();

