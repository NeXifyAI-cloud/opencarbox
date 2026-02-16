#!/usr/bin/env node

const allowedModes = new Set(["ci", "ai", "oracle", "deploy"]);

function must(name) {
  const value = (process.env[name] || "").trim();
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function optional(name) {
  return (process.env[name] || "").trim();
}

function main() {
  const mode = process.argv[2] || "ci";

  if (!allowedModes.has(mode)) {
    throw new Error(`Unknown preflight mode: ${mode}`);
  }

  if (mode === "ci") {
    console.log("Preflight(ci): OK");
    return;
  }

  if (mode === "ai") {
    const provider = must("AI_PROVIDER");
    if (provider !== "deepseek") {
      throw new Error("AI_PROVIDER must be deepseek");
    }

    must("DEEPSEEK_API_KEY");
    must("NSCALE_API_KEY");
    optional("DEEPSEEK_BASE_URL");
    optional("NSCALE_HEADER_NAME");

    console.log("Preflight(ai): OK");
    return;
  }

  if (mode === "oracle") {
    must("NEXT_PUBLIC_SUPABASE_URL");
    must("SUPABASE_SERVICE_ROLE_KEY");

    console.log("Preflight(oracle): OK");
    return;
  }

  if (mode === "deploy") {
    must("VERCEL_TOKEN");
    must("VERCEL_PROJECT_ID");

    console.log("Preflight(deploy): OK");
  }
}

main();
