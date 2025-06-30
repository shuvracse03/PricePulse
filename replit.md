# PriceTracker Application

## Overview

PriceTracker is a full-stack web application that enables users to compare prices of products across multiple providers. The application features real-time price tracking, historical price analysis, and comprehensive product management capabilities. Built with modern web technologies, it provides both consumer-facing features for price comparison and administrative tools for content management.

## System Architecture

The application follows a modern full-stack architecture with clear separation between frontend and backend components:

- **Frontend**: React-based SPA using TypeScript, Vite for bundling, and Tailwind CSS for styling
- **Backend**: Django REST Framework providing RESTful API endpoints with JWT authentication
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration with OpenID Connect
- **State Management**: Redux Toolkit with RTK Query for API state management
- **UI Components**: Radix UI components with shadcn/ui styling system

## Key Components

### Frontend Architecture
- **React with TypeScript**: Modern React application with full TypeScript support
- **Vite Build System**: Fast development server and optimized production builds
- **Tailwind CSS**: Utility-first CSS framework with custom design system
- **shadcn/ui Components**: Pre-built accessible UI components based on Radix UI
- **Redux Toolkit**: Centralized state management with RTK Query for API calls
- **React Router (Wouter)**: Lightweight client-side routing

### Backend Architecture
- **Express.js Server**: RESTful API server with TypeScript
- **Drizzle ORM**: Type-safe database operations with schema validation
- **Zod Validation**: Runtime type checking and API input validation
- **Session Management**: PostgreSQL-based session storage

### Database Schema
The application uses a comprehensive relational database design:
- **Users**: Authentication and profile management
- **Categories/Subcategories**: Hierarchical product organization
- **Products/Variants**: Product catalog with variations
- **Providers**: Price comparison sources
- **Prices**: Historical price tracking
- **Watchlist**: User-specific product monitoring

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, creating sessions stored in PostgreSQL
2. **Product Discovery**: Categories and products are fetched via RTK Query and cached in Redux store
3. **Price Comparison**: Real-time price data is aggregated from multiple providers
4. **Historical Analysis**: Price history is visualized using Chart.js integration
5. **Admin Operations**: Privileged users can manage products, categories, and pricing data

## External Dependencies

### Core Technologies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM with PostgreSQL dialect
- **@reduxjs/toolkit**: State management and API integration
- **@tanstack/react-query**: Additional data fetching and caching
- **chart.js**: Price history visualization

### Authentication & Security
- **openid-client**: OpenID Connect authentication
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### UI & Styling
- **@radix-ui/***: Accessible UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

## Deployment Strategy

The application is designed for deployment on Replit with the following considerations:

1. **Development Mode**: Vite dev server with HMR for frontend, tsx with nodemon for backend
2. **Production Build**: 
   - Frontend: Vite builds optimized static assets
   - Backend: esbuild bundles server code for Node.js execution
3. **Environment Variables**: 
   - `DATABASE_URL`: PostgreSQL connection string (required)
   - `SESSION_SECRET`: Session encryption key
   - `REPLIT_DOMAINS`: Allowed domains for authentication
   - `ISSUER_URL`: OpenID Connect issuer URL

The build process creates a unified distribution with static assets served by Express in production, while maintaining separate development servers for optimal developer experience.

## Changelog

```
Changelog:
- June 30, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```