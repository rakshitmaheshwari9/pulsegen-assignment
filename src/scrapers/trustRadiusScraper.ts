import puppeteer, { Browser, Page } from "puppeteer";
import * as cheerio from "cheerio";
import { Review } from "../types/types";
import { isWithinDateRange } from "../utils/utils";
import { log } from "../services/logger";


export const scrapeTrustRadius = async (
  companyName: string,
  startDate: string,
  endDate: string
): Promise<Review[]> => {
  const reviews: Review[] = [];
  const baseUrl = `https://www.trustradius.com/products/${companyName}/reviews`;

  let browser: Browser | null = null;

  try {
    // Launch Puppeteer with optimized settings
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page: Page = await browser.newPage();

    // Set anti-detection measures
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    // Navigate to the base URL
    await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });

    let hasNextPage = true;

    while (hasNextPage) {
      // Extract page content and load it into Cheerio
      const content: string = await page.content();
      const $ = cheerio.load(content);

      // Extract reviews from the current page
      $(".review").each((_, element) => {
        const title = $(element).find(".review-title").text().trim();
        const content = $(element).find(".review-content").text().trim();
        const date = $(element).find(".review-date").text().trim();
        const rating = parseFloat(
          $(element).find(".review-rating").attr("data-rating") || "0"
        );
        const reviewerName = $(element).find(".reviewer-name").text().trim();

        // Validate and filter reviews based on the date range
        if (isWithinDateRange(date, startDate, endDate)) {
          reviews.push({
            title,
            content,
            date,
            rating,
            reviewerName,
            source: "TrustRadius",
          });
        }
      });

      // Check for the "Next" button to handle pagination
      const nextButton = await page.$(".next-button");
      if (nextButton) {
        await nextButton.click();
        await page.waitForSelector(".review", {
          visible: true,
          timeout: 5000,
        });
      } else {
        hasNextPage = false;
      }
    }
  } catch (error: unknown) {
    // Handle errors and log them
    if (error instanceof Error) {
      log("error", "Error scraping TrustRadius", { error: error.message });
    } else {
      log("error", "Unknown error occurred while scraping TrustRadius");
    }
  } finally {
    // Ensure the browser is closed to free resources
    if (browser) {
      await browser.close();
    }
  }

  return reviews;
};
