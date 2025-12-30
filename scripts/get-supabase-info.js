require('dotenv').config({ path: '.env' });

async function getProjectInfo() {
  const projectRef = process.env.PROJECT_ID || 'acclrhzzwdutbigxsxyq';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = `https://api.supabase.com/v1/projects/${projectRef}`;

  console.log('Fetching project info from:', url);
  
  try {
    // Dynamischer Import für node-fetch (ESM)
    const { default: fetch } = await import('node-fetch');
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${serviceRoleKey}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('API error:', response.status, response.statusText);
      const text = await response.text();
      console.error('Response:', text);
      return null;
    }

    const data = await response.json();
    console.log('Project info:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching project info:', error.message);
    return null;
  }
}

getProjectInfo();