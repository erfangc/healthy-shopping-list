# Healthy Shopping List

A bilingual (English/Chinese) web app that curates healthy grocery items from [Weee!](https://www.sayweee.com), an Asian grocery platform. Products are selected based on health-conscious criteria: low LDL cholesterol impact, low glycemic index, low sodium, and low saturated fat — suitable for managing borderline high LDL, hypertension, and fatty liver.

## Features

- **Bilingual interface** — toggle between English and Simplified Chinese
- **156 products across 12 categories** — vegetables, fruits, tofu & vegan, seafood, lean meat, frozen picks, dry goods, instant & packaged, beverages, snacks, dairy & eggs, seasonings
- **Search** — real-time filtering across product names and health notes in both languages
- **Health benefit notes** — each product includes a note explaining why it was selected
- **Responsive design** — sidebar navigation on desktop, horizontal scroll tabs on mobile, 1–4 column grid
- **Dark mode** support
- **Direct links** to product pages on Weee!

## Tech Stack

- **React 19** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Cheerio** for data enrichment scripts (scraping product images and Chinese names)

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (with HMR)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | TypeScript check + Vite production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run scrape` | Enrich product data (fetch images & Chinese names from Weee!) |
| `npm run scrape:force` | Force re-scrape all products |

## Project Structure

```
src/
  components/       # React UI components
    Header.tsx      # Sticky header with search & language toggle
    Sidebar.tsx     # Category navigation
    ProductGrid.tsx # Product grid layout
    ProductCard.tsx # Individual product card
    Footer.tsx      # Footer with disclaimers
  data/
    grocery-items.json  # Product database
    classic-dishes.json # Classic dishes data
    categories.ts       # Category labels & metadata
    types.ts            # TypeScript interfaces
  App.tsx           # Main app (state management, filtering)
  main.tsx          # Entry point
  index.css         # Tailwind config & custom theme
scripts/
  enrich-data.ts    # Web scraper for product enrichment
```
