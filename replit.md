# Learnable - Neuro-Affirming Course Recommendations

## Project Overview

Learnable is an online course recommendation platform built specifically for neurodiverse learners. The application helps users find courses that align with their neurodiversity profile and accessibility needs, reducing overwhelm and improving learning success.

**Last Updated:** October 25, 2025

## Core Features

### 1. Neuro-Affirming Questionnaire
- 3-step wizard flow collecting:
  - Neurodiversity type (ADHD, Dyslexia, Autism, Auditory Processing Disorder, Multiple, Other)
  - Learning preferences (lesson length, content type, structure needs, gamification, etc.)
  - Topic interests (Python, Graphic Design, Photography, etc.)
- Visual neurodiversity cards with supportive, non-medicalized descriptions
- Progress indicators and clear navigation

### 2. Intelligent Matching Algorithm
- Scores courses (0-100%) based on:
  - Module length matching neurotype preferences (ADHD prefers 5-20min, Dyslexia 10-30min, etc.)
  - Content type alignment (video, text, interactive, mixed)
  - Accessibility features (captions, transcripts, dyslexia-friendly fonts, structured layouts)
  - Learning preference matches
  - Quality indicators (ratings, enrollment counts)
- Provides personalized match explanations for each course

### 3. Curated Course Database
- 20+ hand-selected courses from major platforms (Coursera, edX, Udemy, freeCodeCamp, LinkedIn Learning, YouTube)
- Rich metadata including:
  - Duration, module length, content type, skill level
  - Accessibility features: captions, transcripts, dyslexia fonts, structured layouts, progress tracking, gamification, self-paced options
  - Pricing, platform, instructor, ratings, enrollment counts
- Categories: Programming, Design, Photography, Web Development, Data Science, Marketing, Music, Business, AI/ML

### 4. Results & Filtering
- Course cards display:
  - Match score percentage with badge
  - Match explanation ("Why this course fits")
  - Accessibility highlights
  - Platform, duration, skill level, price
  - Direct link to course platform
- Advanced filtering:
  - Minimum match score slider
  - Price type (free/paid)
  - Skill level
  - Platform
- Applied filters summary with easy removal

## Project Architecture

### Tech Stack
- **Frontend:** React 18, TypeScript, Wouter (routing), TanStack Query v5
- **Backend:** Express.js, TypeScript
- **UI Components:** Shadcn UI (Radix primitives)
- **Styling:** Tailwind CSS with custom design tokens
- **Storage:** In-memory (MemStorage) for prototyping
- **Fonts:** Inter (body), Lexend (headings - dyslexia-friendly)

### File Structure
```
client/
  src/
    pages/
      home.tsx              - Landing page with hero and features
      questionnaire.tsx     - 3-step preference collection wizard
      results.tsx           - Matched courses with filtering
      not-found.tsx         - 404 page
    components/
      neurotype-card.tsx    - Selectable neurodiversity type cards
      course-card.tsx       - Course display with match info
      match-badge.tsx       - Match percentage indicator
      accessibility-icons.tsx - Feature icons with tooltips
      filter-sidebar.tsx    - Filter controls
      ui/                   - Shadcn components
    App.tsx               - Router setup
    index.css             - Design tokens and custom utilities

server/
  data/
    courses.ts            - Curated course database (20+ courses)
  storage.ts              - Storage interface, matching algorithm, neurotype profiles
  routes.ts               - API endpoints (/api/courses, /api/matches)
  index.ts                - Express server setup

shared/
  schema.ts               - TypeScript types and Zod schemas

design_guidelines.md      - Comprehensive design system documentation
```

### API Endpoints

**GET /api/courses**
- Returns all courses in the database
- Response: `Course[]`

**GET /api/courses/:id**
- Returns single course by ID
- Response: `Course`

**GET /api/matches**
- Returns matched courses based on user preferences
- Query params:
  - `neurotype`: string
  - `preferences`: JSON string array
  - `topics`: JSON string array
  - `accessibility`: JSON string array (optional)
- Response: `MatchResult[]` sorted by match score descending

## Design System

### Typography
- **Primary Font:** Inter (400, 500, 600) - exceptional readability
- **Heading Font:** Lexend (500, 600) - designed for dyslexic readers
- **Monospace:** JetBrains Mono (code only)
- Never use text smaller than 16px for body content

### Spacing
- Generous whitespace to reduce cognitive load
- Standard spacing: p-6, gap-6, mb-8
- Section spacing: py-16, gap-12

### Colors
- High contrast color scheme (blues and grays)
- Calm, supportive aesthetic
- Proper text hierarchy with 3 levels (default, secondary, tertiary)

### Accessibility
- All interactive elements ≥44px touch target
- Generous padding in all containers (min p-6)
- Clear focus states
- Supportive error messages
- Loading states for all async operations

## User Preferences

The application does NOT require user accounts. Preferences are:
1. Collected via questionnaire
2. Passed to results page via URL query parameters
3. Used to fetch matches from API
4. Not persisted (privacy-focused, no tracking)

## Neurotype Profiles

Each neurotype has specific preferences used by the matching algorithm:

- **ADHD:** Short modules (5-20min), gamification, progress tracking, self-paced
- **Dyslexia:** Strong captions/transcripts, dyslexia fonts, high-contrast visuals
- **Autism:** Structured layout, predictable patterns, clear objectives, self-paced
- **Auditory Processing Disorder:** Text-first content, comprehensive captions/transcripts
- **Multiple:** Combined features from multiple profiles
- **Other:** Flexible with strong accessibility foundation

## Recent Changes

**October 25, 2025:**
- Initial MVP implementation
- Complete frontend with 3-step questionnaire and results page
- Backend API with matching algorithm
- Curated database of 20+ courses across multiple platforms
- Comprehensive filtering system
- Full E2E testing validated

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (frontend + backend on port 5000)
npm run dev

# The app will be available at http://localhost:5000
```

## Testing

E2E tests validated:
✅ Home page loads with hero and features
✅ Questionnaire 3-step flow (neurotype → preferences → topics)
✅ Results page displays matched courses with correct query parameters
✅ Course cards show match scores, accessibility features, and platform badges
✅ Filtering works (match score, price, skill level, platform)
✅ Error handling for missing preferences and API failures
✅ Responsive design and accessibility features

## Future Enhancements

Potential additions (not in MVP):
- User accounts to save preferences and bookmark courses
- Real-time course data integration via platform APIs
- User reviews filtered by neurotype
- Advanced filtering (gamification level, instructor style, community support)
- Personalized learning dashboard
- Course comparison tool
- Email notifications for new matching courses

## Notes

- Uses neuro-affirming, supportive language throughout (avoids medicalized framing)
- Celebrates neurodiversity as a strength, not a deficit
- Designed to reduce cognitive load and overwhelm
- Privacy-focused: no accounts, no tracking, no data persistence
- Fully responsive and accessible
- Ready for deployment
