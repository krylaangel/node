// db.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function connectDB() {
  if (!db) {
    try {
      await client.connect();
      console.log("✅ Connected to MongoDB Atlas");
      db = client.db(process.env.DB);
    } catch (err) {
      console.error("MongoDB connection error:", err);
      throw err;
    }
  }
  return db;
}

module.exports = connectDB;
