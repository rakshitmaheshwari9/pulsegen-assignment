import axios from "axios";
import * as cheerio from "cheerio";
import { Review } from "../types/types";
import { calculateYearsAgo } from "../utils/utils";
import { log } from "../services/logger";

export const scrapeCapterra = async (
  companyName: string,
  startDate: string,
  endDate: string,
  companyCode?: string
): Promise<Review[]> => {
  const reviews: Review[] = [];
  const baseUrl = `https://www.capterra.in/reviews/${companyCode}/${companyName}`;
  let page = 1;

  console.log("baseUrl: ", baseUrl);

  try {
    while (true) {
      console.log(`Fetching page ${page}...`);
      const response = await axios.get(`${baseUrl}?page=${page}`);
      const $ = cheerio.load(response.data);

      const reviewElements = $(".review-card");
      if (reviewElements.length === 0) {
        console.log(
          `No more reviews found on page ${page}. Ending pagination.`
        );
        break;
      }

      reviewElements.each((_, element) => {
        const title = $(element).find("h3").text().trim();
        const content = $(element).find("p").text().trim();
        const timeSpan = $(element).find("span.ms-2");
        const time = timeSpan?.text().trim();
        const rating = parseFloat(
          $(element).find(".star-rating-component").text().trim()
        );
        const reviewerElement = $(element).find("div.h5.fw-bold.mb-2");
        const reviewerName = reviewerElement.text().trim();

        // Calculate years ago from the start and end dates
        const startYearsAgo = calculateYearsAgo(startDate);
        const endYearsAgo = calculateYearsAgo(endDate);

        // Check if the review's time is within the years/months ago
        // if (isWithinDateRange(time, startDate, endDate)) {
        reviews.push({
          title,
          content,
          time,
          rating,
          reviewerName,
          source: "Capterra",
        });
        // }
      });

      // Move to the next page
      page++;
    }
  } catch (error) {
    log("error", "Error scraping Capterra", { error });
  }

  return reviews;
};
