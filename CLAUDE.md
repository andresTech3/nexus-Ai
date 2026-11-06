# Agencia IA - Dropshipping Platform

A Next.js application for dropshipping business automation with AI agents and social media content optimization.

## Core Tech Stack
- **Framework**: Next.js 15 (App Router, Server Components)
- **Database**: Supabase (PostgreSQL + Auth + Realtime)
- **UI**: Tailwind CSS + shadcn/ui components
- **Language**: TypeScript (strict)

## Package Manager
pnpm

---

## Available Skills by Category

### 🎯 Dropshipping & E-commerce (Product Research & Sales)

| Skill | Purpose |
|-------|---------|
| `dropshipping-product-research` | Research winning products for dropshipping |
| `shopify-dropshipping` | Shopify-specific dropshipping workflows |
| `domain-name-brainstormer` | Generate and check domain names for stores |
| `game-changing-features` | Find 10x opportunities for product growth |
| `requirements-clarity` | Clarify product/feature requirements before building |
| `frontend-to-backend-requirements` | Document API requirements for product features |
| `backend-to-frontend-handoff-docs` | Create API documentation for frontend integration |

### 📱 Social Media & Content Creation

| Skill | Purpose |
|-------|---------|
| `daily-meeting-update` | Generate daily standup/social media content updates |
| `taste-skill` | Build professional websites that don't look AI-made |
| `design-system-starter` | Create cohesive design systems for brand identity |
| `ui-ux-designer` | Expert UI/UX feedback for landing pages and apps |
| `frontend-design` | Distinctive visual design decisions |
| `ascii-ui-mockup-generator` | Create ASCII mockups before implementing |
| `mermaid-diagrams` | Create flowcharts for marketing funnels |
| `c4-architecture` | Generate architecture diagrams |

### 🚀 Marketing & Advertising

| Skill | Purpose |
|-------|---------|
| `codex` | Analyze codebases with GPT-5.2 (ad copy analysis, landing page optimization) |
| `gepetto` | Create detailed implementation plans for marketing campaigns |
| `professional-communication` | Draft emails, social posts, and outreach messages |
| `feedback-mastery` | Navigate difficult conversations with partners/influencers |
| `difficult-workplace-conversations` | Handle challenging business discussions |
| `session-handoff` | Save context when working on long campaigns |

### 💻 Development Tools

| Skill | Purpose |
|-------|---------|
| `commit-work` | Git best practices for tracking product iterations |
| `command-creator` | Create custom slash commands for workflows |
| `dependency-updater` | Smart dependency management |
| `naming-analyzer` | Better variable naming for code clarity |
| `react-dev` | React/TypeScript patterns for building features |
| `react-useeffect` | useEffect best practices |
| `web-to-markdown` | Convert web content to documentation |
| `writing-clearly-and-concisely` | Write better copy and documentation |
| `qa-test-planner` | Create test plans for features |
| `perplexity` | Web search for market research |
| `chatgpt` | Use ChatGPT for code analysis |
| `gemini` | Use Gemini for big context processing |

### 🎨 Design & UI

| Skill | Purpose |
|-------|---------|
| `taste-skill` | Build websites that look professionally designed |
| `ui-ux-designer` | Expert design feedback |
| `design-system-starter` | Create design systems |
| `frontend-design` | Visual design guidance from Anthropic |
| `ascii-ui-mockup-generator` | UI mockup generation |
| `animate` | Build animations that feel right |
| `choreograph` | Coordinate complex animations |
| `review-animations` | Critique existing motion |
| `improve-animations` | Audit codebase for animation opportunities |
| `mobile-native` | Mobile-specific design patterns |
| `react-dev` | React component patterns |
| `mui` | Material-UI patterns |

### 🧪 Quality & Review

| Skill | Purpose |
|-------|---------|
| `impeccable` | UI component quality control |
| `skill-judge` | Evaluate skill design quality |
| `qa-test-planner` | Generate test plans |
| `lesson-learned` | Extract lessons from code changes |

### 🔍 Utility

| Skill | Purpose |
|-------|---------|
| `humanizer` | Humanize AI text output |
| `jira` | Jira issue management |
| `openapi-to-typescript` | Convert API specs to types |
| `meme-factory` | Generate memes |
| `marp-slide` | Create presentation slides |
| `datadog-cli` | Production debugging |

---

## Slash Commands Available

