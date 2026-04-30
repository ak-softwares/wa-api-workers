import { Job, Worker } from "bullmq";
import { CRM_SIGNUP_QUEUE_NAME } from "../utiles/constants/queueNames";
import { sendSignupToCrm } from "../core/crm/sendSignupToCrm";
import { SignupCrmJobData } from "../types/Crm";

const isDev = process.env.NODE_ENV !== "production";

export const worker = new Worker<SignupCrmJobData>(
  CRM_SIGNUP_QUEUE_NAME,
  async (job: Job<SignupCrmJobData>) => {
    await sendSignupToCrm(job.data);
  },
  {
    connection: { 
      url: process.env.REDIS_URL!,
      maxRetriesPerRequest: null,
    },
    concurrency: 5,
  },
);

worker.on("failed", (job, err) => {
  console.error(`[crm-signup-worker] failed job ${job?.id}: ${err.message}`);
});
