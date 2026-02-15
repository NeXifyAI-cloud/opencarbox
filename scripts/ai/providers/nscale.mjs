import OpenAI from "openai";

export function nscaleClient() {
  const apiKey = process.env.NSCALE_API_KEY;
  const baseURL = process.env.NSCALE_BASE_URL || "https://inference.api.nscale.com/v1";
  if (!apiKey) throw new Error("NSCALE_API_KEY missing");
  return new OpenAI({ apiKey, baseURL });
}
