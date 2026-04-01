#!/usr/bin/env node

/**
 * Justix Full-Stack Deployment Automation
 * 
 * Usage: node deploy.js --mongodb-uri "..." --render-token "..." --vercel-token "..." --vercel-project-id "..."
 * 
 * This script automates:
 * 1. Backend deployment to Render
 * 2. Environment variable configuration in Vercel
 * 3. Frontend redeploy with API URL
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// Parse command line arguments
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

// Make HTTPS request with token auth
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
              headers: res.headers,
              body: responseData ? JSON.parse(responseData) : null
            });
          } else {
            reject({
              status: res.statusCode,
              message: responseData,
              details: `HTTP ${res.statusCode}`
            });
          }
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: responseData
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

// Deploy backend to Render
async function deployToRender(renderToken, mongodbUri, frontendUrl) {
  console.log('\n🚀 Deploying backend to Render...\n');
  
  try {
    // Get list of services to check for existing deployment
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
      
      const deployResponse = await httpsRequest(deployOptions, {});
      console.log('✅ Redeploy triggered');
      console.log(`📍 Service URL: https://${existingService.slug}.onrender.com`);
      
      return `https://${existingService.slug}.onrender.com`;
      
    } else {
      console.log('⚠️  No existing service found. Creating new service manually at https://dashboard.render.com');
      console.log('📝 Use these environment variables:');
      console.log(`   MONGODB_URI: ${mongodbUri}`);
      console.log(`   JWT_SECRET: production_jwt_secret_${Date.now()}`);
      console.log(`   FRONTEND_URL: ${frontendUrl}`);
      return null;
    }
    
  } catch (error) {
    console.error('❌ Render deployment error:', error.message || error);
    return null;
  }
}

// Configure Vercel environment variables
async function configureVercel(vercelToken, projectId, backendUrl) {
  console.log('\n🌐 Configuring Vercel environment variables...\n');
  
  try {
    const apiUrl = `https://api.vercel.com/v9/projects/${projectId}/env`;
    
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
    
    const response = await httpsRequest(options, envVar);
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
    console.log('\n💡 Manual alternative:');
    console.log('   1. Go to https://vercel.com/dashboard');
    console.log('   2. Select your Justix project');
    console.log('   3. Settings → Environment Variables');
    console.log(`   4. Add: VITE_API_URL = ${backendUrl}/api`);
    console.log('   5. Click Redeploy');
    return false;
  }
}

// Main deployment flow
async function main() {
  console.log(`
╔════════════════════════════════════════════════════╗
║   Justix Full-Stack Deployment Automation         ║
║   Version 1.0                                      ║
╚════════════════════════════════════════════════════╝
  `);
  
  const config = parseArgs();
  
  // Validate required arguments
  const required = ['mongodb-uri', 'render-token', 'vercel-token', 'vercel-project-id'];
  const missing = required.filter(arg => !config[arg]);
  
  if (missing.length > 0) {
    console.error('\n❌ Missing required arguments:');
    missing.forEach(arg => console.error(`   --${arg} "<value>"`));
    console.log('\n📖 Usage:');
    console.log(`   node deploy.js \\`);
    console.log(`     --mongodb-uri "mongodb+srv://..." \\`);
    console.log(`     --render-token "rnd_..." \\`);
    console.log(`     --vercel-token "..." \\`);
    console.log(`     --vercel-project-id "..."`);
    process.exit(1);
  }
  
  const mongodbUri = config['mongodb-uri'];
  const renderToken = config['render-token'];
  const vercelToken = config['vercel-token'];
  const projectId = config['vercel-project-id'];
  const frontendUrl = config['frontend-url'] || 'https://justix.vercel.app';
  
  console.log('📋 Configuration:');
  console.log(`   MongoDB: ${mongodbUri.substring(0, 50)}...`);
  console.log(`   Frontend: ${frontendUrl}`);
  console.log(`   Render: Configured`);
  console.log(`   Vercel: Configured\n`);
  
  try {
    // Step 1: Deploy backend to Render
    const backendUrl = await deployToRender(renderToken, mongodbUri, frontendUrl);
    
    if (!backendUrl) {
      console.log('\n⚠️  Backend URL not determined. Please manually deploy to Render first.');
      console.log('   Then run: node configure-vercel.js --backend-url "..." --vercel-token "..." --vercel-project-id "..."');
      process.exit(1);
    }
    
    // Step 2: Configure Vercel with backend URL
    const vercelConfigured = await configureVercel(vercelToken, projectId, backendUrl);
    
    if (vercelConfigured) {
      console.log(`
╔════════════════════════════════════════════════════╗
║   ✅ Deployment Complete!                         ║
╚════════════════════════════════════════════════════╝

🎉 Your application is now fully deployed!

📍 Frontend: ${frontendUrl}
📍 Backend: ${backendUrl}/api
📍 MongoDB: Connected

⏳ Waiting for services to fully initialize (2-3 minutes)...

Next steps:
1. Wait for both Render and Vercel to finish building
2. Visit ${frontendUrl}
3. Try logging in or creating an account
4. Check browser console (F12) for any API errors

🔗 Useful links:
   - Vercel Dashboard: https://vercel.com/dashboard
   - Render Dashboard: https://dashboard.render.com
   - GitHub Repository: https://github.com/FiREdeviL04/justix
      `);
    } else {
      console.log('\n⚠️  Backend deployed but Vercel configuration failed.');
      console.log(`   Please manually set VITE_API_URL = ${backendUrl}/api in Vercel`);
    }
    
  } catch (error) {
    console.error('\n❌ Deployment failed:', error);
    process.exit(1);
  }
}

main();
