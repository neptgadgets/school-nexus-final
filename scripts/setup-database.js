#!/usr/bin/env node

/**
 * SchoolNexus Database Setup Script
 * This script helps set up the initial database configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function setupDatabase() {
  console.log('🏫 SchoolNexus Database Setup');
  console.log('================================\n');

  console.log('This script will help you set up your SchoolNexus database connection.\n');
  console.log('You will need:');
  console.log('1. A Supabase project (create one at https://supabase.com)');
  console.log('2. Your project URL and API keys');
  console.log('3. Database schema already deployed\n');

  const proceed = await askQuestion('Do you want to continue? (y/n): ');
  
  if (proceed.toLowerCase() !== 'y') {
    console.log('Setup cancelled.');
    process.exit(0);
  }

  console.log('\n📋 Please provide your Supabase project details:\n');

  const supabaseUrl = await askQuestion('Supabase Project URL: ');
  const supabaseAnonKey = await askQuestion('Supabase Anon Key: ');
  const nextAuthSecret = await askQuestion('NextAuth Secret (leave blank to generate): ');

  // Generate secret if not provided
  const secret = nextAuthSecret || require('crypto').randomBytes(32).toString('hex');

  // Create .env.local file
  const envContent = `# SchoolNexus Environment Configuration
# Generated on ${new Date().toISOString()}

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${supabaseAnonKey}

# Authentication
NEXTAUTH_SECRET=${secret}
NEXTAUTH_URL=http://localhost:3000

# Environment
NODE_ENV=development
`;

  try {
    fs.writeFileSync('.env.local', envContent);
    console.log('\n✅ Environment file created successfully!');
    console.log('📄 File: .env.local\n');
  } catch (error) {
    console.error('❌ Error creating environment file:', error.message);
    process.exit(1);
  }

  console.log('🔄 Next steps:');
  console.log('1. Make sure you have deployed the database schema from supabase-schema.sql');
  console.log('2. Create admin users in Supabase Auth');
  console.log('3. Add users to the administrators table');
  console.log('4. Run: npm run dev');
  console.log('5. Visit: http://localhost:3000\n');

  console.log('📖 For detailed setup instructions, see:');
  console.log('   - DATABASE_SETUP_GUIDE.md');
  console.log('   - README_PRODUCTION.md\n');

  console.log('🎉 Setup complete! Happy coding!');

  rl.close();
}

// Handle errors
process.on('unhandledRejection', (error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});

// Run setup
setupDatabase().catch((error) => {
  console.error('❌ Setup failed:', error.message);
  process.exit(1);
});
