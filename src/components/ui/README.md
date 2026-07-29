# UI Components Directory

This directory contains atomic, reusable, unstyled or low-level UI primitives built on top of Tailwind CSS, `class-variance-authority` (cva), `clsx`, and `tailwind-merge`.

## Component Guidelines

- Every UI primitive must be fully accessible (WCAG AA).
- Avoid domain logic inside primitives.
- Use `cn(...)` from `@/lib/utils` for merging class names safely.
- Support dark mode natively via design tokens.
