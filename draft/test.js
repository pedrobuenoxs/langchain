import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms";

const model = new OpenAI({});
const memories = new Map();

function getMemoryForUser(userId) {
  if (!memories.has(userId)) {
    memories.set(userId, new BufferMemory());
  }
  return memories.get(userId);
}

const chain = new ConversationChain({
  llm: model,
  memory: (input) => getMemoryForUser(input.userId),
});

const user1 = { userId: "user1", input: "Hi, how are you?" };
const user2 = { userId: "user2", input: "What's your favorite color?" };

const res1 = await chain.call(user1);
console.log(res1.response); // "Hello! I'm doing well, thanks for asking. How can I help you today?"

const res2 = await chain.call(user2);
console.log(res2.response); // "My favorite color is blue. What else would you like to know?"
