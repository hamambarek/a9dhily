# 🚀 A9dhily Setup Guide

This guide will walk you through setting up the A9dhily marketplace project step by step.

## 📋 Prerequisites

- ✅ Node.js 18+ installed
- ✅ Docker and Docker Compose installed
- ✅ Git installed
- ✅ A code editor (VS Code recommended)

## 🐳 Step 1: Database Setup

The PostgreSQL database is already running via Docker Compose.

**Database Details:**
- **Host**: `localhost`
- **Port**: `5432`
- **Database**: `a9dhily`
- **Username**: `a9dhily_user`
- **Password**: `a9dhily_password_2024`

**pgAdmin Access:**
- **URL**: http://localhost:8080
- **Email**: `admin@a9dhily.com`
- **Password**: `admin_password_2024`

## 🔧 Step 2: Environment Variables Configuration

Open your `.env` file and configure each section:

### 🌐 Database Configuration
```bash
# Database URL (already configured for Docker)
DATABASE_URL="postgresql://a9dhily_user:a9dhily_password_2024@localhost:5432/a9dhily"
```

### 🔐 Authentication & Security
```bash
# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-super-secret-key-here-minimum-32-chars"

# JWT Secret (generate a secure random string)
JWT_SECRET="your-jwt-secret-key-here-minimum-32-chars"

# Encryption Key (generate a secure random string)
ENCRYPTION_KEY="your-encryption-key-here-minimum-32-chars"
```

### 🔑 OAuth Providers (Optional)

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials → Create Credentials → OAuth 2.0 Client ID
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create a new OAuth App
3. Set Homepage URL: `http://localhost:3000`
4. Set Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

```bash
# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
```

### 💳 Payment Integration (Stripe)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/)
2. Get your API keys from Developers → API keys

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_WEBHOOK_SECRET="whsec_your-stripe-webhook-secret"
```

### ☁️ File Storage (AWS S3)

1. Create an AWS account
2. Create an S3 bucket
3. Create an IAM user with S3 permissions
4. Get access keys

```bash
# AWS S3 Configuration
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-s3-bucket-name"
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain"
```

### 📧 Email Service (Resend)

1. Go to [Resend](https://resend.com/)
2. Create an account and get your API key

```bash
# Email Configuration
RESEND_API_KEY="re_your-resend-api-key"
```

### 🔄 Real-time Communication

#### Pusher (Fallback)
1. Go to [Pusher](https://pusher.com/)
2. Create a new app
3. Get your credentials

```bash
# Pusher Configuration
PUSHER_APP_ID="your-pusher-app-id"
PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
PUSHER_CLUSTER="us2"
```

#### Socket.io (Primary)
```bash
# Socket.io Configuration
SOCKET_IO_URL="http://localhost:3001"
```

### 📊 Monitoring & Analytics

#### Sentry (Error Tracking)
1. Go to [Sentry](https://sentry.io/)
2. Create a new project
3. Get your DSN

```bash
# Sentry Configuration
SENTRY_DSN="https://your-sentry-dsn@sentry.io/project-id"
```

#### Google Analytics
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new property
3. Get your Measurement ID

```bash
# Google Analytics
GOOGLE_ANALYTICS_ID="G-XXXXXXXXXX"
```

### ⚙️ Application Configuration

```bash
# Application URLs
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS="true"
NEXT_PUBLIC_ENABLE_CHAT="true"
NEXT_PUBLIC_ENABLE_ESCROW="true"

# Platform Configuration
PLATFORM_FEE_PERCENTAGE="2.5"
MINIMUM_TRANSACTION_AMOUNT="1.00"
MAXIMUM_TRANSACTION_AMOUNT="10000.00"

# Rate Limiting
RATE_LIMIT_WINDOW_MS="900000"
RATE_LIMIT_MAX_REQUESTS="100"

# File Upload Limits
MAX_FILE_SIZE="10485760"
ALLOWED_FILE_TYPES="image/jpeg,image/png,image/webp,application/pdf"
```

## 🚀 Step 3: Install Dependencies

```bash
npm install
```

## 🗄️ Step 4: Database Migration

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# (Optional) View database in Prisma Studio
npx prisma studio
```

## 🧪 Step 5: Run Development Server

```bash
npm run dev
```

Your application will be available at: http://localhost:3000

## 🔍 Step 6: Verify Setup

1. **Database**: Check pgAdmin at http://localhost:8080
2. **Application**: Visit http://localhost:3000
3. **API Health**: Visit http://localhost:3000/api/health
4. **Database Studio**: Run `npx prisma studio`

## 🛠️ Development Workflow

Use the provided workflow script:

```bash
# Create a feature branch
./scripts/dev-workflow.sh feature "new-feature"

# Commit changes
./scripts/dev-workflow.sh commit "Add new feature"

# Push to remote
./scripts/dev-workflow.sh push

# Complete feature
./scripts/dev-workflow.sh complete
```

## 🔒 Security Checklist

- [ ] All environment variables are set
- [ ] Database is properly secured
- [ ] OAuth providers are configured
- [ ] Stripe keys are in test mode
- [ ] AWS credentials have minimal permissions
- [ ] Rate limiting is enabled
- [ ] Security headers are configured

## 🆘 Troubleshooting

### Database Connection Issues
```bash
# Check if database is running
docker-compose ps

# Restart database
docker-compose restart postgres

# View database logs
docker-compose logs postgres
```

### Environment Variable Issues
```bash
# Validate environment variables
npm run validate:env

# Check for missing variables
npm run check:env
```

### Port Conflicts
If ports 3000, 5432, or 8080 are in use:
1. Stop conflicting services
2. Or modify ports in `docker-compose.yml`

## 📚 Next Steps

1. **Authentication**: Test OAuth providers
2. **Database**: Create test data
3. **Payments**: Test Stripe integration
4. **File Upload**: Test S3 integration
5. **Real-time**: Test Socket.io/Pusher

## 🆘 Support

If you encounter issues:
1. Check the logs: `docker-compose logs`
2. Verify environment variables
3. Check the health endpoint: http://localhost:3000/api/health
4. Review the troubleshooting section above
