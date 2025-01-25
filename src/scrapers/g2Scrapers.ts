import puppeteer from "puppeteer";
import * as cheerio from "cheerio";
import { Review } from "../types/types";
import { isWithinDateRange } from "../utils/utils";
import { log } from "../services/logger";

export const scrapeG2 = async (
  companyName: string,
  startDate: string,
  endDate: string
): Promise<Review[]> => {
  const reviews: Review[] = [];
  const baseUrl = `https://www.g2.com/products/${companyName}/reviews`;
  let page = 1;

  try {
    const browser = await puppeteer.launch({
      headless: false, 
    });

    const pageInstance = await browser.newPage();

    await pageInstance.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await pageInstance.setViewport({ width: 1920, height: 1080 });

    while (true) {
      const url = `${baseUrl}?page=${page}`;
      log("info", `Navigating to URL: ${url}`);

      await pageInstance.goto(url, { waitUntil: "networkidle2" });

      await pageInstance.waitForSelector(".review");

      const content = await pageInstance.content();
      const $ = cheerio.load(content);

      const reviewElements = $(".review");
      if (reviewElements.length === 0) {
        log("info", "No more reviews found. Exiting pagination.");
        break;
      }

      reviewElements.each((_, element) => {
        const title = $(element).find(".review-title").text().trim();
        const content = $(element).find(".review-content").text().trim();
        const date = $(element).find(".review-date").text().trim();
        const rating = parseFloat(
          $(element).find(".review-rating").attr("data-rating") || "0"
        );
        const reviewerName = $(element).find(".reviewer-name").text().trim();

        if (isWithinDateRange(date, startDate, endDate)) {
          reviews.push({
            title,
            content,
            date,
            rating,
            reviewerName,
            source: "G2",
          });
        }
      });

      log(
        "info",
        `Page ${page} processed. Reviews collected so far: ${reviews.length}`
      );
      page++;

      const nextButton = await pageInstance.$(".pagination-next");
      if (!nextButton) {
        log("info", "No next page button found. Exiting pagination.");
        break;
      }

      await Promise.all([
        nextButton.click(),
        pageInstance.waitForNavigation({ waitUntil: "networkidle2" }),
      ]);
    }

    await browser.close();
  } catch (error) {
    log("error", "Error scraping G2", { error });
  }

  return reviews;
};
