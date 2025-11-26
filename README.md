# My Anime Collection (TypeScript version)

This repository contains the TypeScript version of MyAnimeCollection — a web application to browse, collect and rate anime, and to create and share personal anime lists. This project stores the team's current TypeScript implementation and related assets.

Authors:
- Martinho José Novo Caeiro - 23917
- Paulo António Tavares Abade - 23919

Institution:
- Instituto Politécnico de Beja — Escola Superior de Tecnologia e Gestão

Table of contents
-----------------
- Project overview
- Features
- Tech stack
- Getting started (development)
- Build and production
- Environment variables
- Project structure (recommended)
- Scripts
- Testing and linting
- Data seeding / test data
- Known issues
- Contributing

Project overview
----------------
MyAnimeCollection is intended to help anime fans organize and share what they watch. This TypeScript version is focused on a modern frontend implementation (SPA) and/or TypeScript-backed services. The app typically integrates with an API that holds anime and user data (this repo contains the TypeScript client/front-end version).

Key user flows:
- Search and view anime details (synopsis, episodes, seasons, genres)
- Create and manage personal lists (e.g., "To Watch", "Watching", "Completed", custom lists)
- Add / remove anime to/from lists
- Rate anime and rate other users' lists
- View user profiles and public lists
- View top-rated anime / rankings (with date filters)

Features
--------
- TypeScript-first codebase
- Component-driven UI (React / Vite / Next / SvelteKit — adjust to the actual stack in the repo)
- Client-side routing and state management
- Integration points for backend API (REST or GraphQL)
- Authentication hooks and cookie/localStorage session handling (when implemented)
- Reusable UI components (lists, cards, rating widget)

Tech stack
----------
- Language: TypeScript
- Frontend framework: (likely React with Vite or Next.js — adjust if different)
- Bundler / dev server: Vite / Next / webpack
- Styling: CSS / SCSS / Tailwind / Bootstrap (project-specific)
- Testing: Jest / Vitest / Testing Library (project-specific)
- Linting / formatting: ESLint, Prettier
- Optional: Axios / Fetch for API calls

Getting started (development)
-----------------------------
Prerequisites:
- Node.js 18+ (LTS recommended)
- npm >= 8 or Yarn / pnpm
- A running backend API (if the frontend expects one). By default the app will point at a local or environment-configured API URL.

Quick start:
1. Clone the repo
   git clone https://github.com/zDragonPaulo/MyAnimeCollection.git
   cd MyAnimeCollection

2. Install dependencies
   npm install
   # or
   yarn
   # or
   pnpm install

3. Create environment configuration
   - Duplicate `.env.example` -> `.env` (if `.env.example` exists)
   - Provide API url and any keys (see "Environment variables" below)

4. Run the dev server
   npm run dev
   # or
   npm start
   # or for Next.js
   npm run dev

5. Open the app in your browser:
   http://localhost:3000 (or the port shown in the terminal)

Build and production
--------------------
To create a production build:
- npm run build
- Serve the build output with a static server or configure the deployment environment (Vercel / Netlify / static host / Docker).

Example:
- npm run build
- npm run preview (if available)

Environment variables
---------------------
Common variables you may need to set in `.env` (names may vary depending on the project):
- VITE_API_URL or REACT_APP_API_URL — base URL of the backend API (e.g., http://localhost:5000)
- NODE_ENV — development / production
- AUTH_DOMAIN / AUTH_CLIENT_ID — if an external auth provider is used

Check the repo for `.env.example`, or search the code for process.env.* keys to confirm variable names.

Project structure (recommended)
-------------------------------
A typical TypeScript frontend layout used by this project may look like:
- src/
  - components/       # Reusable UI components (Card, Rating, Navbar, etc.)
  - pages/ / routes/  # Route views or pages (Home, Anime details, Profile)
  - services/         # API clients and data fetching utilities
  - store/            # State management (Context/Redux/Pinia)
  - styles/           # Global styles, variables
  - utils/            # Helpers and utilities
  - types/            # Shared TypeScript types and interfaces
- public/             # Static assets
- .eslintrc, tsconfig.json, vite.config.ts (or next.config.js), package.json

Scripts
-------
Common npm scripts you might find in package.json (names may vary):
- dev / start — start dev server
- build — create production build
- preview — preview production build locally
- lint — run ESLint
- format — run Prettier
- test — run unit/integration tests

Testing and linting
-------------------
- Run tests: npm test
- Lint: npm run lint
- Format: npm run format

If tests or linting are not yet implemented, consider adding vitest/jest and ESLint + Prettier for consistency.

Data seeding / test data
------------------------
- If the frontend depends on an API, use a local backend or a mock server (MSW, json-server) for development.
- Some project versions include a seeding script that fetches data from public anime APIs (e.g., Jikan) — check /scripts or services/ for a seed or sync utility.

Known issues
------------
- This repo is a TypeScript-focused implementation; backend API details may vary between team versions.
- If the app expects an API, you might need to run the backend or configure a mock API endpoint to avoid broken UI.
- Adjust CORS or API paths if running backend and frontend on different hosts.

Contributing
------------
Contributions, bug reports and feature requests are welcome. Typical workflow:
1. Fork the repo
2. Create a new branch: feature/your-feature
3. Implement your change and add tests
4. Run lint and tests
5. Open a pull request describing the change

Please avoid committing local environment secrets, .mdf or system files.

License
-------
- This repository is licensed under the GNU General Public License v3.0 (GPL-3.0).
