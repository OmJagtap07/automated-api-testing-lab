/**
 * seedUsers.js
 * Seeds the MongoDB database with 10,000+ user documents
 * for the Covered Query Optimization Lab.
 */

require("dotenv").config();
const { MongoClient } = require("mongodb");

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = "covered_query_lab";
const COLLECTION_NAME = "users";
const TOTAL_DOCS = 10000;
const BATCH_SIZE = 500;

const statuses = ["active", "inactive", "banned", "pending"];
const domains = ["gmail.com", "yahoo.com", "outlook.com", "hotmail.com", "example.com"];

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateDocument(i) {
    const pad = String(i).padStart(5, "0");
    const domain = domains[i % domains.length];
    return {
        email: `user${pad}@${domain}`,
        username: `user_${pad}`,
        age: randomInt(18, 65),
        status: statuses[i % statuses.length],
        createdAt: new Date(Date.now() - randomInt(0, 365 * 24 * 60 * 60 * 1000)),
    };
}

async function seed() {
    const client = new MongoClient(MONGO_URI);
    try {
        await client.connect();
        console.log("✅ Connected to MongoDB");

        const db = client.db(DB_NAME);
        const collection = db.collection(COLLECTION_NAME);

        // Drop existing collection for a clean run
        await collection.drop().catch(() => { });
        console.log(`📋 Collection '${COLLECTION_NAME}' cleared.`);

        let inserted = 0;
        for (let i = 0; i < TOTAL_DOCS; i += BATCH_SIZE) {
            const batch = [];
            for (let j = i; j < Math.min(i + BATCH_SIZE, TOTAL_DOCS); j++) {
                batch.push(generateDocument(j));
            }
            await collection.insertMany(batch);
            inserted += batch.length;
            process.stdout.write(`\r⏳ Inserted ${inserted}/${TOTAL_DOCS} documents...`);
        }

        const count = await collection.countDocuments();
        console.log(`\n✅ Done! Total documents in collection: ${count}`);
    } catch (err) {
        console.error("❌ Error:", err);
    } finally {
        await client.close();
    }
}

seed();
