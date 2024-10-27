import puppeteer from 'puppeteer';
import PDFMerger from 'pdf-merger-js';
import { fileURLToPath } from 'url';
import path from 'path';
import { promises as fs } from 'fs';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var merger = new PDFMerger();

// Launch the browser and open a new blank page
// const browser = await puppeteer.launch({headless: false});
const browser = await puppeteer.launch();
const page = await browser.newPage();

// Navigate the page to a URL.
//await page.goto('https://mathsbot.com/tables/fractionsOfAmounts');
await page.goto('file://'+path.resolve(__dirname, 'html/Fractions of Amounts.html'));

// Set screen size.
await page.setViewport({width: 1080, height: 1024});

let trues = [1,2,3,4,5,7,8];
let falses = [6];

const result = await page.evaluate((trues, falses) => {
  // JavaScript code to be executed on the page
  
  trues.forEach((f) => document.getElementById('c'+f).checked = true)
  falses.forEach((f) => document.getElementById('c'+f).checked = false)
  document.getElementById("rowSelect").value = 17
  setUp();
}, trues, falses);

for (let i = 1; i <= 4; ++i) {
  const result = await page.evaluate((trues) => {
    for (let row = 0; row < document.getElementById("rowSelect").value; ++row) {
      console.log("row " + row);
      columns = trues.length;
      // trues is 1 based
      onColumn = Math.floor(Math.random()*trues.length);
      for (let column = 0; column < trues.length; ++column) {
        if (column === onColumn) {
          console.log("turning on" + column + " for " + onColumn);
          tableTerms[row][column].state = 1;
        } else {
          tableTerms[row][column].state = 0;
        }
      }
    }
    createValues();
  }, trues);

  let pdf = await page.pdf({landscape: true});
  await merger.add(pdf);
  console.log("generated page " + i)
}

fs.mkdir("./out", { recursive: true })
  .then(() => console.log('"./out" created successfully'))
  .catch((err) => console.error('Error creating "./out":', err));

await merger.save('./out/fractions_of_amounts.pdf');

await browser.close();