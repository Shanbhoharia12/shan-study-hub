# Shan Bhoharia's Study Hub

## Overview

This is a full-stack web application designed to serve as a digital study hub for college students. The platform provides organized access to semester materials, previous year exam papers, practical guides, and assignments. The application follows a modern web architecture with a React frontend, Express backend, and PostgreSQL database using Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Radix UI primitives with shadcn/ui design system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Middleware**: Express middleware for JSON parsing, CORS handling, and request logging
- **Error Handling**: Centralized error handling with proper HTTP status codes

### Data Storage Solutions
- **Database**: PostgreSQL (configured for production)
- **ORM**: Drizzle ORM for type-safe database operations
- **Migrations**: Drizzle Kit for schema migrations
- **Development Storage**: In-memory storage implementation for development/testing
- **Connection**: Neon Database serverless driver for PostgreSQL connections

## Key Components

### Database Schema
The application uses four main entities:
- **Semesters**: Container for academic semesters with basic metadata
- **Subjects**: Academic subjects linked to specific semesters
- **Materials**: Study materials (notes, practicals, assignments) linked to subjects
- **ExamPapers**: Previous year papers with metadata (internal/university, year, duration, marks)

### API Structure
RESTful endpoints organized by resource:
- `/api/semesters` - Semester management
- `/api/subjects` - Subject operations
- `/api/materials` - Study material access
- `/api/exam-papers` - Previous paper access
- `/api/search` - Global search functionality

### UI Components
Modular component architecture:
- **Navigation**: Responsive navigation with mobile menu
- **Cards**: Reusable card components for semesters, subjects, materials, and papers
- **Modal**: PDF preview functionality
- **Search**: Global search with autocomplete
- **Breadcrumbs**: Navigation context

## Data Flow

1. **Client Request**: React components trigger API calls through TanStack Query
2. **API Processing**: Express routes handle requests, validate parameters, and interact with storage layer
3. **Data Access**: Storage interface abstracts database operations (in-memory for dev, PostgreSQL for production)
4. **Response Handling**: JSON responses are cached by React Query and rendered by components
5. **UI Updates**: Components reactively update based on query state changes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for production
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Tools
- **vite**: Fast development server and build tool
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Deployment Strategy

### Development
- **Server**: tsx for TypeScript execution with hot reload
- **Client**: Vite development server with HMR
- **Database**: In-memory storage for rapid development
- **Environment**: NODE_ENV=development

### Production
- **Build Process**: 
  1. Vite builds client-side React application
  2. esbuild bundles server-side Express application
  3. Static assets served from dist/public
- **Server**: Node.js serving bundled Express application
- **Database**: PostgreSQL via Neon serverless connection
- **Environment**: NODE_ENV=production

### File Structure
- `client/`: React frontend application
- `server/`: Express backend with routes and storage
- `shared/`: Common TypeScript types and schemas
- `dist/`: Production build output

## Changelog

Changelog:
- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.