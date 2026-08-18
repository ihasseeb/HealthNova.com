import dns from "dns";
import app from "./app";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./lib/socket";

// Force IPv4 (Railway compatibility)
dns.setDefaultResultOrder("ipv4first");

dotenv.config();

const PORT = process.env.PORT || 5000;

//Create http server
const httpServer = http.createServer(app);

//initialize socket.io
initSocket(httpServer);

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
});
