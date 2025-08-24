const { MongoClient } = require("mongodb");
const fs = require("fs");
const path = require("path");

// Read the stories from the two separate JSON files
const italianStoriesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../claudiate-it.json"), "utf8")
);
const englishStoriesData = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../claudiate-en.json"), "utf8")
);

// Extract the stories array from the nested structure
const italianStories = italianStoriesData.claudiate || italianStoriesData;
const englishStories = englishStoriesData.claudiate || englishStoriesData;

// MongoDB connection string - use environment variable
const MONGODB_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://Claudia:Claudia1@cluster0.zt4gj7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function populateDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = client.db("claudiate");
    const collection = db.collection("stories");

    // Clear existing stories
    await collection.deleteMany({});
    console.log("Cleared existing stories");

    // Insert Italian stories with exact structure
    const italianStoriesToInsert = italianStories.map((story, index) => ({
      id: `it-${index + 1}`,
      text: story.text,
      language: story.language,
      createdAt: new Date(),
    }));

    await collection.insertMany(italianStoriesToInsert);
    console.log(`Inserted ${italianStoriesToInsert.length} Italian stories`);

    // Insert English stories with exact structure
    const englishStoriesToInsert = englishStories.map((story, index) => ({
      id: `en-${index + 1}`,
      text: story.text,
      language: story.language,
      createdAt: new Date(),
    }));

    await collection.insertMany(englishStoriesToInsert);
    console.log(`Inserted ${englishStoriesToInsert.length} English stories`);

    // Verify the data
    const totalStories = await collection.countDocuments();
    const italianCount = await collection.countDocuments({ language: "it" });
    const englishCount = await collection.countDocuments({ language: "en" });

    console.log("\nDatabase populated successfully!");
    console.log(`Total stories: ${totalStories}`);
    console.log(`Italian stories: ${italianCount}`);
    console.log(`English stories: ${englishCount}`);

    // Show a few sample stories to verify content and structure
    console.log("\nSample Italian story structure:");
    const sampleItalian = await collection.findOne({ language: "it" });
    console.log(JSON.stringify(sampleItalian, null, 2));

    console.log("\nSample English story structure:");
    const sampleEnglish = await collection.findOne({ language: "en" });
    console.log(JSON.stringify(sampleEnglish, null, 2));
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await client.close();
    console.log("Database connection closed");
  }
}

populateDatabase();
