"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.worker = void 0;
const bullmq_1 = require("bullmq");
const queueNames_1 = require("../utiles/constants/queueNames");
const sendSignupToCrm_1 = require("../core/crm/sendSignupToCrm");
const isDev = process.env.NODE_ENV !== "production";
exports.worker = new bullmq_1.Worker(queueNames_1.CRM_SIGNUP_QUEUE_NAME, async (job) => {
    await (0, sendSignupToCrm_1.sendSignupToCrm)(job.data);
}, {
    connection: {
        url: process.env.REDIS_URL,
        maxRetriesPerRequest: null,
    },
    concurrency: 5,
});
exports.worker.on("failed", (job, err) => {
    console.error(`[crm-signup-worker] failed job ${job?.id}: ${err.message}`);
});
