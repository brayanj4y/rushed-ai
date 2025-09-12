# Rushed Documentation

## Overview
Rushed is an AI-powered web app builder that transforms natural language into functional code. Built for teams seeking rapid web application development through an intuitive chat interface.

## Key Features
- **🤖 AI Code Generation**: Instant Next.js components from text descriptions
- **📂 Project Management**: Streamlined project organization and versioning
- **👀 Live Preview**: Real-time component visualization in sandbox
- **💎 Gem System**: Flexible usage credits with free and premium options
- **🌓 Theme Support**: Polished dark and light modes

## Getting Started

### 1. Account Setup
Create your account using any of:
- Email/Password
- Google OAuth
- GitHub OAuth

### 2. Project Creation
1. Navigate to dashboard
2. Choose template or start from scratch:
   - Settings Page
   - Login Page
   - Pricing Page
   - Custom Layout
3. Describe your requirements
4. Review and customize generated code

### 3. Credit Management
- Track Gems in navigation bar
- Free tier: Periodic credit refresh
- Pro tier: Unlimited access

## Technical Stack
```text
Frontend           Backend            Authentication
─────────────────────────────────────────────────────
Next.js 13+       TRPC               Clerk
TypeScript        Prisma             OAuth 2.0
Tailwind CSS      NeonDB             JWT
Shadcn/UI
```

## Project Structure
```text
rushed/
├── app/               # Next.js routes
├── components/
│   └── ui/           # Shared components
├── modules/          # Feature modules
├── prisma/          # Database config
├── public/          # Static assets
└── src/             # Core source
```

## Environment Setup
```env
# Required Environment Variables
DATABASE_URL=<NeonDB URL>
NEXT_PUBLIC_APP_URL=http://localhost:3000
E2B_API_KEY=<e2b Sandbox Key>
ANTHROPIC_API_KEY=<Anthropic API Key>

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<Clerk Public Key>
CLERK_SECRET_KEY=<Clerk Secret>
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
```

## Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` to view your application.

## Support
- Issues: [GitHub Issues](https://github.com/brayanj4y/rushed-ai/issues)