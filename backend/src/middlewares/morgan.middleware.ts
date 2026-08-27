import morgan, { StreamOptions } from "morgan";
import logger from "../utils/logger";

// Create a stream object that uses Winston's HTTP level
const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

// Skip logging in testing environment
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env === "test";
};

// Build the morgan middleware
export const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  { stream, skip },
);
