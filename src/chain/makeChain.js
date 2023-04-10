import { initializeAgentExecutor } from "langchain/agents";
import tools from "../tools/index.js";
import model from "../model/LLM-openai.js";

const chain = await initializeAgentExecutor(
  tools,
  model,
  "zero-shot-react-description"
);

export default chain;
