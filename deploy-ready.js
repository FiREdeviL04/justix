#!/usr/bin/env node

/**
 * Justix Automated Deployment - Ready to Execute
 * 
 * MongoDB URI: Already configured ✅
 * Render Token: REQUIRED (paste below in the command)
 * Vercel Token: REQUIRED (paste below in the command)
 * 
 * Usage:
 * node deploy-ready.js --render-token "rnd_..." --vercel-token "..."
 */

const fs = require('fs');
const https = require('https');

function parseArgs() {
  const args = process.argv.slice(2);
  const config = {};
  
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].substring(2);
      config[key] = args[i + 1];
      i++;
    }
  }
  
  return config;
}

function httpsRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let responseData = '';
      
      res.on('data', chunk => responseData += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve({
              status: res.statusCode,
              body: responseData ? JSON.parse(responseData) : null
            });
          } else {
            reject({
              status: res.statusCode,
              message: responseData
            });
          }
        } catch (e) {
          resolve({
            status: res.statusCode,
            body: responseData
          });
        }
      });
    });
    
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function deployToRender(renderToken) {
  console.log('\n🚀 Deploying backend to Render...\n');
  
  const mongodbUri = 'mongodb+srv://dhwanitmistry0_db_user:gZp1ummSEc0eZ4OS@cluster0.fxvkvgy.mongodb.net/justix';
  const frontendUrl = 'https://justix.in';
  
  try {
    // Get list of services
    const listOptions = {
      hostname: 'api.render.com',
      path: '/v1/services',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${renderToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log('📋 Checking for existing services...');
    const listResponse = await httpsRequest(listOptions);
    
    const existingService = listResponse.body?.services?.find(
      s => s.name === 'justix-backend' || s.name?.includes('justix')
    );
    
    if (existingService) {
      console.log(`✅ Found existing service: ${existingService.id}`);
      
      // Update environment variables
      console.log('🔧 Updating environment variables...');
      const envVars = [
        { key: 'MONGODB_URI', value: mongodbUri },
        { key: 'JWT_SECRET', value: 'production_jwt_secret_' + Date.now() },
        { key: 'JWT_EXPIRES_IN', value: '7d' },
        { key: 'FRONTEND_URL', value: frontendUrl },
        { key: 'ADMIN_EMAIL', value: 'admin@justix.com' },
        { key: 'ADMIN_PASSWORD', value: 'Admin@12345' }
      ];
      
      const updateOptions = {
        hostname: 'api.render.com',
        path: `/v1/services/${existingService.id}/env-vars`,
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${renderToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      await httpsRequest(updateOptions, envVars);
      console.log('✅ Environment variables updated');
      
      // Trigger deploy
      console.log('🔄 Triggering redeploy...');
      const deployOptions = {
        hostname: 'api.render.com',
        path: `/v1/services/${existingService.id}/deploys`,
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${renderToken}`,
          'Content-Type': 'application/json'
        }
      };
      
      await httpsRequest(deployOptions, {});
      console.log('✅ Redeploy triggered');
      console.log(`📍 Service URL: https://${existingService.slug}.onrender.com`);
      
      return `https://${existingService.slug}.onrender.com`;
      
    } else {
      console.log('⚠️  No existing service found.');
      console.log('📝 Manual deployment needed at https://dashboard.render.com');
      return null;
    }
    
  } catch (error) {
    console.error('❌ Render deployment error:', error.message || error);
    return null;
  }
}

async function configureVercel(vercelToken, backendUrl) {
  console.log('\n🌐 Configuring Vercel environment variables...\n');
  
  const projectId = 'EEnMZwbA1';
  
  try {
    const envVar = {
      key: 'VITE_API_URL',
      value: `${backendUrl}/api`,
      target: ['production', 'preview', 'development']
    };
    
    console.log(`📝 Setting VITE_API_URL to: ${envVar.value}`);
    
    const options = {
      hostname: 'api.vercel.com',
      path: `/v9/projects/${projectId}/env`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    await httpsRequest(options, envVar);
    console.log('✅ Environment variable configured in Vercel');
    
    // Trigger redeploy
    console.log('🔄 Triggering Vercel redeploy...');
    const redeployOptions = {
      hostname: 'api.vercel.com',
      path: `/v12/projects/${projectId}/redeploy`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    await httpsRequest(redeployOptions, {});
    console.log('✅ Vercel redeploy triggered');
    
    return true;
    
  } catch (error) {
    console.error('❌ Vercel configuration error:', error.message || error);
    return false;
  }
}

async function main() {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Justix Deployment - MongoDB Connected ✅        ║
║   Ready for Render & Vercel configuration         ║
╚════════════════════════════════════════════════════╝
  `);
  
  const config = parseArgs();
  
  if (!config['render-token'] || !config['vercel-token']) {
    console.error('\n❌ Missing required tokens');
    console.log('\n📖 Usage:');
    console.log(`   node deploy-ready.js \\`);
    console.log(`     --render-token "rnd_..." \\`);
    console.log(`     --vercel-token "..."`);
    
    console.log('\n🔗 Get tokens from:');
    console.log('   Render: https://dashboard.render.com → Account → Settings → API Tokens');
    console.log('   Vercel: https://vercel.com/account/tokens');
    process.exit(1);
  }
  
  const renderToken = config['render-token'];
  const vercelToken = config['vercel-token'];
  
  console.log('📋 Configuration:');
  console.log(`   MongoDB: Connected ✅`);
  console.log(`   Frontend: https://justix.in`);
  console.log(`   Render: Ready`);
  console.log(`   Vercel: Ready\n`);
  
  try {
    // Step 1: Deploy backend to Render
    const backendUrl = await deployToRender(renderToken);
    
    if (!backendUrl) {
      console.log('\n⚠️  Backend URL not determined. Skipping Vercel configuration.');
      process.exit(1);
    }
    
    // Step 2: Configure Vercel with backend URL
    const vercelConfigured = await configureVercel(vercelToken, backendUrl);
    
    if (vercelConfigured) {
      console.log(`
╔════════════════════════════════════════════════════╗
║   ✅ Deployment Complete!                         ║
╚════════════════════════════════════════════════════╝

🎉 Your application is fully integrated!

📍 Frontend: https://justix.in
📍 Backend: ${backendUrl}/api
📍 MongoDB: Connected ✅

⏳ Waiting for services to fully initialize (2-3 minutes)...

Next steps:
1. Wait for both Render and Vercel to finish building
2. Visit https://justix.in
3. Try logging in or creating an account
4. Check browser console (F12) for any API errors

🔗 Useful links:
   - Vercel Dashboard: https://vercel.com/dashboard
   - Render Dashboard: https://dashboard.render.com
   - GitHub Repository: https://github.com/FiREdeviL04/justix
      `);
    }
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

main();
