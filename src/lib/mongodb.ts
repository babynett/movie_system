// lib/mongodb.ts (or wherever you store helpers)
import { MongoClient, ServerApiVersion } from "mongodb";

const uri =
  "mongodb+srv://eyaftorreta25:LHahAkosjNB46QC3@mongopractice.rzme5ds.mongodb.net/?retryWrites=true&w=majority&appName=mongopractice";

if (!uri) throw new Error("Please define your MongoDB URI");

const options = {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

// Reuse client in dev (Next.js hot reload)
declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;
