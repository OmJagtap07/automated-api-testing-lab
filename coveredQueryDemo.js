/**
 * coveredQueryDemo.js
 * Demonstrates the difference between a non-covered and covered query in MongoDB.
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = "covered_query_lab";
const COLLECTION_NAME = "users";
const TARGET_EMAIL = "user00000@gmail.com";

function extractStages(inputStage) {
    const stages = [];
    let cur = inputStage;
    while (cur) {
        stages.push(cur.stage);
        cur = cur.inputStage || null;
    }
    return stages.reverse();
}

async function run() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        const db = client.db(DB_NAME);
        const col = db.collection(COLLECTION_NAME);

        // ── STEP 1: Document count ───────────────────────────────────────────────
        const count = await col.countDocuments();
        console.log("═══════════════════════════════════════════════════════");
        console.log(`  STEP 1 — Document Count: ${count}`);
        console.log("═══════════════════════════════════════════════════════\n");

        // ── STEP 2: Single-field index (not covered) ─────────────────────────────
        await col.dropIndexes();
        await col.createIndex({ email: 1 });
        console.log("  INDEX CREATED:  { email: 1 }");

        const notCoveredExplain = await col
            .find({ email: TARGET_EMAIL }, { projection: { username: 1 } })
            .explain("executionStats");

        const stats2 = notCoveredExplain.executionStats;
        const stages2 = extractStages(
            notCoveredExplain.executionStats.executionStages
        );
        console.log("\n═══════════════════════════════════════════════════════");
        console.log("  STEP 2 — Non-Covered Query (FETCH stage present)");
        console.log("═══════════════════════════════════════════════════════");
        console.log("  Stages:", stages2.join(" → "));
        console.log("  totalDocsExamined:", stats2.totalDocsExamined);
        console.log("  totalKeysExamined:", stats2.totalKeysExamined);
        console.log("  nReturned:", stats2.nReturned);
        console.log(
            "\n  Full executionStages snapshot:",
            JSON.stringify(notCoveredExplain.executionStats.executionStages, null, 2)
        );

        // ── STEP 3: Compound index (covered) ─────────────────────────────────────
        await col.dropIndexes();
        await col.createIndex({ email: 1, username: 1 });
        console.log("\n  INDEX CREATED:  { email: 1, username: 1 }");

        const coveredExplain = await col
            .find(
                { email: TARGET_EMAIL },
                { projection: { username: 1, _id: 0 } }
            )
            .explain("executionStats");

        const stats3 = coveredExplain.executionStats;
        const stages3 = extractStages(
            coveredExplain.executionStats.executionStages
        );
        console.log("\n═══════════════════════════════════════════════════════");
        console.log("  STEP 3 — Covered Query (PROJECTION_COVERED, no FETCH)");
        console.log("═══════════════════════════════════════════════════════");
        console.log("  Stages:", stages3.join(" → "));
        console.log("  totalDocsExamined:", stats3.totalDocsExamined);
        console.log("  totalKeysExamined:", stats3.totalKeysExamined);
        console.log("  nReturned:", stats3.nReturned);
        console.log(
            "\n  Full executionStages snapshot:",
            JSON.stringify(coveredExplain.executionStats.executionStages, null, 2)
        );
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await client.close();
    }
}

run();
