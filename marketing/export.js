/**
 * Horizons Marketing Flyer Exporter
 * Renders the HTML flyer to a print-ready PDF + 300 DPI PNG using Puppeteer + Sharp.
 *
 * Usage:
 *   node export.js        — export the full-page flyer
 */

const puppeteer = require('puppeteer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'print-ready');
const PUBLIC_DIR = path.join(__dirname, 'public');

const FLYER = {
  file: 'flyer-full.html',
  label: 'Full-Page Flyer (8.5 × 11 in)',
  width: 8.5,
  height: 11,
  outputBase: 'horizons-flyer-full',
};

const DPI = 300;
const SCALE = DPI / 96; // CSS px → print px  (96 CSS px = 1 inch at 96 DPI)

async function exportFlyer(browser) {
  const htmlPath = path.join(PUBLIC_DIR, FLYER.file);

  if (!fs.existsSync(htmlPath)) {
    console.error(`  ✗ HTML file not found: ${htmlPath}`);
    return;
  }

  console.log(`\n▶  Exporting: ${FLYER.label}`);

  const pxWidth  = Math.round(FLYER.width  * DPI);
  const pxHeight = Math.round(FLYER.height * DPI);
  const cssWidth  = Math.round(FLYER.width  * 96);
  const cssHeight = Math.round(FLYER.height * 96);

  const page = await browser.newPage();

  await page.setViewport({
    width: cssWidth,
    height: cssHeight,
    deviceScaleFactor: SCALE,
  });

  const fileUrl = `file:///${htmlPath.replace(/\\/g, '/')}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle2', timeout: 30000 });

  // Allow Google Fonts & the QR-code image to fully load
  await new Promise(r => setTimeout(r, 3000));

  // ── PNG ─────────────────────────────────────────────────────────────────────
  const pngRaw = await page.screenshot({
    type: 'png',
    clip: { x: 0, y: 0, width: cssWidth, height: cssHeight },
    omitBackground: false,
  });

  const pngPath = path.join(OUTPUT_DIR, `${FLYER.outputBase}.png`);

  await sharp(pngRaw)
    .resize(pxWidth, pxHeight, { fit: 'fill' })
    .withMetadata({ density: DPI })
    .png({ compressionLevel: 9 })
    .toFile(pngPath);

  console.log(`  ✓ PNG  → ${path.relative(__dirname, pngPath)}  (${pxWidth}×${pxHeight}px @ ${DPI} DPI)`);

  // ── PDF ─────────────────────────────────────────────────────────────────────
  const pdfPath = path.join(OUTPUT_DIR, `${FLYER.outputBase}.pdf`);

  await page.pdf({
    path: pdfPath,
    width: `${FLYER.width}in`,
    height: `${FLYER.height}in`,
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });

  console.log(`  ✓ PDF  → ${path.relative(__dirname, pdfPath)}`);

  await page.close();
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  console.log('Horizons Marketing Flyer Exporter');
  console.log('════════════════════════════════════');
  console.log(`Output : ${OUTPUT_DIR}`);
  console.log(`DPI    : ${DPI}  |  Scale factor : ${SCALE}`);

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--font-render-hinting=none',
    ],
  });

  try {
    await exportFlyer(browser);
  } finally {
    await browser.close();
  }

  console.log('\n✅  Export complete!');
  console.log(`   Files saved to: ${OUTPUT_DIR}`);
  console.log('   Ready for Staples, VistaPrint, or any professional print shop.\n');
}

main().catch((err) => {
  console.error('\n❌  Export failed:', err.message);
  process.exit(1);
});
