import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Reset daily credit and token limits at midnight UTC every day
crons.daily(
    "reset-daily-limits",
    { hourUTC: 0, minuteUTC: 0 },
    internal.credits.resetDailyLimits,
);

export default crons;
