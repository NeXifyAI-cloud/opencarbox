import { nscaleClient } from "./providers/nscale.mjs";
import { deepseekClient } from "./providers/deepseek.mjs";

const DEFAULT_MODELS = {
  nscale: process.env.NSCALE_MODEL || "meta-llama/Llama-3.1-8B-Instruct",
  deepseek: process.env.DEEPSEEK_MODEL || "deepseek-chat",
};

export async function generateDiff({ system, user }) {
  const providers = [
    { name: "nscale", client: nscaleClient, model: DEFAULT_MODELS.nscale },
    { name: "deepseek", client: deepseekClient, model: DEFAULT_MODELS.deepseek },
  ];

  let lastErr;
  for (const p of providers) {
    try {
      const c = p.client();
      const resp = await c.chat.completions.create({
        model: p.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.1,
      });
      const text = resp.choices?.[0]?.message?.content?.trim() || "";
      if (!text) throw new Error(`${p.name}: empty response`);
      return { provider: p.name, model: p.model, text };
    } catch (e) {
      lastErr = e;
    }
  }

  throw lastErr || new Error("All providers failed");
}
