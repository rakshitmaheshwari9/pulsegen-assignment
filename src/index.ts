import { scrapeG2 } from "./scrapers/g2Scrapers";
import { scrapeCapterra } from "./scrapers/capterraScraper";
import { scrapeTrustRadius } from "./scrapers/trustRadiusScraper";
import { exportToJson } from "./output/jsonExporter";
import { validateDate } from "./utils/utils";
import { log } from "./services/logger";
import { InputParams, Review } from "./types/types";

const main = async (params: InputParams) => {
  const { companyName, startDate, endDate, source, companyCode } = params;

  if (!validateDate(startDate) || !validateDate(endDate)) {
    log("error", "Invalid date format. Please use YYYY-MM-DD.");
    return;
  }

  let reviews: Review[] = [];
  try {
    switch (source.toLowerCase()) {
      case "g2":
        reviews = await scrapeG2(companyName, startDate, endDate);
        break;
      case "capterra":
        reviews = await scrapeCapterra(
          companyName,
          startDate,
          endDate,
          companyCode
        );
        break;
      case "trustradius":
        reviews = await scrapeTrustRadius(companyName, startDate, endDate);
        break;
      default:
        log(
          "error",
          "Invalid source. Please choose 'G2', 'Capterra', or 'TrustRadius'."
        );
        return;
    }
    console.log("info", reviews[0]);
    const outputFileName = `${companyName}_reviews.json`;
    exportToJson(reviews, outputFileName);
    log("info", `Reviews saved to ${outputFileName}`);
  } catch (error) {
    log("error", "An error occurred during the scraping process.", { error });
  }
};

main({
  companyName: "Keka",
  companyCode: "149253",
  startDate: "2024-12-01",
  endDate: "2024-12-31",
  source: "capterra",
});
