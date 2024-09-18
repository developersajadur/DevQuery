const { MongoClient, ServerApiVersion } = require('mongodb');
let db;

export const ConnectDB = async () => {
  if (db) return db;

  try {
    const uri = process.env.NEXT_PUBLIC_MONGODB_URI ;
    if (!uri) {
      throw new Error("MongoDB URI is not defined in environment variables");
    }
    
    console.log(`Connecting to MongoDB at: ${uri}`);
    const client = new MongoClient(uri, {
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      }
    });
    await client.connect();
    db = client.db("Dev-Query");
    console.log("Connected to MongoDB");
    return db;
    
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
