import fs from "fs";
import path from "path";

// Load envs BEFORE imports that use them
const loadEnv = (filename: string) => {
    const envPath = path.resolve(process.cwd(), filename);
    if (fs.existsSync(envPath)) {
        console.log(`Loading env from ${filename}`);
        const envConfig = fs.readFileSync(envPath, "utf8");
        envConfig.split("\n").forEach((line) => {
            // Basic dotenv parsing regex: key=value, handling quotes
            const match = line.match(/^\s*([\w_]+)\s*=\s*(.*)?\s*$/);
            if (match) {
                const key = match[1];
                let value = match[2] || "";
                // Remove surrounding quotes if present
                if (value.length > 1 && value.startsWith('"') && value.endsWith('"')) {
                    value = value.slice(1, -1);
                } else if (value.length > 1 && value.startsWith("'") && value.endsWith("'")) {
                    value = value.slice(1, -1);
                }

                if (!process.env[key]) {
                    process.env[key] = value;
                }
            }
        });
    }
};

loadEnv(".env");
loadEnv(".env.local");

console.log("DATABASE_URL set:", !!process.env.DATABASE_URL);
if (!process.env.DATABASE_URL) {
    console.error("ERROR: DATABASE_URL is missing from environment vars!");
    const files = fs.readdirSync(process.cwd());
    console.log("Root files:", files.filter(f => f.startsWith(".env")));
}

async function main() {
    // Dynamic import to ensure env vars are present
    const { consumeCreditsForUser } = await import("@/lib/usage");
    const { prisma } = await import("@/lib/db");

    const TEST_USER_ID = "test-user-reset-flow";
    const PRO_POINTS = 100;

    console.log("Checking DB connection with Project table...");
    try {
        await prisma.project.findFirst();
        console.log("Project table accessible.");
    } catch (e) {
        console.error("Failed to access Project table:", e);
    }

    console.log("Cleaning up previous test data (Usage)...");
    try {
        await prisma.usage.deleteMany({
            where: { key: TEST_USER_ID },
        });
    } catch (e: any) {
        if (e.code === 'P2021') {
            console.error("Usage table does not exist. Attempting to consume credits anyway (RateLimiter might handle it or fail)...");
        } else {
            throw e;
        }
    }

    console.log(`Simulating consumption of ${PRO_POINTS} points for user ${TEST_USER_ID}...`);

    for (let i = 0; i < PRO_POINTS; i++) {
        const result = await consumeCreditsForUser(TEST_USER_ID, { hasProAccess: true });

        if (i % 10 === 0 || i === PRO_POINTS - 1) {
            console.log(`Consumed ${i + 1}/${PRO_POINTS}. Remaining: ${result.remainingPoints}`);
        }

        if (result.remainingPoints === 0) {
            console.log("Points depleted!");
        }
    }

    // Verify DB state
    const usage = await prisma.usage.findUnique({
        where: { key: TEST_USER_ID },
    });

    if (!usage) {
        throw new Error("Usage record not found!");
    }

    console.log("Usage Record:", usage);

    const now = new Date();
    const expireTime = new Date(usage.expire!);

    // Check if expire time is close to now (within 1 minute)
    const diff = Math.abs(now.getTime() - expireTime.getTime());

    if (diff < 60000) {
        console.log("SUCCESS: Usage record expired immediately (timestamp is recent).");
        console.log(`Expire Time: ${expireTime.toISOString()}`);
        console.log(`Current Time: ${now.toISOString()}`);
    } else {
        console.error("FAILURE: Usage record expire time is not recent.");
        console.error(`Expire Time: ${expireTime.toISOString()}`);
        console.error(`Current Time: ${now.toISOString()}`);
        process.exit(1);
    }

    await prisma.$disconnect();
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
