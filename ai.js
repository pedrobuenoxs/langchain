//path: src/ai.js
import "./src/config/config.js";
console.log(process.env.PINECONE_INDEX_NAME);
import readline from "readline";
import chain from "./src/chain/makeChain.js";
import { createVectorStore } from "./src/vector/makeVector.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// const assemblyChain = async () => {
//   const vectorStore = await createVectorStore(
//     process.env.PINECONE_INDEX_NAME,
//     process.env.PINECONE_NAME_SPACE
//   );

//   return makeChain(vectorStore);
// };

function askQuestion() {
  rl.question("You: ", async (input) => {
    if (input.toLowerCase() === "exit") {
      rl.close();
    } else {
      const response = await chain.call({
        input,
        chat_history: [],
      });
      console.log("AI: ", response.output);
      askQuestion();
    }
  });
}

console.log("Type 'exit' to end the conversation.");
askQuestion();
