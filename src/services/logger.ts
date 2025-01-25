import { Logger } from "tslog";

const logger = new Logger();

export const log = (
  level: "info" | "warn" | "error",
  message: string,
  context?: any
): void => {
  switch (level) {
    case "info":
      logger.info(message, context);
      break;
    case "warn":
      logger.warn(message, context);
      break;
    case "error":
      logger.error(message, context);
      break;
    default:
      logger.debug(message, context);
  }
};
