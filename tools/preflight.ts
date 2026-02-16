#!/usr/bin/env node
// @ts-nocheck
/** @param {string} name */
const must = (name) => {
  const v = (process.env[name] || '').trim();
  if (!v) throw new Error(`Missing required env: ${name}`);
  return v;
};

const main = () => {
  const mode = process.argv[2] || 'ci';

  if (mode === 'ci') {
    console.log('Preflight(ci): OK (no secrets required).');
    return;
  }

  if (mode === 'ai') {
    if (must('AI_PROVIDER') !== 'deepseek') throw new Error('AI_PROVIDER must be deepseek');
    must('DEEPSEEK_API_KEY');
    must('NSCALE_API_KEY');
    console.log('Preflight(ai): OK');
    return;
  }

  if (mode === 'oracle') {
    must('NEXT_PUBLIC_SUPABASE_URL');
    must('SUPABASE_SERVICE_ROLE_KEY');
    console.log('Preflight(oracle): OK');
    return;
  }

  if (mode === 'deploy') {
    must('VERCEL_TOKEN');
    must('VERCEL_PROJECT_ID');
    console.log('Preflight(deploy): OK');
    return;
  }

  if (mode === 'ops') {
    must('GH_PAT');
    console.log('Preflight(ops): OK');
    return;
  }

  throw new Error(`Unknown preflight mode: ${mode}`);
};

main();
