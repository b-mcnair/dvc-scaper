const express = require('express');
const dvcShopScraper = require('./scrapers/scrapeDvcShop');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/dvcshop', async (req, res) => {
  try {
    const listings = await dvcShopScraper.scrape();
    res.json({ listings });
  } catch (err) {
    console.error(err);
    res.status(500).send('Scraping failed');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
