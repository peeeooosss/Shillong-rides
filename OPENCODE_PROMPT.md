# OpenCode prompt — Refactor Shillong Ride into a maintainable project

You are working on **Shillong Ride**, a premium, mobile-first vehicle rental website for Shillong, Meghalaya. The current prototype is in `src/App.jsx` as a single React component with inline CSS. Refactor it into a clean, production-minded structure **without changing the visual direction or removing existing UI sections/interactions**.

## First steps
1. Inspect the repository and read `README.md` and `TASKS.md`.
2. Preserve the current brand spelling: **Shillong Ride**.
3. Keep the visual system: forest green `#16372d`, deep pine `#244f40`, sage `#dce8d5`, mist `#f5f5ef`, paper `#fffefa`, amber `#dcae69`; typography uses Manrope for headings and DM Sans for body.
4. Keep the current premium Meghalaya travel aesthetic, responsive behavior, accessible controls, vehicle filters, favourites, vehicle detail modal, date search, destination cards, and toggleable admin preview.
5. Do not claim any demo action is a real booking or payment.

## Suggested target structure
- `src/App.jsx` — route/page composition
- `src/components/layout/Topline.jsx`
- `src/components/layout/Navbar.jsx`
- `src/components/layout/Footer.jsx`
- `src/components/booking/BookingSearch.jsx`
- `src/components/fleet/VehicleCard.jsx`
- `src/components/fleet/VehicleGrid.jsx`
- `src/components/fleet/VehicleDetailsModal.jsx`
- `src/components/destinations/DestinationCard.jsx`
- `src/components/sections/Hero.jsx`
- `src/components/sections/TrustStrip.jsx`
- `src/components/sections/HowItWorks.jsx`
- `src/components/admin/AdminPreview.jsx`
- `src/data/vehicles.js`
- `src/data/destinations.js`
- `src/hooks/` for reusable state/logic where appropriate
- `src/styles/tokens.css`
- `src/styles/global.css`
- `src/utils/formatCurrency.js`
- `README.md`
- `TASKS.md`
- `.env.example` only when configuration is actually needed

You may adjust this structure if a simpler, coherent structure fits the existing repository better. Do not create empty files or over-engineer.

## Implementation requirements
- Check package dependencies before adding anything; use `lucide-react` for icons.
- Keep React components small and readable; use stable keys.
- Avoid duplicated CSS and inline styles where practical.
- Preserve responsive layouts at mobile/tablet/desktop breakpoints.
- Add clear focus-visible states, sensible semantic landmarks, useful alt text, and keyboard-friendly modal behavior including Escape handling and focus management where feasible.
- Ensure date inputs enforce sensible pickup/return ordering and give accessible feedback.
- Fix broken or placeholder interactions. For actions not yet implemented, show a clear “coming in a later phase” message rather than implying success.
- Avoid invented ratings, reviews, availability, or business claims in production content. Keep any demo data clearly labeled as demo data.
- Keep external image URLs only as prototype placeholders and document that the client must approve/replace them.
- Do not add a real payment flow, fake authentication, fake API, or pretend backend. Build frontend interfaces only unless the repository already contains a backend and the user explicitly asks to connect it.
- Do not expose secrets in frontend environment variables or source code.
- Keep SEO basics ready: semantic headings, descriptive page title/meta description, social metadata, clean URL plan documented in README. Do not promise a Google ranking.
- Ensure `npm run build` succeeds.

## Verification
1. Inspect `package.json` and use the package manager already in the repository.
2. Run the available lint/test/build commands.
3. Fix errors caused by your changes.
4. Update README with exact setup and run instructions, component map, known limitations, and next steps.
5. Update TASKS.md by checking only tasks that are genuinely completed and verified.
6. At the end, summarise changed files, commands run, build/test status, and anything the user must configure manually.

Start by inspecting the project, then refactor in small steps. Do not rewrite the visual design from scratch.
