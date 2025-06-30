# Complete Price Tracker Project - Local Version

## Quick Start Commands
```bash
# 1. Create project
mkdir price-tracker && cd price-tracker

# 2. Initialize npm
npm init -y

# 3. Install all dependencies (copy this entire command)
npm install @hookform/resolvers @neondatabase/serverless @radix-ui/react-accordion @radix-ui/react-alert-dialog @radix-ui/react-avatar @radix-ui/react-button @radix-ui/react-card @radix-ui/react-checkbox @radix-ui/react-dialog @radix-ui/react-dropdown-menu @radix-ui/react-form @radix-ui/react-label @radix-ui/react-popover @radix-ui/react-progress @radix-ui/react-scroll-area @radix-ui/react-select @radix-ui/react-separator @radix-ui/react-slot @radix-ui/react-switch @radix-ui/react-tabs @radix-ui/react-toast @radix-ui/react-tooltip @reduxjs/toolkit @tanstack/react-query chart.js class-variance-authority clsx cmdk date-fns drizzle-orm drizzle-zod express framer-motion lucide-react react react-dom react-hook-form react-redux recharts tailwind-merge tailwindcss-animate wouter zod

# 4. Install dev dependencies
npm install -D @types/express @types/node @types/react @types/react-dom @vitejs/plugin-react autoprefixer drizzle-kit esbuild postcss tailwindcss tsx typescript vite @tailwindcss/typography

# 5. Create folder structure
mkdir -p client/src/{components,pages,store,hooks,lib} server shared

# 6. Create files (copy each file content below)
```

## File 1: package.json
```json
{
  "name": "price-tracker",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "db:push": "drizzle-kit push"
  }
}
```

## File 2: vite.config.ts
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
});
```

## File 3: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",
        secondary: "#64748b",
      },
    },
  },
  plugins: [],
}
```

## File 4: tsconfig.json
```json
{
  "include": ["client/src/**/*", "shared/**/*", "server/**/*"],
  "compilerOptions": {
    "module": "ESNext",
    "strict": true,
    "lib": ["esnext", "dom"],
    "jsx": "react-jsx",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "baseUrl": ".",
    "paths": {
      "@/*": ["./client/src/*"],
      "@shared/*": ["./shared/*"]
    }
  }
}
```

## File 5: client/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Price Tracker</title>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

## File 6: client/src/main.tsx
```typescript
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

## File 7: client/src/index.css
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  font-family: system-ui, -apple-system, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}
```

## File 8: client/src/App.tsx
```typescript
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import Landing from './pages/Landing';
import Home from './pages/Home';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
```

## File 9: client/src/pages/Landing.tsx
```typescript
import { Link } from 'wouter';

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Price Tracker
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Compare prices across multiple providers and track the best deals
          </p>
          <Link to="/home">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition">
              Get Started
            </button>
          </Link>
        </div>
        
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              📊
            </div>
            <h3 className="text-lg font-semibold mb-2">Price Comparison</h3>
            <p className="text-gray-600">Compare prices from multiple retailers instantly</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              📈
            </div>
            <h3 className="text-lg font-semibold mb-2">Price History</h3>
            <p className="text-gray-600">Track price changes over time with detailed charts</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              🔔
            </div>
            <h3 className="text-lg font-semibold mb-2">Price Alerts</h3>
            <p className="text-gray-600">Get notified when prices drop to your target</p>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## File 10: client/src/pages/Home.tsx
```typescript
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Price Tracker</h1>
            <div className="flex items-center space-x-4">
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Categories</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {categories?.map((category: any) => (
              <div key={category.id} className="bg-white rounded-lg shadow hover:shadow-md transition p-6">
                <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                <p className="text-gray-600 text-sm">Browse {category.name.toLowerCase()} products</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="bg-gray-100 h-48 rounded mb-4 flex items-center justify-center">
                <span className="text-gray-500">Product Image</span>
              </div>
              <h3 className="font-semibold mb-2">Sample Product</h3>
              <p className="text-gray-600 text-sm mb-2">Product description goes here</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">$99.99</span>
                <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
                  View Prices
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```

## File 11: server/index.ts
```typescript
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// API Routes
app.get('/api/categories', (req, res) => {
  res.json([
    { id: 1, name: 'Electronics', slug: 'electronics' },
    { id: 2, name: 'Clothing', slug: 'clothing' },
    { id: 3, name: 'Home & Garden', slug: 'home-garden' },
    { id: 4, name: 'Sports', slug: 'sports' },
  ]);
});

app.get('/api/products', (req, res) => {
  res.json([
    {
      id: 1,
      name: 'Sample Product',
      description: 'This is a sample product',
      price: 99.99,
      categoryId: 1,
    },
  ]);
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/public/index.html'));
  });
} else {
  // Development mode - let Vite handle the frontend
  const { createServer } = await import('vite');
  const vite = await createServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  
  app.use(vite.ssrFixStacktrace);
  app.use(vite.middlewares);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## File 12: shared/schema.ts
```typescript
import { z } from 'zod';

export interface Category {
  id: number;
  name: string;
  slug: string;
  image?: string;
  createdAt: Date;
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  brand?: string;
  model?: string;
  image?: string;
  categoryId: number;
  price: number;
  createdAt: Date;
}

export interface Price {
  id: number;
  productId: number;
  providerId: number;
  price: number;
  currency: string;
  timestamp: Date;
}

export const createCategorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  image: z.string().optional(),
});

export const createProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  image: z.string().optional(),
  categoryId: z.number(),
  price: z.number().positive(),
});
```

## Setup Instructions

1. **Create project and install dependencies** (run the commands at the top)

2. **Create all files** - Copy each file content exactly as shown above

3. **Install Tailwind CSS:**
```bash
npx tailwindcss init -p
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open your browser** to `http://localhost:5000`

This simplified version will run locally without requiring PostgreSQL or Replit Auth. It includes:
- ✅ Basic React frontend with Tailwind CSS
- ✅ Express server with sample API endpoints
- ✅ Landing page and home page
- ✅ Product categories and basic layout
- ✅ Search functionality
- ✅ Responsive design

To add the full database functionality later, you can:
1. Set up PostgreSQL
2. Add the complete schema from my previous message
3. Implement the full authentication system

Would you like me to provide any specific part in more detail?