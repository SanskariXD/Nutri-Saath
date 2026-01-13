# LabelPadega Backend Implementation TODO

## Setup & Configuration ✅
- [x] Create package.json with dependencies
- [x] Create tsconfig.json with path mappings
- [x] Create .env.example with all environment variables
- [x] Create app.ts with Express setup and middleware
- [x] Create server.ts with startup logic
- [x] Create config/env.ts with Zod validation
- [x] Create config/cors.ts for CORS configuration
- [x] Create config/rateLimit.ts for rate limiting

## Middlewares ✅
- [x] Create middlewares/errorHandler.ts with Zod support
- [x] Create middlewares/requestId.ts for request tracking
- [x] Create middlewares/auth.ts with JWT support
- [x] Create middlewares/validate.ts for Zod validation

## Utils ✅
- [x] Create utils/logger.ts with Pino setup
- [x] Create utils/gtin.ts for barcode validation
- [x] Create utils/id.ts for ID generation
- [x] Create utils/time.ts for timestamp utilities
- [x] Create utils/units.ts for nutrition conversions

## Domain Layer ✅
- [x] Create domain/types.ts with common enums
- [x] Create domain/schemas/product.schema.ts with Zod schemas
- [x] Create domain/schemas/profile.schema.ts with Zod schemas
- [x] Create domain/schemas/score.schema.ts with Zod schemas
- [x] Create domain/schemas/report.schema.ts with Zod schemas
- [x] Create domain/schemas/bill.schema.ts with Zod schemas
- [x] Create domain/scoring/engine.ts with health scoring logic
- [x] Create domain/i18n/reasons.en.json with score reasons
- [x] Create domain/repositories/ProductRepo.ts interface
- [x] Create domain/repositories/ProfileRepo.ts interface
- [x] Create domain/repositories/Memory/ProductMemoryRepo.ts implementation
- [x] Create domain/repositories/Memory/ProfileMemoryRepo.ts implementation

## Jobs & Queues ✅
- [x] Create jobs/queue.ts with BullMQ setup
- [x] Create jobs/workers/ocrLabel.worker.ts
- [x] Create jobs/workers/ocrBill.worker.ts
- [x] Create jobs/workers/resolver.worker.ts

## Services Layer 🔄
- [x] Create services/products/product.service.ts
- [ ] Create services/products/product.controller.ts
- [ ] Create services/products/product.routes.ts
- [ ] Create services/products/connectors/off.connector.ts
- [ ] Create services/products/connectors/ocrlabel.connector.ts
- [ ] Create services/profiles/profiles.service.ts
- [ ] Create services/resolve/resolve.controller.ts
- [ ] Create services/resolve/resolve.routes.ts
- [ ] Create services/resolve/resolver.service.ts
- [ ] Create services/score/score.controller.ts
- [ ] Create services/score/score.routes.ts
- [ ] Create services/report/report.controller.ts
- [ ] Create services/report/report.routes.ts
- [ ] Create services/report/report.pdf.ts
- [ ] Create services/bills/bills.controller.ts
- [ ] Create services/bills/bills.routes.ts
- [ ] Create services/bills/bills.service.ts
- [ ] Create services/bills/oc rbill.connector.ts
- [ ] Create services/bills/match.service.ts
- [ ] Create services/abha/abha.controller.ts
- [ ] Create services/abha/abha.service.ts
- [ ] Create services/abha/abha.routes.ts
- [ ] Create services/learn/learn.controller.ts
- [ ] Create services/learn/learn.routes.ts
- [ ] Create services/search/search.service.ts

## Routes & Controllers 🔄
- [ ] Update routes.ts to include all service routes
- [ ] Create services/auth/auth.service.ts (if needed)

## OpenAPI & Documentation 🔄
- [ ] Update openapi/openapi.ts with all schemas and routes
- [ ] Add Swagger UI setup

## Docker & Deployment 🔄
- [ ] Update docker/Dockerfile for multi-stage build
- [ ] Update docker/docker-compose.yml with services
- [ ] Add healthchecks

## Seed Data & Tests 🔄
- [ ] Create seed/products.sample.json
- [ ] Create seed/lessons.sample.json
- [ ] Create seed/bills.sample.json
- [ ] Create seed/index.ts for seeding
- [ ] Create tests/unit/ for unit tests
- [ ] Create tests/e2e/ for e2e tests
- [ ] Update package.json scripts for testing

## Final Verification 🔄
- [ ] Test docker-compose up
- [ ] Verify /health endpoint
- [ ] Verify /docs OpenAPI
- [ ] Test CORS and rate limiting
- [ ] Test all MVP endpoints
- [ ] Run unit and e2e tests
- [ ] Verify seed data loading
- [ ] Test PDF generation
- [ ] Test ABHA flow
- [ ] Test bill OCR and matching

## Acceptance Criteria
- [ ] docker compose up brings api + redis up
- [ ] /health returns {status:"ok"}
- [ ] Swagger docs at /docs & /docs/json include all routes & schemas
- [ ] CORS allows FRONTEND_ORIGIN; rate limit active (60/min)
- [ ] Profiles CRUD works; abha/connect + callback flips abhaConnected
- [ ] Products: /products/:barcode hits OFF and caches result
- [ ] /search?q= returns seeded products with fuzzy matching
- [ ] Resolve: with barcode only → returns product; with images (OCR flag on) → enqueues job
- [ ] Score: returns correct grade & reason chips for sample inputs
- [ ] Learn: returns 5 lessons; language param switches strings
- [ ] FSSAI report: returns a valid 1-page PDF URL
- [ ] Bills: POST returns {billId}; GET returns summary with matched items
