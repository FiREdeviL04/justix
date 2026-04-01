#!/usr/bin/env node

/**
 * Justix Deployment Setup Verification
 * Checks that all code and configuration is ready for deployment
 */

const fs = require('fs');
const path = require('path');

const checks = [];

function check(name, condition, pasMsg = '✅', failMsg = '❌') {
  const status = condition ? pasMsg : failMsg;
  console.log(`${status} ${name}`);
  checks.push({ name, passed: condition });
}

console.log(`
╔════════════════════════════════════════════════════╗
║   Justix Deployment Readiness Check               ║
╚════════════════════════════════════════════════════╝
`);

// Check frontend
console.log('\n📦 Frontend Setup:');
check('Frontend package.json exists', fs.existsSync('frontend/package.json'));
check('Frontend vercel.json exists', fs.existsSync('frontend/vercel.json'));
check('Frontend vite.config.js exists', fs.existsSync('frontend/vite.config.js'));
check('API client configured', fs.existsSync('frontend/src/api/client.js'));

// Check backend
console.log('\n🔧 Backend Setup:');
check('Backend package.json exists', fs.existsSync('backend/package.json'));
check('Backend server.js exists', fs.existsSync('backend/src/server.js'));
check('MongoDB config exists', fs.existsSync('backend/src/config/db.js'));
check('Render YAML config exists', fs.existsSync('backend/render.yaml'));
check('.env.example exists', fs.existsSync('backend/.env.example'));
check('.env.production exists', fs.existsSync('backend/.env.production'));

// Check deployment
console.log('\n🚀 Deployment Setup:');
check('Root vercel.json exists', fs.existsSync('vercel.json'));
check('Deploy script exists', fs.existsSync('deploy.js'));
check('Documentation exists', fs.existsSync('BACKEND_DEPLOYMENT_GUIDE.md'));

// Check git
console.log('\n📝 Git Status:');
check('Git repository initialized', fs.existsSync('.git'));
check('GitHub remote configured', fs.existsSync('.git/config'));

// Check environment
console.log('\n⚙️  Environment Check:');
const hasFrontend = fs.existsSync('frontend/package.json');
const hasBackend = fs.existsSync('backend/package.json');
check('Monorepo structure correct', hasFrontend && hasBackend);

const nodeVersion = process.version;
const [major] = nodeVersion.match(/\d+/);
check(`Node.js version (v${major})`, major >= 16);

// Summary
const passed = checks.filter(c => c.passed).length;
const total = checks.length;
const percentage = Math.round((passed / total) * 100);

console.log(`
╔════════════════════════════════════════════════════╗
║   Setup Status: ${passed}/${total} (${percentage}%)                  ║
╚════════════════════════════════════════════════════╝
`);

if (passed === total) {
  console.log('\n✅ Everything is ready for deployment!');
  console.log('\n📚 Next steps:');
  console.log('   1. Get MongoDB connection string (MongoDB Atlas)');
  console.log('   2. Get Render API token (dashboard → Account Settings)');
  console.log('   3. Get Vercel API token (dashboard → Account Settings → Tokens)');
  console.log('   4. Get Vercel project ID (Project Settings → General)');
  console.log('   5. Run:');
  console.log(`      node deploy.js \\`);
  console.log(`        --mongodb-uri "mongodb+srv://..." \\`);
  console.log(`        --render-token "rnd_..." \\`);
  console.log(`        --vercel-token "..." \\`);
  console.log(`        --vercel-project-id "..."`);
  process.exit(0);
} else {
  console.log('\n⚠️  Some checks failed. Please review the output above.');
  console.log('\n❌ Failed checks:');
  checks.filter(c => !c.passed).forEach(c => console.log(`   - ${c.name}`));
  process.exit(1);
}
