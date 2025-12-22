# Flipr - Flashcard Application Design Guidelines

## Design Approach
**Design System**: Material Design 3 with custom adaptations
**Reasoning**: Study applications require clarity, organization, and visual feedback. Material's elevation system and motion principles enhance the card-flipping experience while maintaining usability.

**References**: Duolingo (gamification), Notion (content organization), Quizlet (study tools)

## Core Design Elements

### Typography
- **Primary Font**: Inter (Google Fonts)
- **Headers**: 600 weight, sizes: text-3xl (hero), text-2xl (section), text-xl (card titles)
- **Body**: 400 weight, text-base for content, text-sm for metadata
- **Monospace**: JetBrains Mono for code snippets in tech flashcards

### Layout System
**Spacing Units**: Tailwind 4, 6, 8, 12, 16
- Card padding: p-6
- Section spacing: space-y-8
- Container margins: mx-4 md:mx-8
- Max widths: max-w-7xl for decks grid, max-w-2xl for study view

### Component Library

**Navigation**
- Sticky top nav with blur effect (backdrop-blur-lg)
- Left: Logo + app name
- Center: Search bar with icon (Hero Icons)
- Right: Profile dropdown, notifications icon, create deck button

**Deck Cards**
- Rounded corners (rounded-xl)
- Hover lift effect (transform translate)
- Card structure: Thumbnail/icon → Title → Progress bar → Card count + "Last studied" timestamp
- Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

**Flashcard Component**
- Large card (min-h-[400px]) with flip animation on click
- Front: Question centered, difficulty indicator (top-right badge)
- Back: Answer + explanation section
- Bottom actions: "Mark as mastered" | "Need review" | "Report issue"

**Study Session Interface**
- Full-screen mode option
- Progress indicator: Linear progress bar showing cards completed/remaining
- Navigation: Previous/Next buttons (bottom corners), keyboard shortcuts displayed
- Answer confidence: 3-button scale (Hard/Medium/Easy) affecting spaced repetition

**Deck Creation/Edit**
- Modal overlay (backdrop-blur-sm)
- Form layout: Single column, generous spacing (space-y-6)
- Rich text editor for answers (with formatting toolbar)
- Image upload zone with drag-and-drop (dashed border, hover state)
- Tag system: Pill-style tags with remove X, autocomplete suggestions

**Dashboard/Home**
- Hero section: "Continue studying" prominent card showing active deck
- Stats row: 4-column grid showing cards studied today, streak, total decks, mastery %
- Recent decks section: Horizontal scrollable carousel
- "All Decks" section: Filterable grid with sort options (dropdown)

**Search & Filters**
- Dropdown filters: Subject, Difficulty, Last Modified
- Search with real-time results
- Empty state: Encouraging illustration + "Create your first deck" CTA

### Images
**Hero Section**: No large hero image - utility-focused dashboard with immediate access to study tools
**Deck Cards**: Small thumbnail icons (64x64) representing subject/category
**Empty States**: Friendly illustrations (custom or Undraw) for "no decks," "search no results"
**Profile**: User avatar (circular, 40x40 in nav, 120x120 in profile)

### Interactions & Feedback
- Card flip: 3D transform with 0.6s ease-in-out transition
- Success feedback: Green checkmark animation when marking cards as mastered
- Streak celebration: Confetti animation at milestones (using canvas-confetti library)
- Loading states: Skeleton screens for deck grids
- Toast notifications: Slide-in from top-right for actions (deck created, card saved)

### Accessibility
- Keyboard navigation: Space to flip, arrow keys for next/previous
- Focus indicators: 2px outline offset
- Screen reader labels for all icon buttons
- High contrast mode support
- Font size controls in settings

### Mobile Considerations
- Single column layouts on mobile
- Bottom navigation bar (Study/Decks/Search/Profile)
- Swipe gestures: Swipe card left (hard), right (easy)
- Touch-friendly targets: Minimum 44px tap areas
- Simplified create form: Multi-step wizard instead of single page