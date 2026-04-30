"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
function createRedisClient() {
    const url = process.env.REDIS_URL;
    if (!url) {
        throw new Error("❌ REDIS_URL is not defined");
    }
    const client = new ioredis_1.default(url, {
        maxRetriesPerRequest: 3,
        enableReadyCheck: true,
        tls: url.startsWith("rediss://") ? {} : undefined,
        retryStrategy(times) {
            const delay = Math.min(times * 200, 2000);
            console.warn(`🔁 Redis reconnect attempt ${times}, delay ${delay}ms`);
            return delay;
        },
        reconnectOnError(err) {
            if (err.message.includes("READONLY"))
                return 2;
            if (err.message.includes("ECONNRESET") || err.message.includes("ETIMEDOUT"))
                return true;
            return false;
        },
    });
    console.log("🔌 Redis client created, status:", client.status);
    client.on("connect", () => {
        console.log("✅ Redis connected");
    });
    client.on("error", (err) => {
        console.error("❌ Redis error:", err.message);
    });
    return client;
}
exports.redis = createRedisClient();
