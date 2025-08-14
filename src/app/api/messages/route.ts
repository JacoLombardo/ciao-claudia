import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

// MongoDB connection string from environment variable
const MONGODB_URI = `mongodb+srv://Claudia:${process.env.MONGODB_KEY}@cluster0.zt4gj7q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Fallback messages in case database connection fails
const fallbackMessages = [
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

async function connectToMongoDB() {
  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  return client;
}

async function getMessageFromDatabase() {
  const client = await connectToMongoDB();
  try {
    const database = client.db("claudia-app");

    // Try to get from the claudiate collection first (your new collection)
    let collection = database.collection("claudiate");
    let messages = await collection
      .aggregate([{ $sample: { size: 1 } }])
      .toArray();

    // If claudiate collection is empty or doesn't exist, try the messages collection
    if (messages.length === 0) {
      collection = database.collection("messages");
      messages = await collection
        .aggregate([{ $sample: { size: 1 } }])
        .toArray();
    }

    // If no messages in database, return a random message from our fallback array
    if (messages.length === 0) {
      return fallbackMessages[
        Math.floor(Math.random() * fallbackMessages.length)
      ];
    }

    // Return the message text, or fallback if no text field
    return (
      messages[0]?.text ||
      messages[0]?.claudiate ||
      messages[0] ||
      fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)]
    );
  } finally {
    await client.close();
  }
}

export async function GET() {
  try {
    // Get a message from the MongoDB database
    const message = await getMessageFromDatabase();

    return NextResponse.json({
      message: message,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching message:", error);

    // Fallback to local messages if database connection fails
    const fallbackMessage =
      fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];

    return NextResponse.json({
      message: fallbackMessage,
      timestamp: new Date().toISOString(),
    });
  }
}
