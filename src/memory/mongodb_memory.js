// File: mongodb_memory.js

import { MongoClient } from "mongodb";
import { BufferMemory } from "langchain/memory";
const uri =
  "mongodb+srv://chatuser:chat123@botbuilder.90fsdqg.mongodb.net/?retryWrites=true&w=majority";

class MongoDBMemory extends BufferMemory {
  constructor(fields) {
    super(fields);
  }

  async loadMemoryVariables(_values) {
    let history = "";
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      const collection = client.db("chatbot").collection("memory");
      const existingVariables = await collection.findOne({
        memoryKey: this.memoryKey,
      });

      const inputHistory = existingVariables?.inputHistory || [];
      const outputHistory = existingVariables?.outputHistory || [];

      inputHistory.forEach((input, index) => {
        history = history + "Human: " + JSON.stringify(input) + "\n";
        history =
          history + "AI: " + JSON.stringify(outputHistory[index]) + "\n";
      });
      return {
        history,
      };
    } finally {
      await client.close();
    }
  }

  async saveContext(inputValues, outputValues) {
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await client.connect();
      const collection = client.db("chatbot").collection("memory");
      const existingVariables = await collection.findOne({
        memoryKey: this.memoryKey,
      });

      const inputHistory = existingVariables?.inputHistory || [];
      const outputHistory = existingVariables?.outputHistory || [];
      inputHistory.push(inputValues);
      outputHistory.push(outputValues);

      await collection.updateOne(
        { memoryKey: this.memoryKey },
        { $set: { inputHistory, outputHistory } },
        { upsert: true }
      );
    } finally {
      await client.close();
    }
  }
}

export { MongoDBMemory };
