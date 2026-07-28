# UI_DESIGN_SYSTEM.md

## 1. Brand Identity

### Brand Personality

- **Professional yet approachable**: The design should convey trust, leadership, and community spirit.
- **Youthful energy**: Rotaract is a young professional organization; the aesthetic should feel modern and dynamic.
- **Service-oriented**: Visual language should emphasize impact, collaboration, and service.

### Logo Usage

- Primary logo placed in the top-left of the navbar.
- Minimum clear space equal to the height of the R in Rotaract.
- Do not stretch, recolor, or place on busy backgrounds without a solid container.

## 2. Color Palette

### Primary Colors

| Name          | Hex     | Usage                               |
| ------------- | ------- | ----------------------------------- |
| Rotaract Blue | #003F87 | Primary brand color, headings, CTAs |
| Rotaract Gold | #F5A623 | Accents, highlights, secondary CTAs |
| White         | #FFFFFF | Backgrounds, text on dark           |
| Off-White     | #F8F9FA | Section backgrounds                 |

### Neutral Colors

| Name     | Hex     | Usage                   |
| -------- | ------- | ----------------------- |
| Gray 900 | #111827 | Primary text            |
| Gray 700 | #4B5563 | Secondary text          |
| Gray 500 | #9CA3AF | Tertiary text, borders  |
| Gray 300 | #D1D5DB | Dividers, input borders |
| Gray 100 | #F3F4F6 | Input backgrounds       |
| Gray 50  | #F9FAFB | Hover states            |

### Semantic Colors

| Name    | Hex     | Usage                    |
| ------- | ------- | ------------------------ |
| Success | #10B981 | Approved, success states |
| Warning | #F59E0B | Pending, caution states  |
| Error   | #EF4444 | Rejected, error states   |
| Info    | #3B82F6 | Informational messages   |

## 3. Typography

### Font Family

- **Primary**: Inter (Google Fonts) - Clean, highly legible sans-serif.
- **Secondary**: Merriweather (optional) - For pull quotes or featured text.

### Type Scale

| Token     | Size     | Weight | Line Height | Usage                       |
| --------- | -------- | ------ | ----------- | --------------------------- |
| text-xs   | 0.75rem  | 400    | 1rem        | Captions, labels            |
| text-sm   | 0.875rem | 400    | 1.25rem     | Secondary text, helper text |
| text-base | 1rem     | 400    | 1.5rem      | Body text, paragraphs       |
| text-lg   | 1.125rem | 400    | 1.75rem     | Large body, lead text       |
| text-xl   | 1.25rem  | 600    | 1.75rem     | Small headings              |
| text-2xl  | 1.5rem   | 700    | 2rem        | Section headings            |
| text-3xl  | 1.875rem | 700    | 2.25rem     | Page headings               |
| text-4xl  | 2.25rem  | 800    | 2.5rem      | Hero heading                |
| text-5xl  | 3rem     | 800    | 3rem        | Display heading             |

### Font Weights

- **400 (Regular)**: Body text, descriptions
- **500 (Medium)**: Buttons, navigation
- **600 (Semibold)**: Subheadings, card titles
- **700 (Bold)**: Headings, emphasis
- **800 (Extrabold)**: Hero text, display

## 4. Grid System

### Container

- **Max width**: 1280px (7xl in Tailwind)
- **Padding**: 1.5rem (24px) on mobile, 2rem (32px) on desktop
- **Gutter**: 1.5rem (24px)

### Columns

- **12-column grid** via Tailwind CSS grid utilities.
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

### Responsive Behavior

- Mobile: Single column, full-width cards.
- Tablet: 2-column grids for cards and galleries.
- Desktop: 3-4 column grids, sidebar layouts.

## 5. Spacing

### Spacing Scale

| Token    | Value          | Usage                          |
| -------- | -------------- | ------------------------------ |
| space-1  | 0.25rem (4px)  | Icon gaps, tight spacing       |
| space-2  | 0.5rem (8px)   | Component padding, inline gaps |
| space-3  | 0.75rem (12px) | Compact card padding           |
| space-4  | 1rem (16px)    | Standard padding, gaps         |
| space-6  | 1.5rem (24px)  | Section padding, card padding  |
| space-8  | 2rem (32px)    | Large gaps, between sections   |
| space-12 | 3rem (48px)    | Section vertical spacing       |
| space-16 | 4rem (64px)    | Hero padding, large sections   |
| space-24 | 6rem (96px)    | Page-level vertical rhythm     |

### Component Spacing Rules

- Cards: p-6 (24px) internal padding.
- Buttons: px-4 py-2 (16px horizontal, 8px vertical).
- Form inputs: px-3 py-2 (12px horizontal, 8px vertical).
- Section gaps: mb-12 or mb-16.

## 6. Components

### General Principles

- Consistent border radius:
  ounded-lg (8px) for cards,
  ounded-full for buttons and avatars.
- Subtle shadows: shadow-sm for cards, shadow-md for hover states.
- Transition duration: 150ms for hover states, 300ms for page transitions.

## 7. Buttons

### Primary Button