### New Commands (7)
- `codex-plan` - Create detailed implementation plans with Codex
- `compose-email` - Draft professional emails
- `explain-pr-changes` - Summarize PRs
- `sync-branch` - Rebase on main
- `sync-skills-readme` - Update skills inventory
- `viral-tweet` - Create optimized social media posts

---

## Subagents Available (6)

- `ui-ux-designer` - Expert UI/UX feedback
- `mermaid-diagram-specialist` - Create Mermaid diagrams
- `codebase-pattern-finder` - Find similar code patterns
- `ascii-ui-mockup-generator` - Create ASCII mockups
- `communication-excellence-coach` - Review communication drafts
- `general-purpose` - Default agent for complex tasks

---

## MCP Servers Configured

### Supabase
Connected via MCP for database operations and user management

### 21st.dev
Connected via `npx @21st-dev/mcp@latest` with API key for:
- Searching React/Tailwind components
- Accessing pre-built UI components
- Finding templates and design blocks

---

## Key Workflows for Dropshipping Business

### Product Research Flow
1. Use `dropshipping-product-research` to find products
2. Use `domain-name-brainstormer` to check domain availability
3. Use `gepetto` to plan the product page implementation
4. Use `frontend-design` + `taste-skill` to design distinctive landing pages
5. Use `codex` to analyze ad copy performance

### Social Media Content Flow
1. Use `daily-meeting-update` for content planning
2. Use `taste-skill` to ensure posts don't look templated
3. Use `professional-communication` for captions
4. Use `ui-ux-designer` for post/visual design review

### Campaign Planning Flow
1. Use `requirements-clarity` to clarify campaign goals
2. Use `game-changing-features` to find high-impact opportunities
3. Use `sync-branch` to keep development in sync
4. Use `commit-work` for version control

---

## Project Structure
```
src/
├── app/                    # Next.js App Router
├── components/             # Reusable components
├── hooks/                  # Custom React hooks
├── lib/                    # Library utilities
│   └── security/           # Security utilities
├── tests/                  # Test files
└── types/                  # TypeScript types

.agents/
├── skills/                 # All skills (68 total)
│   ├── Dropshipping: dropshipping-product-research, shopify-dropshipping
│   ├── AI Tools: codex, gemini, perplexity
│   ├── Design: taste-skill, frontend-design, ui-ux-designer
│   ├── Architecture: c4-architecture, mermaid-diagrams
│   └── ... 50+ more
├── agents/                 # Subagents (6 total)
├── commands/               # Slash commands (9 total)
└── plugins/                # MCP plugins (supabase, 21st)
```

## Commands

**Run dev**: `pnpm dev`
**Build**: `pnpm build`
**Test**: `pnpm test`
**Lint**: `pnpm lint`

## Environment Variables Required

### API Keys Needed (All Free Options):

| Variable | Required For | Cómo Obtener |
|----------|--------------|--------------|
| `META_APP_ID` | Meta/Facebook Ads & Instagram | https://developers.facebook.com/ → Crear app gratuita |
| `META_APP_SECRET` | Meta OAuth | En la app de Facebook Developer |
| `GEMINI_API_KEY` | Gemini AI | https://aistudio.google.com/ → API Key |
| `NEXT_PUBLIC_SUPABASE_*` | Base de datos | Ya configurado en .env.local |

### Pasos para Conectar Meta API (GRATIS):

1. Ve a https://developers.facebook.com/
2. Crea una nueva app → "Business"
3. Activa estos productos:
   - Marketing API
   - Instagram Basic Display API
4. Configura URL de redireccionamiento:
   - Local: `http://localhost:3000/api/v1/meta/callback`
   - Producción: `https://tu-dominio.com/api/v1/meta/callback`
5. Genera las credenciales y agrégalas a `.env.local`

### Uso en el proyecto:
```bash
# .env.local
META_APP_ID=123456789012345
META_APP_SECRET=abcdef123456789abcdef123456789
```

## Security

Important security files:
- `src/lib/security/bot-protection.ts` - Bot detection
- `src/lib/meta/oauth.ts` - OAuth helpers for Meta API
- Middleware handles auth protection

## MCP Servers Configured

### Supabase
Connected via MCP for database operations and user management

### 21st.dev  
Connected via `npx @21st-dev/mcp@latest` with API key for:
- Searching React/Tailwind components
- Accessing pre-built UI components