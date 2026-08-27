import dns from "dns";
import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./lib/socket";
import logger from "./utils/logger";
// import { startSystemMonitoring } from "./utils/systemMonitor"; // ← Import Karo

// Force IPv4 (Railway compatibility)
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const PORT = process.env.PORT || 5000;

//Create http server
const httpServer = http.createServer(app);

//initialize socket.io
initSocket(httpServer);

app.listen(PORT, () => {
  logger.info(`🚀 Server running on http://localhost:${PORT}`);
  logger.info(`📅 Started at: ${new Date().toLocaleString()}`);

  // Har 30 Seconds par Terminal + Log File mein System Stats print honge
  // startSystemMonitoring(30000); // 20,000 ms = 20 Seconds
});
