#!/usr/bin/env node

/**
 * Environment Variables Check Script
 * Validates that all required environment variables are set
 */

const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config();

// Colors for console output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}❌${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️${colors.reset} ${msg}`),
  info: (msg) => console.log(`${colors.blue}ℹ️${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bold}${colors.blue}${msg}${colors.reset}`)
};

// Required environment variables by category
const requiredVars = {
  database: [
    'DATABASE_URL'
  ],
  auth: [
    'NEXTAUTH_URL',
    'NEXTAUTH_SECRET',
    'JWT_SECRET',
    'ENCRYPTION_KEY'
  ],
  oauth: [
    // Optional - will show warnings if not set
    'GOOGLE_CLIENT_ID',
    'GOOGLE_CLIENT_SECRET'
  ],
  payment: [
    // Optional - will show warnings if not set
    'STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET'
  ],
  storage: [
    // Optional - will show warnings if not set
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_S3_BUCKET'
  ],
  email: [
    // Optional - will show warnings if not set
    'RESEND_API_KEY'
  ],
  realtime: [
    // Optional - will show warnings if not set
    'PUSHER_APP_ID',
    'PUSHER_KEY',
    'PUSHER_SECRET',
    'SOCKET_IO_URL'
  ],
  monitoring: [
    // Optional - will show warnings if not set
    'SENTRY_DSN',
    'GOOGLE_ANALYTICS_ID'
  ],
  app: [
    'NEXT_PUBLIC_APP_URL',
    'NEXT_PUBLIC_API_URL'
  ]
};

// Validation functions
const validators = {
  url: (value) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },
  
  email: (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },
  
  secret: (value) => {
    return value && value.length >= 32;
  },
  
  databaseUrl: (value) => {
    return value && value.startsWith('postgresql://');
  },
  
  stripeKey: (value) => {
    return value && (value.startsWith('pk_') || value.startsWith('sk_'));
  },
  
  stripeWebhookSecret: (value) => {
    return value && value.startsWith('whsec_');
  },
  
  awsKey: (value) => {
    return value && value.length >= 20;
  }
};

// Check environment variables
function checkEnvironment() {
  log.header('🔍 Environment Variables Check');
  
  let hasErrors = false;
  let hasWarnings = false;
  
  // Check each category
  Object.entries(requiredVars).forEach(([category, vars]) => {
    log.info(`\n📋 Checking ${category} variables:`);
    
    vars.forEach(varName => {
      const value = process.env[varName];
      
      if (!value) {
        if (['oauth', 'payment', 'storage', 'email', 'realtime', 'monitoring'].includes(category)) {
          log.warning(`${varName}: Not set (optional)`);
          hasWarnings = true;
        } else {
          log.error(`${varName}: Not set (required)`);
          hasErrors = true;
        }
        return;
      }
      
      // Validate specific variables
      let isValid = true;
      let validationMessage = '';
      
      if (varName.includes('URL') || varName.includes('url')) {
        isValid = validators.url(value);
        validationMessage = ' (should be a valid URL)';
      } else if (varName.includes('EMAIL') || varName.includes('email')) {
        isValid = validators.email(value);
        validationMessage = ' (should be a valid email)';
      } else if (varName.includes('SECRET') || varName.includes('secret')) {
        isValid = validators.secret(value);
        validationMessage = ' (should be at least 32 characters)';
      } else if (varName === 'DATABASE_URL') {
        isValid = validators.databaseUrl(value);
        validationMessage = ' (should be a PostgreSQL URL)';
      } else if (varName.includes('STRIPE') && varName.includes('KEY')) {
        isValid = validators.stripeKey(value);
        validationMessage = ' (should start with pk_ or sk_)';
      } else if (varName === 'STRIPE_WEBHOOK_SECRET') {
        isValid = validators.stripeWebhookSecret(value);
        validationMessage = ' (should start with whsec_)';
      } else if (varName.includes('AWS') && varName.includes('KEY')) {
        isValid = validators.awsKey(value);
        validationMessage = ' (should be at least 20 characters)';
      }
      
      if (isValid) {
        log.success(`${varName}: Set${validationMessage}`);
      } else {
        log.error(`${varName}: Invalid format${validationMessage}`);
        hasErrors = true;
      }
    });
  });
  
  // Summary
  log.header('\n📊 Summary');
  
  if (hasErrors) {
    log.error('Environment check failed! Please fix the required variables above.');
    process.exit(1);
  } else if (hasWarnings) {
    log.warning('Environment check passed with warnings. Some optional services may not work.');
    log.success('You can proceed with development.');
  } else {
    log.success('All environment variables are properly configured!');
  }
  
  // Additional checks
  log.header('\n🔧 Additional Checks');
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    log.success('.env file exists');
  } else {
    log.error('.env file not found');
    hasErrors = true;
  }
  
  // Check if database is accessible
  if (process.env.DATABASE_URL) {
    log.info('Database URL is configured');
  }
  
  // Check Docker containers
  log.info('Checking Docker containers...');
  const { execSync } = require('child_process');
  try {
    const dockerOutput = execSync('docker-compose ps --format json', { encoding: 'utf8' });
    const containers = JSON.parse(`[${dockerOutput.trim().replace(/\n/g, ',')}]`);
    
    containers.forEach(container => {
      if (container.State === 'running') {
        log.success(`${container.Service}: Running`);
      } else {
        log.error(`${container.Service}: ${container.State}`);
        hasErrors = true;
      }
    });
  } catch (error) {
    log.warning('Could not check Docker containers. Make sure Docker is running.');
  }
  
  if (hasErrors) {
    process.exit(1);
  }
}

// Run the check
if (require.main === module) {
  checkEnvironment();
}

module.exports = { checkEnvironment };
