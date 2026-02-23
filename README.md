# Maktabat Thanawya - مكتبة الثانوية

Digital library for Egyptian high school students (Thanawya Amma & Thanawya Azhar).

## Features

- Browse books by section (ثانوي عام / ثانوي أزهري) and subject
- Search functionality
- Book download tracking
- Admin panel for managing books, subjects, and sections
- Request books feature
- Fully responsive design
- Dark/Light theme support
- SEO optimized

## Tech Stack

- React 19 + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- React Router
- Local Storage (browser-based data persistence)

## Setup

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Admin Access

- Email: `admin@gmail.com`
- Password: `admin#123`

## Data Storage

All data is stored locally in the browser using localStorage. On first load, the app automatically initializes with:
- 2 sections (ثانوي عام, ثانوي أزهري)
- 20 subjects across both sections

## Project Structure

```
src/
├── components/     # UI components
├── pages/         # Page components
│   ├── admin/    # Admin panel pages
│   └── public/   # Public pages
├── lib/          # Core libraries
│   ├── local-storage.ts  # localStorage API
│   ├── supabase.ts       # Public API exports
│   └── supabase-admin.ts # Admin API exports
├── types/        # TypeScript types
└── store/        # Zustand store
```

## License

MIT
