const { scrape } = require('./scrapers/scrapeDvcShop');

(async () => {
  console.log('🟢 Starting run.js...');
  const matches = await scrape();
  console.log(`✅ Done. Found ${matches.length} matching listings.`);
})();
