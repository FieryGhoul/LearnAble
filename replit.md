# Learnable - Course Recommendation Platform for Neurodiverse Learners

## Overview

Learnable is a web application that provides personalized online course recommendations for neurodiverse learners. The platform evaluates courses based on accessibility features and matches them to users' specific neurotypes (ADHD, Dyslexia, Autism, Auditory Processing Disorder, etc.) and learning preferences. The system uses a sophisticated matching algorithm that scores courses based on neurotype-specific criteria, accessibility features, and user-defined learning preferences.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool

**Routing**: Wouter for lightweight client-side routing

**UI Components**: Radix UI primitives with shadcn/ui styling system configured in "new-york" style

**State Management**: 
- TanStack Query (React Query) for server state and API data fetching
- React Hook Form with Zod for form state and validation
- Local component state for UI interactions

**Styling System**:
- Tailwind CSS with custom configuration for neurodiverse-friendly design
- Design system prioritizes accessibility, readability, and reduced cognitive load
- Typography: Inter (primary), Lexend (headings - designed for dyslexic readers), JetBrains Mono (code)
- Generous spacing, high contrast, calm aesthetic per `design_guidelines.md`
- CSS variables for theme customization (light/dark mode support)

**Key Pages**:
1. Home - Landing page with quick search and feature highlights
2. Questionnaire - Multi-step form collecting neurotype, learning preferences, topics, and accessibility needs
3. Results - Displays matched courses with filtering capabilities
4. Not Found - 404 error page

### Backend Architecture

**Runtime**: Node.js with Express.js server

**Language**: TypeScript with ESM modules

**API Design**: RESTful endpoints
- `GET /api/courses` - Retrieve all courses
- `GET /api/courses/:id` - Get single course by ID
- `GET /api/matches` - Get personalized course matches based on query parameters (neurotype, preferences, topics, accessibility)

**Data Storage Strategy**:
- Currently using in-memory storage with static course data (`server/data/courses.ts`)
- Database schema defined using Drizzle ORM with PostgreSQL dialect
- Neon serverless PostgreSQL driver configured for future database integration
- Migration system configured via `drizzle.config.ts`

**Matching Algorithm**:
- Neurotype profiles define preferred module lengths, content types, and bonus features
- Scoring system evaluates courses against user preferences across multiple dimensions
- Base score from neurotype compatibility, content type matching, module length alignment
- Bonus points for accessibility features, gamification, progress tracking, self-paced learning
- Topic relevance matching with partial string matching
- Results sorted by match score descending

### Data Schema

**Course Model** (defined in `shared/schema.ts`):
- Basic info: id, title, platform, URL, description, instructor
- Structure: duration, moduleLength, contentType, skillLevel
- Accessibility flags: hasCaption, hasTranscript, hasDyslexiaFont, hasStructuredLayout, hasProgressTracking, isGamified, isSelfPaced
- Metadata: price, category, tags, rating, enrollmentCount

**User Preference Model**:
- neurotype: Enum of supported neurotypes
- learningPreferences: Array of preference strings
- topics: Array of interest topics
- accessibilityNeeds: Optional array of specific needs

**Neurotype Profiles**:
- Each neurotype has preferred module length ranges, content types, and feature priorities
- Profiles inform the matching algorithm's scoring logic

### Development Setup

**Build Process**:
- Development: Vite dev server with HMR, Express API server runs concurrently
- Production: Vite builds client assets, esbuild bundles server code
- Type checking via TypeScript with path aliases for clean imports

**Path Aliases**:
- `@/*` → client source files
- `@shared/*` → shared types and schemas
- `@assets/*` → static assets

**Middleware Stack**:
- JSON body parsing with raw body access
- URL-encoded form parsing
- Request/response logging for API routes
- Vite middleware in development for HMR

## External Dependencies

### Database
- **Drizzle ORM** - Type-safe SQL query builder and schema management
- **@neondatabase/serverless** - Neon PostgreSQL serverless driver (configured but not actively used with in-memory storage)
- **connect-pg-simple** - PostgreSQL session store (present but sessions not implemented)

### UI Component Libraries
- **Radix UI** - Comprehensive set of accessible, unstyled component primitives (accordion, dialog, dropdown, popover, select, tabs, toast, tooltip, etc.)
- **shadcn/ui** - Pre-styled component implementations built on Radix UI
- **Tailwind CSS** - Utility-first CSS framework
- **class-variance-authority** - Type-safe variant styling
- **Lucide React** - Icon library

### Form Management
- **React Hook Form** - Performant form state management
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod resolver for React Hook Form
- **drizzle-zod** - Generate Zod schemas from Drizzle tables

### Additional Libraries
- **date-fns** - Date utility functions
- **cmdk** - Command menu component
- **embla-carousel-react** - Carousel/slider functionality
- **wouter** - Lightweight routing library

### Development Tools
- **Vite** - Fast build tool and dev server
- **@vitejs/plugin-react** - React support for Vite
- **esbuild** - JavaScript bundler for production server build
- **tsx** - TypeScript execution for development server
- **@replit/vite-plugin-runtime-error-modal** - Runtime error overlay
- **@replit/vite-plugin-cartographer** - Code mapping (dev only)
- **@replit/vite-plugin-dev-banner** - Development banner (dev only)

### Fonts (via Google Fonts CDN)
- Inter (400, 500, 600)
- Lexend (500, 600)
- JetBrains Mono