const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

const MONGODB_URI =
  "mongodb+srv://Claudia:Claudia1@cluster0.zt4gj7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function populateClaudiateCollection() {
  const client = new MongoClient(MONGODB_URI);

  try {
    // Read the claudiate.json file
    const claudiatePath = path.join(__dirname, "..", "claudiate.json");
    const claudiateData = JSON.parse(fs.readFileSync(claudiatePath, "utf8"));

    console.log("Read claudiate.json file");
    console.log(`Found ${claudiateData.claudiate.length} phrases`);

    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("claudia-app");
    const collection = database.collection("claudiate");

    // Clear existing claudiate messages
    await collection.deleteMany({});
    console.log("Cleared existing claudiate messages");

    // Insert new claudiate messages
    const messagesToInsert = claudiateData.claudiate.map((phrase) => ({
      text: phrase,
      claudiate: phrase,
    }));

    const result = await collection.insertMany(messagesToInsert);

    console.log(
      `Successfully inserted ${result.insertedCount} claudiate phrases`
    );
    console.log("Claudiate collection populated successfully!");

    // Show a few examples
    console.log("\nExamples of inserted phrases:");
    claudiateData.claudiate.slice(0, 3).forEach((phrase, index) => {
      console.log(`${index + 1}. ${phrase.substring(0, 100)}...`);
    });
  } catch (error) {
    console.error("Error populating claudiate collection:", error);
  } finally {
    await client.close();
  }
}

populateClaudiateCollection();

