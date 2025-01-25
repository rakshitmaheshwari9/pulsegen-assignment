import { promises as fs } from "fs";
import { log } from "../services/logger";

export const exportToJson = async (
  data: any[],
  fileName: string
): Promise<void> => {
  try {
    if (!Array.isArray(data) || data.length === 0) {
      // throw new Error(
      //   "No data available to export. Ensure the data array is not empty."
      // );
      return;
    }

    const jsonData = JSON.stringify(data, null, 2);

    await fs.writeFile(fileName, jsonData, "utf8");

    log("info", `Data successfully exported to ${fileName}`);
  } catch (error) {
    log("error", "Failed to export data to JSON file", { error });
  }
};
