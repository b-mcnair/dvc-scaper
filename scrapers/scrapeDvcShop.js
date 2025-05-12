const puppeteer = require('puppeteer');
const { writeToSheet } = require('../writeToSheet');

async function scrape() {
  console.log("🚀 Launching Puppeteer with system Chrome...");

  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log("🟢 Chrome launched!");

  const page = await browser.newPage();
  await page.goto('https://rentals.dvcshop.com/confirmed-reservations/', {
    waitUntil: 'domcontentloaded',
  });

  await page.waitForTimeout(5000);

  const listings = await page.evaluate(() => {
    const rows = Array.from(document.querySelectorAll('table tbody tr'));
    return rows.map(row => {
      const cells = row.querySelectorAll('td');
      return {
        checkIn: cells[0]?.innerText.trim() || '',
        nights: cells[1]?.innerText.trim() || '',
        resort: cells[2]?.innerText.trim() || '',
        roomType: cells[3]?.innerText.trim() || '',
        sleeps: cells[4]?.innerText.trim() || '',
        price: cells[5]?.innerText.trim() || '',
        status: cells[6]?.innerText.trim() || '',
        link: cells[7]?.querySelector('a')?.href || ''
      };
    });
  });

  // Filter for cost per night <= $500 and at least 3 nights
  const matches = listings.filter(listing => {
    const nights = parseInt(listing.nights);
    const totalPrice = parseFloat(listing.price.replace(/[^\d.]/g, ''));
    const pricePerNight = totalPrice / nights;

    return (
      !isNaN(pricePerNight) &&
      nights >= 3 &&
      pricePerNight <= 500
    );
  });

  await writeToSheet(dvcshop);
  await browser.close();
  return matches;
}

module.exports = { scrape };