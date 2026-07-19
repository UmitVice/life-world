# Life World

A full-stack real estate marketplace with resilient architecture and a polished user experience.

[Website](https://www.umitvice.com/) · [GitHub](https://github.com/UmitVice)

## Product capabilities

- Server-rendered discovery with URL-based filters and pagination
- List and interactive map views with custom property markers
- Responsive, optimized WebP imagery with original-image fallback
- Property detail pages with fullscreen gallery, amenities, rates, and map
- Credentials authentication, protected owner workflows, and admin authorization
- Typed Mongoose models, Zod validation, and authorized route handlers
- Curated sample fallback for public reads when MongoDB is unavailable
- Dark mode, accessible states, SEO metadata, and custom social preview

## Architecture

```text
Next.js 16 App Router
├── Public marketplace (SSR + URL state)
├── NextAuth credentials identity
├── Route handlers (Zod validation + authorization)
├── Property repository
│   ├── MongoDB / Mongoose production path
│   └── Typed read-only sample fallback
├── Leaflet map and geocoding layer
└── Responsive Tailwind CSS component system
```

The repository boundary is deliberate: production data is preferred whenever MongoDB is configured, while public read paths gracefully fall back to curated sample data. Authenticated writes always require real persistence.

## Local development

Requirements: Node.js 22 and Yarn 1.22+.

```bash
yarn install
cp .env.example .env.local
yarn dev
```

The public catalog remains explorable without secrets. Configure MongoDB and NextAuth values to enable registration, login, listing creation, and administration.

## Useful commands

```bash
yarn dev              # development server
yarn build            # production build and type checks
yarn seed             # seed MongoDB with sample properties
yarn optimize-images  # generate card/header/marker WebP variants
```

## Engineering decisions

- **URLs own discovery state:** filtered result sets are shareable and server-renderable.
- **Public reads degrade gracefully:** visitors never land on an empty catalog because infrastructure is asleep.
- **Writes stay honest:** the sample fallback never pretends to persist authenticated mutations.
- **Images are purpose-sized:** separate card, header, and marker variants reduce transfer cost and layout shift.
- **Capabilities are progressive:** browsing works first; identity unlocks owner and admin workflows.

## Roadmap

- Object-storage image uploads and transformation pipeline
- Saved searches, favorites, and notifications
- Contract tests for route handlers and end-to-end coverage for the core funnel
- Search conversion, API latency, and failure-rate observability

Built by [Ümit Vice](https://www.umitvice.com/). Public listings and contact details may contain sample data.
