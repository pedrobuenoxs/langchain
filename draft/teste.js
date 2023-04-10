import { OpenAI } from "langchain/llms";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { CharacterTextSplitter } from "langchain/text_splitter";
import * as fs from "fs";
import { config } from "dotenv";
import { BufferMemory } from "langchain/memory";
config();

export const run = async () => {
  /* Initialize the LLM to use to answer the question */
  const model = new OpenAI({
    temperature: 1,
    modelName: "gpt-3.5-turbo",
    streaming: true,
  });
  const memory = new BufferMemory();
  /* Load in the file we want to do question answering over */
  const text = fs.readFileSync("teste.txt", "utf8");
  /* Split the text into chunks */
  const textSplitter = new CharacterTextSplitter({ separator: " " });
  const docs = await textSplitter.createDocuments([text]);
  /* Create the vectorstore */
  const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());
  /* Create the chain */

  const options = {};

  const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    options
  );
  console.log(memory);
  chain.memory = memory;
  /* Ask it a question */
  const question = "provide user information";
  const res = await chain.call({ question });
  console.log(res);
  /* Ask it a follow up question */
  const followUpRes = await chain.call({
    question: "Do you know anything else about me?",
  });
  console.log(followUpRes);
};

run();
