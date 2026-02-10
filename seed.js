import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import User from "./models/User.js";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://beatHubUser:Omjagtap%406419@beathub.kyybgl1.mongodb.net/?appName=BeatHub";
const NUM_USERS = 500; // DO NOT CHANGE
const BATCH_SIZE = 100;

async function connectDB() {
  // TODO: connect to MongoDB using mongoose
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
}

function generateFakeUser() {
  // TODO: return one fake user object matching the User schema

  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    email: faker.internet.email(),
    username: faker.internet.userName(),
    password: faker.internet.password(8),
    dateOfBirth: faker.date.birthdate({ min: 18, max: 40, mode: "age" }),
    isActive: true,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state(),
      zipCode: faker.location.zipCode(),
      country: faker.location.country()
    }
  };
}

async function seedDatabase() {
  // TODO:
  // 1. Delete all existing users
  // 2. Insert 500 users in batches of 100
  // 3. Log progress to the console

  await User.deleteMany({});
  console.log("Existing users deleted");

  for (let i = 0; i < NUM_USERS; i += BATCH_SIZE) {
    const users = [];

    for (let j = 0; j < BATCH_SIZE; j++) {
      users.push(generateFakeUser());
    }

    await User.insertMany(users);
    console.log(`Inserted ${i + BATCH_SIZE} users`);
  }

  console.log("All users seeded successfully");
}

async function main() {
  await connectDB();
  await seedDatabase();
  await mongoose.disconnect();
  console.log("Database disconnected.");
}

main().catch(console.error);
