import OpenAI from "openai";

export function deepseekClient() {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com";
  if (!apiKey) throw new Error("DEEPSEEK_API_KEY missing");
  return new OpenAI({ apiKey, baseURL });
}
