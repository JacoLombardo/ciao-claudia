const { MongoClient } = require("mongodb");

const MONGODB_URI =
  "mongodb+srv://Claudia:Claudia1@cluster0.zt4gj7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const claudiaMessages = [
  "Oggi ho fatto una lunga passeggiata nel parco e ho incontrato tanti amici! È stata una giornata meravigliosa.",
  "Ho cucinato la mia pasta alla carbonara preferita e ho guardato un bellissimo film italiano.",
  "Ho chiamato la mia famiglia e abbiamo parlato per ore. Mi mancano così tanto!",
  "Ho letto un libro interessante e ho bevuto un caffè in piazza. La vita è bella!",
  "Oggi ho fatto shopping e ho comprato un vestito nuovo. Sono così felice!",
  "Ho suonato il pianoforte per ore. La musica mi fa sentire viva!",
  "Ho fatto yoga al mattino e poi ho preparato una torta per i miei amici.",
  "Ho visitato un museo e ho scoperto opere d'arte incredibili. L'arte mi ispira sempre!",
  "Ho scritto nel mio diario e ho riflettuto sulla vita. È importante prendersi del tempo per sé.",
  "Ho fatto volontariato alla mensa dei poveri. Aiutare gli altri mi riempie il cuore di gioia.",
  "Ho imparato a suonare una nuova canzone alla chitarra. La musica è la mia passione!",
  "Ho fatto una gita in campagna e ho raccolto fiori selvatici. La natura è così bella!",
  "Ho organizzato una cena con i miei amici più cari. L'amicizia è un tesoro prezioso!",
  "Ho dipinto un quadro e ho espresso le mie emozioni attraverso l'arte.",
  "Ho fatto una corsa al mattino e mi sono sentita piena di energia per tutto il giorno.",
  "Ho studiato una nuova lingua. Imparare cose nuove mi entusiasma sempre!",
  "Ho fatto meditazione e ho trovato la pace interiore. La mindfulness è importante.",
  "Ho preparato una sorpresa per il compleanno di mia sorella. Amo fare felici le persone!",
  "Ho ballato nella mia stanza ascoltando la mia musica preferita. La danza mi libera!",
  "Ho scritto una poesia ispirata dalla bellezza del tramonto. La creatività scorre libera!",
];

async function populateDatabase() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const database = client.db("claudia-app");
    const collection = database.collection("messages");

    // Clear existing messages
    await collection.deleteMany({});
    console.log("Cleared existing messages");

    // Insert new messages
    const messagesToInsert = claudiaMessages.map((text) => ({ text }));
    const result = await collection.insertMany(messagesToInsert);

    console.log(`Successfully inserted ${result.insertedCount} messages`);
    console.log("Database populated successfully!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await client.close();
  }
}

populateDatabase();

