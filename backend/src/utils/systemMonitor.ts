// import os from "os";
// import logger from "./logger";

// // Calculate System Stats
// export const getSystemMetrics = () => {
//   const totalMem = os.totalmem();
//   const freeMem = os.freemem();
//   const usedMem = totalMem - freeMem;
//   const memUsagePercent = ((usedMem / totalMem) * 100).toFixed(2);

//   // CPU Cores & Load Average (1 min average)
//   const cpuCount = os.cpus().length;
//   const loadAvg = os.loadavg()[0]; // 1-minute load average

//   // Process Memory (Heap memory used by Node.js app)
//   const processMem = process.memoryUsage();
//   const heapUsedMB = (processMem.heapUsed / 1024 / 1024).toFixed(2);
//   const heapTotalMB = (processMem.heapTotal / 1024 / 1024).toFixed(2);

//   // App Uptime in Minutes
//   const uptimeMinutes = (process.uptime() / 60).toFixed(2);

//   return {
//     cpu: {
//       cores: cpuCount,
//       load1Min: loadAvg.toFixed(2),
//     },
//     memory: {
//       totalGB: (totalMem / 1024 / 1024 / 1024).toFixed(2),
//       usedGB: (usedMem / 1024 / 1024 / 1024).toFixed(2),
//       freeGB: (freeMem / 1024 / 1024 / 1024).toFixed(2),
//       usagePercent: `${memUsagePercent}%`,
//     },
//     process: {
//       heapUsed: `${heapUsedMB} MB`,
//       heapTotal: `${heapTotalMB} MB`,
//       uptime: `${uptimeMinutes} mins`,
//     },
//   };
// };

// // Start Periodic Logging (Runs every X seconds)
// export const startSystemMonitoring = (intervalMs = 30000) => {
//   logger.info("📊 System Performance & Resource Monitoring Started");

//   setInterval(() => {
//     const metrics = getSystemMetrics();

//     logger.info(
//       `🖥️ [SYSTEM METRICS] RAM: ${metrics.memory.usagePercent} (${metrics.memory.usedGB}/${metrics.memory.totalGB} GB) | Node Heap: ${metrics.process.heapUsed} | CPU Load: ${metrics.cpu.load1Min} | Uptime: ${metrics.process.uptime}`,
//     );
//   }, intervalMs);
// };
