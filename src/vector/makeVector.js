import { OpenAIEmbeddings } from "langchain/embeddings";
import { PineconeStore } from "langchain/vectorstores";
import { pinecone } from "./pinecone-client.js";

/* create vectorstore*/
const createVectorStore = async (indexName, namespace) => {
  const index = pinecone.Index(indexName);
  return await PineconeStore.fromExistingIndex(new OpenAIEmbeddings({}), {
    pineconeIndex: index,
    textKey: "text",
    namespace: namespace,
  });
};

// const index = pinecone.Index(PINECONE_INDEX_NAME);
// const vectorStore = await PineconeStore.fromExistingIndex(
//   new OpenAIEmbeddings({}),
//   {
//     pineconeIndex: index,
//     textKey: "text",
//     namespace: PINECONE_NAME_SPACE,
//   }
// );

export { createVectorStore };
