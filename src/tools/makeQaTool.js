import { OpenAI } from "langchain";
import { SerpAPI, Calculator, ChainTool } from "langchain/tools";
import { VectorDBQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores";
import { OpenAIEmbeddings } from "langchain/embeddings";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { fileURLToPath } from "url";
import { dirname } from "path";
import * as fs from "fs";

const qaTool = async () => {
  try {
    const model = new OpenAI({ temperature: 0 });
    /* Load in the file we want to do question answering over */

    const __dirname = dirname(fileURLToPath(import.meta.url));
    const text = fs.readFileSync(`${__dirname}/user.txt`, {
      encoding: "utf8",
      flag: "r",
    });

    /* Split the text into chunks */
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
    });
    const docs = await textSplitter.createDocuments([text]);
    /* Create the vectorstore */
    const vectorStore = await HNSWLib.fromDocuments(
      docs,
      new OpenAIEmbeddings()
    );
    /* Create the chain */
    const chain = VectorDBQAChain.fromLLM(model, vectorStore);
    return new ChainTool({
      name: "user-qa",
      description:
        "User QA - useful for when you need to ask questions about the user.",
      chain: chain,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default qaTool;