- Background: Rotaract Blue (#003F87)
- Text: White
- Padding: px-6 py-3
- Border radius:
  ounded-lg
- Hover: Darken 10%, slight scale (scale-105)
- Active: Scale-95
- Focus: 2px offset ring in Rotaract Gold

### Secondary Button

- Background: Transparent
- Border: 2px Rotaract Blue
- Text: Rotaract Blue
- Padding: px-6 py-3
- Hover: Background Rotaract Blue, text White

### Ghost Button

- Background: Transparent
- Text: Rotaract Blue
- Hover: Background Gray-100
- Used for tertiary actions.

### Button Sizes

| Size | Padding     | Text      | Usage             |
| ---- | ----------- | --------- | ----------------- |
| sm   | px-3 py-1.5 | text-sm   | Inline actions    |
| md   | px-4 py-2   | text-base | Standard          |
| lg   | px-6 py-3   | text-lg   | Hero CTAs         |
| icon | p-2         | -         | Icon-only buttons |

## 8. Forms

### Input Fields

- Border: 1px solid Gray-300
- Border radius:
  ounded-lg
- Padding: px-3 py-2
- Focus: 2px offset ring in Rotaract Blue
- Error state: Border Red-500, error message below in Red-500 text-sm
- Disabled: Background Gray-100, cursor-not-allowed

### Labels

- Font size: text-sm
- Font weight: font-medium
- Color: Gray-700
- Margin bottom: mb-1.5

### Textarea

- Same as input, but with min-h-[120px] and
  esize-y.

### Select

- Same styling as input.
- Custom arrow icon (Lucide ChevronDown).

### Checkbox / Radio

- Custom styled using Radix UI primitives.
- Focus ring in Rotaract Blue.

### Form Layout

- Stack layout with space-y-4 between fields.
- Full width on mobile, max-width max-w-md or max-w-lg on desktop.
- Submit button aligned left or center.

## 9. Cards

### Standard Card

- Background: White
- Border radius:
  ounded-xl
- Border: 1px solid Gray-200 (or transparent with shadow)
- Shadow: shadow-sm default, shadow-md on hover
- Padding: p-6
- Transition: 150ms ease

### Card Variations

- **Image Card**: Image on top (aspect-video), content below.
- **Event Card**: Date badge overlay on image, title, location, and CTA.
- **Profile Card**: Circular avatar, name, role, social links.

### Card Grid

- grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6

## 10. Animations

### Page Transitions

- Fade in: opacity-0 to opacity-100 over 300ms.
- Slide up: ranslate-y-4 to ranslate-y-0 over 300ms.
- Stagger children using animation-delay.

### Micro-interactions

- Buttons: Scale 1.05 on hover, scale 0.95 on active.
- Cards: Shadow increase on hover, subtle translateY(-4px).
- Links: Underline animation from left to right.
- Images: Slight scale on hover within overflow-hidden container.

### Loading States

- Skeleton screens for content loading.
- Spinner for button actions.
- Progress bar for file uploads.

## 11. Icons

### Icon Library

- **Lucide React**: Consistent, lightweight icons.

### Icon Sizes

| Size | Class | Usage             |
| ---- | ----- | ----------------- |
| xs   | 14px  | Inline with text  |
| sm   | 16px  | Buttons, inputs   |
| md   | 20px  | Cards, navigation |
| lg   | 24px  | Section icons     |
| xl   | 32px  | Empty states      |

### Icon Colors

- Default: Gray-500
- Primary: Rotaract Blue
- Accent: Rotaract Gold
- Success: Success green
- Error: Error red

## 12. Responsive Rules

### Mobile First

- All base styles are for mobile.
- Use md: and lg: prefixes for larger screens.

### Breakpoint Behavior

| Breakpoint | Behavior                                         |
| ---------- | ------------------------------------------------ |
| < 640px    | Single column, hamburger menu, stacked layouts   |
| 640-767px  | 2-column grids where appropriate                 |
| 768-1023px | Sidebar becomes drawer, 2-column grids           |
| 1024px+    | Full sidebar, 3-4 column grids, expanded layouts |

### Navigation

- Mobile: Hamburger menu with slide-in drawer.
- Tablet: Condensed navbar with icon links.
- Desktop: Full horizontal navbar with text links.

### Images

- Use object-cover with appropriate aspect ratios.
- Lazy load below-the-fold images.
- Responsive images via
  ext/image with multiple sizes.

## 13. Accessibility Guidelines

### Color Contrast

- Minimum 4.5:1 ratio for normal text.
- Minimum 3:1 ratio for large text (18px+ or 14px+ bold).
- Never rely on color alone to convey information.

### Focus Management

- Visible focus indicators on all interactive elements.
- Focus ring: 2px solid Rotaract Gold, 2px offset.
- Skip-to-content link for keyboard users.

### Semantic HTML

- Use proper heading hierarchy (h1 ? h2 ? h3).
- Use <nav>, <main>, <aside>, <footer> landmarks.
- Buttons for actions, links for navigation.

### Screen Readers

- Alt text for all informative images.
- Empty alt (lt=) for decorative images.
- ARIA labels for icon-only buttons.
- ARIA live regions for dynamic content (chatbot, notifications).

### Forms

- Associated labels with inputs via htmlFor and id.
- Error messages linked via ria-describedby.
- Required fields indicated with ria-required and visual indicator.
- Error summary at top of form for multiple errors.

### Motion

- Respect prefers-reduced-motion.
- Disable animations for users who prefer reduced motion.
- Provide pause/stop controls for auto-playing content.
