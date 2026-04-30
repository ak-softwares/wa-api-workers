import dotenv from "dotenv";
dotenv.config();

import { redis } from "./config/redis";
import { worker as crmWorker } from "./processors/crm.processor";

async function shutdown() {
  await crmWorker.close();
  await redis.quit();
  process.exit(0);
}

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);