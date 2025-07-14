# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
# Start development server on port 8080
npm run dev

# Build for production
npm run build

# Build for development (with sourcemaps)
npm run build:dev

# Preview production build
npm run preview

# Run ESLint
npm run lint
```

### Testing
No testing framework is currently configured. Consider adding Vitest or Jest if tests are needed.

## Architecture

This is a React + TypeScript landing page for AmasFungis fungal supplements, built with:

- **Vite** as the build tool with React SWC plugin
- **shadcn/ui** component library (50+ pre-built components in `src/components/ui/`)
- **Tailwind CSS** with custom AmasFungis branding (black/yellow theme)
- **React Router** for client-side routing
- **React Query** for server state management
- **Supabase** integration for chat functionality

### Key Structure
- `src/pages/` - Page components (Index.tsx contains the main landing page)
- `src/components/ui/` - All shadcn/ui components (DO NOT modify these directly)
- `src/App.tsx` - Main routing setup
- `@/` path alias maps to `./src/`

### Important Features
1. **Amasbot Chat**: Interactive chatbot with wizard onboarding flow using Supabase
2. **Product Showcase**: Five fungal supplements with interactive cards
3. **Countdown Timer**: Marketing countdown functionality
4. **Responsive Design**: Mobile-first approach with custom mobile hooks

### TypeScript Configuration
The project uses loose TypeScript settings. Be aware that:
- `noImplicitAny` is false
- Unused variables/parameters are not flagged
- Null checks are not strict

### Styling Approach
- Use Tailwind utility classes
- Custom colors defined in `tailwind.config.ts` (e.g., `fungis-black`, `fungis-yellow`)
- shadcn/ui components use CSS variables for theming

## Development Notes

1. **Port 8080**: Dev server runs on port 8080, not the default 5173
2. **Component Library**: When needing UI components, check `src/components/ui/` first
3. **Forms**: Use React Hook Form + Zod for form handling (already installed)
4. **Icons**: Use Lucide React icons (already installed)
5. **Deployment**: Project deploys via Lovable.dev platform