import { SerpAPI, Calculator, ChainTool } from "langchain/tools";
import qaTool from "./makeQaTool.js";
const tools = [new SerpAPI(), new Calculator(), await qaTool()];

export default tools;
