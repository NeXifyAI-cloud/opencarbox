import { nscaleClient } from "./providers/nscale.mjs";
import { deepseekClient } from "./providers/deepseek.mjs";

export async function generateDiff({ system, user }) {
  const providers = [
    { name: "nscale", client: nscaleClient, model: process.env.NSCALE_MODEL },
    { name: "deepseek", client: deepseekClient, model: process.env.DEEPSEEK_MODEL || "deepseek-chat" }
  ].filter(p => p.model);

  if (!providers.length) {
    throw new Error("No models configured. Set NSCALE_MODEL and/or DEEPSEEK_MODEL.");
  }

  let lastErr;
  for (const p of providers) {
    try {
      const c = p.client();
      const resp = await c.chat.completions.create({
        model: p.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.1
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
