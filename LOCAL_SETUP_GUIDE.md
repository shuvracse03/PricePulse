# Price Tracker Application - Local Setup Guide

This guide will help you recreate the complete price tracking application on your local computer.

## Project Structure
```
price-tracker/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   └── index.html
├── server/
│   ├── index.ts
│   ├── routes.ts
│   ├── storage.ts
│   ├── db.ts
│   ├── replitAuth.ts
│   └── vite.ts
├── shared/
│   └── schema.ts
├── package.json
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── drizzle.config.ts
├── postcss.config.js
└── components.json
```

## Setup Steps

### 1. Initialize the Project
```bash
mkdir price-tracker
cd price-tracker
npm init -y
```

### 2. Install Dependencies
```bash
# Core dependencies
npm install @hookform/resolvers @neondatabase/serverless @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-aspect-ratio @radix-ui/react-avatar @radix-ui/react-checkbox @radix-ui/react-collapsible @radix-ui/react-context-menu @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-hover-card @radix-ui/react-label @radix-ui/react-menubar @radix-ui/react-navigation-menu @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-radio-group @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slider @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-toggle @radix-ui/react-toggle-group @radix-ui/react-tooltip @reduxjs/toolkit @tanstack/react-query chart.js class-variance-authority clsx cmdk connect-pg-simple date-fns drizzle-orm drizzle-zod embla-carousel-react express express-session framer-motion input-otp lucide-react memoizee memorystore nanoid next-themes openid-client passport passport-local react react-day-picker react-dom react-hook-form react-icons react-redux react-resizable-panels recharts tailwind-merge tailwindcss-animate tw-animate-css vaul wouter ws zod zod-validation-error

# Dev dependencies
npm install -D @types/connect-pg-simple @types/express @types/express-session @types/node @types/passport @types/passport-local @types/react @types/react-dom @types/ws @vitejs/plugin-react autoprefixer drizzle-kit esbuild postcss tailwindcss tsx typescript vite @tailwindcss/typography @tailwindcss/vite
```

### 3. Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
REPLIT_DOMAINS=localhost:5000
ISSUER_URL=https://replit.com/oidc
REPL_ID=your_repl_id
```

### 4. Key Configuration Files

Create these files with the exact content I'll provide in the next steps...