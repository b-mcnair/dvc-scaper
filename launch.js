const puppeteer = require('puppeteer');

(async () => {
  console.log("🚀 Launching bare Chrome...");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  console.log("✅ Browser launched successfully");
  await browser.close();
})();
