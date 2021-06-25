const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch();

  const page = await browser.newPage();

  // Instagram blocks browsers without proper user agent info!
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36"
  );

  await page.goto("https://www.instagram.com/accounts/login/");

  console.log("Logging in to instgram.");
  // You could this error if login credentials are incorrect
  // TimeoutError: Navigation timeout of 30000 ms exceeded

  // Logs in to instgram.
  // Populate the env file with neccessary credentials.

  const username = process.env.ACCOUNT;
  const password = process.env.PASSWORD;

  await page.waitForSelector("input");

  await page.click("input[name='username']");
  await page.type("input[name='username']", username);

  await page.click("input[name='password']");
  await page.type("input[name='password']", password);

  // Redirects to post
  await Promise.all([
    page.waitForNavigation(),
    page.click("button[type='submit']"),
  ]);

  // Post link
  await page.goto("https://www.instagram.com/p/CQbgdlBqOdl/");

  console.log(await page.title());

  // Images Scraping

  // Gets links of all the image sources in the the link.
  // First link is the link of the requested post.
  const imgs = await page.$$eval("img.FFVAD[src]", (imgs) =>
    imgs.map((img) => img.getAttribute("src"))
  );

  // Remove the item selector to fetch links of post previews in the page
  console.log("Source: " + imgs[0]);

  // Scraping videos, reels and IGTV videos
  const videos = await page.$$eval("video.tWeCl[src]", (videos) =>
    videos.map((video) => video.getAttribute("src"))
  );
  console.log("Source: " + videos[0]);

  await browser.close();
})();
