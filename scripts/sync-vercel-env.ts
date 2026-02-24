import 'dotenv/config';
import fetch from 'node-fetch';

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT_ID = process.env.VERCEL_PROJECT_ID;

if (!VERCEL_TOKEN || !PROJECT_ID) {
  console.error('Missing VERCEL_TOKEN or VERCEL_PROJECT_ID');
  process.exit(1);
}

const envVars = [
  { key: 'NEXT_PUBLIC_SUPABASE_URL', value: process.env.NEXT_PUBLIC_SUPABASE_URL },
  { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY },
  { key: 'SUPABASE_SERVICE_ROLE_KEY', value: process.env.SUPABASE_SERVICE_ROLE_KEY },
  { key: 'SUPABASE_ACCESS_TOKEN', value: process.env.SUPABASE_ACCESS_TOKEN },
  { key: 'DATABASE_URL', value: process.env.DATABASE_URL },
  { key: 'DIRECT_URL', value: process.env.DIRECT_URL },
  { key: 'DEEPSEEK_API_KEY', value: process.env.DEEPSEEK_API_KEY },
  { key: 'NSCALE_API_KEY', value: process.env.NSCALE_API_KEY },
  { key: 'GITHUB_TOKEN', value: process.env.GITHUB_TOKEN },
  { key: 'MEM0_API_KEY', value: process.env.MEM0_API_KEY },
  { key: 'TINYBIRD_TOKEN', value: process.env.TINYBIRD_TOKEN },
  { key: 'TINYBIRD_URL', value: process.env.TINYBIRD_URL },
  { key: 'RENDER_API_KEY', value: process.env.RENDER_API_KEY },
  { key: 'CONTEX7_API_KEY', value: process.env.CONTEX7_API_KEY },
];

async function sync() {
  for (const env of envVars) {
    if (!env.value) continue;

    console.log(`Syncing ${env.key}...`);

    // Check if exists
    const res = await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/env`, {
      headers: { Authorization: `Bearer ${VERCEL_TOKEN}` }
    });
    const { envs } = await res.json() as any;
    const existing = envs.find((e: any) => e.key === env.key);

    if (existing) {
      // Update
      await fetch(`https://api.vercel.com/v9/projects/${PROJECT_ID}/env/${existing.id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ value: env.value, target: ['production', 'preview', 'development'] })
      });
      console.log(`  Updated ${env.key}`);
    } else {
      // Create
      await fetch(`https://api.vercel.com/v10/projects/${PROJECT_ID}/env`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${VERCEL_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          key: env.key,
          value: env.value,
          type: 'encrypted',
          target: ['production', 'preview', 'development']
        })
      });
      console.log(`  Created ${env.key}`);
    }
  }
}

sync().catch(console.error);
