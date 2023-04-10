import { OpenAI } from "langchain/llms";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OpenAI Credentials");
}
const openai = new OpenAI({
  temperature: 0,
});

export default openai;
