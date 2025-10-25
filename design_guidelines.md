# Learnable Design Guidelines

## Design Approach

**Framework**: Accessibility-First Design System inspired by Notion's clarity and Linear's structural precision, with custom adaptations for neurodiverse users.

**Core Principles**:
- Predictable, consistent patterns throughout
- Generous whitespace to reduce cognitive load
- Clear visual hierarchy without visual noise
- High contrast and readability-first typography
- Calm, supportive aesthetic that builds confidence

---

## Typography

**Font System** (via Google Fonts CDN):
- **Primary**: Inter (400, 500, 600) - exceptional readability, generous spacing
- **Headings**: Lexend (500, 600) - designed for dyslexic readers, clear letterforms
- **Monospace**: JetBrains Mono (code snippets only)

**Scale** (Tailwind):
- Hero headline: text-5xl (48px)
- Page titles: text-4xl (36px)
- Section headers: text-2xl (24px)
- Card titles: text-xl (20px)
- Body text: text-base (16px) - never smaller than 16px
- Metadata/labels: text-sm (14px)
- Line height: leading-relaxed (1.625) for body, leading-tight (1.25) for headings

---

## Layout System

**Spacing Primitives**: Use Tailwind units of 3, 4, 6, 8, 12, 16
- Tight spacing: p-3, gap-3
- Standard spacing: p-6, gap-6, mb-8
- Section spacing: py-16, gap-12
- Page margins: px-6 (mobile), px-12 (desktop)

**Container Strategy**:
- Max-width: max-w-7xl for main content
- Card grids: max-w-6xl
- Reading content: max-w-3xl
- Generous padding within all containers (p-6 minimum)

**Grid Patterns**:
- Course cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Filter sections: Single column on mobile, 2-column on desktop
- Results layout: List view default (easier scanning), optional grid toggle

---

## Component Library

### Navigation
- **Fixed top bar**: Clean, uncluttered with logo left, "My Profile" right
- **Quick filters bar**: Below header, horizontal scroll on mobile with clear category pills
- **Sticky filter sidebar** (desktop): Left-aligned, collapsible with clear section dividers

### Hero Section
- **No hero image** - Start immediately with value: brief tagline + immediate access to course search
- Centered layout with search bar prominence
- Example tagline: "Find courses that work with your brain, not against it"
- Search bar: Large (h-16), rounded-xl, shadow-md with clear placeholder text

### Course Cards
- Generous padding (p-6)
- Clear visual sections: thumbnail area, title, metadata, match explanation, CTA
- **Match badge**: Prominent pill showing percentage match with brief reason ("95% Match - Short lessons, captions included")
- Course metadata in organized rows: Duration | Format | Level | Platform
- Accessibility icons: Clear, labeled icons for captions, transcripts, dyslexia-friendly, etc.
- Primary CTA button: "View Course" (w-full on mobile, w-auto on desktop)

### Filter System
- **Neurodiversity selector**: Visual cards with supportive descriptions, not dropdown
- **Learning preferences**: Multi-select checkboxes with clear labels and descriptions
- **Accessibility features**: Icon + text toggles
- Clear "Applied Filters" summary bar showing active selections with easy removal
- "Reset All" always visible

### Course Detail View
- Two-column on desktop: Left = course info, Right = match analysis sticky card
- **Match Explanation Card**: Why this course fits, specific features highlighted
- **Accessibility Report**: Detailed breakdown of available supports
- Platform link: External with clear "Opens in new tab" indicator
- Related courses section at bottom

### Profile/Settings
- **Preferences Dashboard**: Visual cards for each neurodiversity profile saved
- Edit mode: Clear, one section at a time to avoid overwhelm
- Progress tracking: Visual representation of courses explored

### Forms & Inputs
- Generous sizing (h-12 minimum for inputs)
- Clear labels above inputs, helper text below
- Focus states: 3px solid outline (not thin border)
- Error states: Supportive messaging, not punitive
- Progress indicators for multi-step forms

---

## Iconography

**Library**: Heroicons (outline for general UI, solid for emphasis)
- Use consistently sized icons (w-5 h-5 for inline, w-6 h-6 for standalone)
- Always pair with text labels, never icon-only buttons
- Accessibility feature icons: Custom set with clear meaning

---

## Images

**Hero Section**: No large hero image - immediate functionality
**Course Cards**: Small square thumbnail (96x96px) showing course platform logo or representative icon
**Profile Dashboard**: Optional avatar upload, default to initials
**Empty States**: Supportive illustrations (simple, uncluttered) for no results or first-time users

---

## Interactive Elements

**Buttons**:
- Primary: Solid, rounded-lg, h-12, px-8, font-medium
- Secondary: Outline variant
- Tertiary: Text-only with subtle hover
- All buttons: Clear focus ring, no elaborate hover animations

**Links**: Underlined in body text, distinct from buttons

**Animations**: Minimal - only smooth transitions (150ms) for state changes, no autoplay or motion

---

## Information Density

**Balance**: Structured but not cramped
- One primary action per screen
- Clear visual breaks between sections (min 12-16 spacing)
- Progressive disclosure: Show essential info first, expand for details
- Never more than 3 filter categories visible at once without expansion

---

## Responsive Behavior

- Mobile-first: Stack all multi-column layouts
- Tablet (768px): Introduction of 2-column layouts
- Desktop (1024px+): Full 3-column grids, sidebar filters
- Touch targets: Minimum 44x44px on all devices

---

This design creates a calm, organized, and deeply accessible experience that respects neurodivergent users' needs while maintaining visual appeal through thoughtful structure and generous space.