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
//await page.goto('https://mathsbot.com/puzzles/fourOpsPuzzle');
await page.goto('file://'+path.resolve(__dirname, 'html/Four Operations Puzzle.html'));

// Set screen size.
await page.setViewport({width: 1080, height: 1024});

// difficulty = hard; 1 for easier
await page.select('#revealedSelect', '0');

await page.click('#negativeSelect');
await page.click('#decimalSelect');

for (let i = 1; i <= 40; ++i) {
  await page.click('input[value="New Puzzle"]');
  let pdf = await page.pdf();
  await merger.add(pdf);
  console.log("generated page " + i)
}

fs.mkdir("./out", { recursive: true })
  .then(() => console.log('"./out" created successfully'))
  .catch((err) => console.error('Error creating "./out":', err));

await merger.save('./out/four_ops.pdf');


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

