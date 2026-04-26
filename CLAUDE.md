# YourVitalPrime.com — Claude Code Master Plan
> Health & Longevity for 50+ | Automated SEO Blog | English-first, Spanish-ready
> Domain: yourvitalprime.com | Timezone: Europe/Madrid

---

## Project Overview

An automated, SEO-first content website targeting adults 50+ searching for health, longevity, muscle, hormones, and supplementation content in English. Monetized via Google AdSense and affiliate programs. Built to pass AdSense quality review on first submission. Spanish expansion is architecturally ready from day one.

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Firebase (Firestore + Storage + Functions) · Vercel deployment

**Content cadence:** 1 article every 2 days to start (15/month)
**Content language:** English (primary) | Spanish (expansion, architecture ready)
**Monetization:** Google AdSense + affiliate links (supplements, wearables, health platforms)

---

## Project Structure

```
yourvitalprime/
├── CLAUDE.md                    ← This file (master instructions)
├── .env.local                   ← API keys (never commit)
├── .env.example                 ← Template for keys
│
├── src/
│   ├── app/                     ← Next.js App Router
│   │   ├── [lang]/              ← i18n root: /en/ and /es/
│   │   │   ├── page.tsx         ← Homepage
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx     ← Blog index
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx ← Article page
│   │   │   ├── about/page.tsx
│   │   │   ├── privacy/page.tsx
│   │   │   ├── terms/page.tsx
│   │   │   └── contact/page.tsx
│   │   ├── api/
│   │   │   ├── cron/
│   │   │   │   ├── generate-article/route.ts   ← Every 2 days
│   │   │   │   ├── keyword-research/route.ts   ← Weekly
│   │   │   │   ├── competitor-analysis/route.ts← Weekly
│   │   │   │   ├── seo-audit/route.ts          ← Daily
│   │   │   │   └── gsc-submit/route.ts         ← On publish
│   │   │   └── webhooks/route.ts
│   │   ├── sitemap.ts           ← Dynamic sitemap
│   │   ├── robots.ts
│   │   └── layout.tsx
│   │
│   ├── agents/                  ← AI Agent system
│   │   ├── article-writer.ts    ← Claude Sonnet — content generation
│   │   ├── humanizer.ts         ← Stop-Slop layer — removes AI patterns
│   │   ├── keyword-researcher.ts← GPT-4o-mini — keyword discovery
│   │   ├── competitor-spy.ts    ← GPT-4o-mini — SERP analysis
│   │   ├── seo-auditor.ts       ← GPT-4o-mini — on-page SEO scoring
│   │   ├── image-generator.ts   ← DALL-E 3 / Stability AI — featured + inline images
│   │   └── gsc-indexer.ts       ← Google Search Console API — auto-submit URLs
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── Navigation.tsx
│   │   ├── article/
│   │   │   ├── ArticleCard.tsx
│   │   │   ├── ArticlePage.tsx
│   │   │   ├── ArticleSchema.tsx ← JSON-LD structured data
│   │   │   ├── TableOfContents.tsx
│   │   │   ├── AuthorBox.tsx
│   │   │   └── RelatedArticles.tsx
│   │   ├── seo/
│   │   │   ├── MetaTags.tsx
│   │   │   ├── OpenGraph.tsx
│   │   │   └── StructuredData.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Badge.tsx
│   │       └── ReadingProgress.tsx
│   │
│   ├── lib/
│   │   ├── firebase.ts
│   │   ├── anthropic.ts
│   │   ├── openai.ts
│   │   ├── gsc.ts               ← Google Search Console client
│   │   └── utils.ts
│   │
│   ├── content/
│   │   ├── pillars.ts           ← Content pillar definitions
│   │   ├── keywords.ts          ← Seed keyword bank
│   │   └── personas.ts          ← Audience persona definitions
│   │
│   └── types/
│       ├── article.ts
│       ├── keyword.ts
│       └── agent.ts
│
├── firebase/
│   └── functions/               ← Firebase Functions (scheduled jobs backup)
│
├── scripts/
│   ├── seed-keywords.ts         ← Initialize keyword bank
│   ├── test-agents.ts           ← Test agent pipeline locally
│   └── submit-sitemap.ts        ← Manual GSC sitemap submission
│
└── public/
    ├── ads.txt                  ← AdSense verification
    ├── favicon.ico
    └── og-default.jpg
```

---

## Agent Architecture

### Agent 1: Keyword Researcher (Weekly, Monday 9:00 Madrid)
**Model:** GPT-4o-mini | **Trigger:** Cron weekly
**Job:**
- Pull current keyword bank from Firestore
- Search for new keyword opportunities using DataForSEO API or free Google Suggest scraping
- Score each keyword: volume estimate × (100 - KD) / 100 = opportunity score
- Prioritize Tier 3 (long-tail, KD < 40) and Tier 4 (KD < 20) for new sites
- Write results to Firestore `keywords` collection with status: `queued | assigned | published`
- Flag top 5 "Quick Win" keywords (KD < 25, vol > 500) for next content cycle

**Firestore schema — keywords collection:**
```json
{
  "keyword": "creatine for seniors over 60",
  "volume_est": 3200,
  "kd_est": 25,
  "cpc_est": 3.80,
  "tier": 3,
  "pillar": "muscle-strength",
  "status": "queued",
  "lang": "en",
  "created_at": "timestamp",
  "assigned_to_article": null
}
```

---

### Agent 2: Competitor Spy (Weekly, Tuesday 9:00 Madrid)
**Model:** GPT-4o-mini | **Trigger:** Cron weekly
**Job:**
- For each queued keyword, fetch top 10 Google results via SerpAPI (or ScrapingBee)
- Analyze: word count, heading structure, DA estimate, content gaps
- Score competitor weakness: if top 3 results are DA < 40 and word count < 1500 → HIGH opportunity
- Store analysis in Firestore `competitor_analysis` collection
- Update keyword `opportunity_score` based on SERP weakness
- Output: sorted list of "most attackable" keywords this week

---

### Agent 3: Article Writer (Every 2 days, 07:00 Madrid)
**Model:** Claude Sonnet 4.6 | **Trigger:** Cron every 2 days
**Job:**
1. Fetch top-scored keyword from Firestore (status: queued, highest opportunity_score)
2. Fetch competitor analysis for that keyword
3. Generate article with this structure:

**Article generation prompt framework:**
```
You are a health writer for YourVitalPrime.com, a trusted resource for adults 50+.
Your reader is [PERSONA from personas.ts].
Their pain: [keyword pain point]
Their goal: [what resolution looks like for them]

Write as a knowledgeable friend — someone who has been through it, researched it,
and is sharing what actually works. Not a doctor talking down. Not a cheerleader.
A straight-talking peer who respects their intelligence.

Article requirements:
- Title: Uses exact keyword naturally, emotionally resonant
- Length: 2000-3500 words
- Structure: Hook (pain) → Why it happens → What the science says → Practical steps → Real expectations
- Tone: Direct, warm, no jargon without explanation, conversational
- Images: [FEATURED_IMAGE_PROMPT] + [INLINE_IMAGE_1_PROMPT] + [INLINE_IMAGE_2_PROMPT]
- CTA: Soft, helpful, not salesy
- Internal links: 2-3 links to related published articles
- External links: 2-3 authoritative sources (NIH, Mayo Clinic, peer-reviewed studies)
- Meta description: 150-160 chars, includes keyword, compels click
- Schema: Article + FAQPage (3 questions extracted from content)
```

4. Pass draft to Agent 4 (Humanizer)
5. Pass to Agent 5 (SEO Auditor)
6. Generate images via Agent 6
7. Publish to Firestore + trigger Agent 7 (GSC Indexer)

**Firestore schema — articles collection:**
```json
{
  "slug": "creatine-for-seniors-over-60",
  "lang": "en",
  "title": "Creatine for Seniors Over 60: What the Science Actually Says",
  "meta_description": "...",
  "keyword_primary": "creatine for seniors over 60",
  "keywords_secondary": ["creatine elderly", "creatine muscle loss aging"],
  "pillar": "muscle-strength",
  "content_html": "...",
  "content_mdx": "...",
  "featured_image_url": "...",
  "inline_images": ["url1", "url2"],
  "word_count": 2840,
  "seo_score": 87,
  "schema_article": {},
  "schema_faq": {},
  "status": "published",
  "published_at": "timestamp",
  "gsc_submitted": true,
  "gsc_submitted_at": "timestamp",
  "lang_es_ready": false,
  "author": "editorial-team",
  "reading_time_min": 11
}
```

---

### Agent 4: Humanizer — Stop-Slop Layer
**Model:** Claude Sonnet 4.6 | **Trigger:** Called by Agent 3 after draft
**Job:**
Apply Stop-Slop skill rules to every article draft:
- Cut all filler openers, emphasis crutches, adverbs
- Break formulaic structures (no binary contrasts, no dramatic fragmentation)
- Force active voice — every sentence has a human subject
- Make it specific: no vague declaratives, no lazy extremes
- Put the reader in the room: "you" not "people", specifics not abstractions
- Vary rhythm: mix short and long sentences, two items beat three
- Score 1-10 on: Directness, Rhythm, Trust, Authenticity, Density
- If total score < 35/50 → rewrite the failing sections and rescore
- Return humanized content + score report

**Additional persona voice rules for 50+ audience:**
- Never talk down. This reader has lived more life than most writers.
- Reference real-life situations: retirement, grandchildren, career changes, energy dips
- Use "at our age" framing occasionally to build solidarity
- Avoid gym-bro language entirely
- Acknowledge what doesn't work before what does

---

### Agent 5: SEO Auditor (Runs after humanization + post-publish daily)
**Model:** GPT-4o-mini | **Trigger:** Post-generation + daily cron
**Job (pre-publish):**
- Check primary keyword in: title, H1, first 100 words, meta description, at least 2 subheadings, URL slug, image alt tags
- Count internal links (target: 2-4)
- Count external links to authority domains (target: 2-3)
- Check word count (target: 2000-3500)
- Check heading hierarchy (H1 → H2 → H3, no jumps)
- Check FAQ schema presence
- Check OG image and meta description length
- Score 0-100
- If score < 75 → return specific fix list to Article Writer for revision

**Job (post-publish daily monitoring):**
- Check GSC for impressions, clicks, CTR, average position per article
- Flag articles with impressions > 500 but CTR < 2% → needs title/meta optimization
- Flag articles ranking position 11-20 → candidates for content expansion
- Generate weekly SEO report to Firestore `seo_reports` collection

---

### Agent 6: Image Generator
**Model:** DALL-E 3 (featured) + Stability AI (inline) | **Trigger:** Called by Agent 3
**Job:**
Generate 3 images per article:

**Featured image (1200×630px — OG optimized):**
- Style: Warm, real-life photography aesthetic (not stock photo look)
- Subject: Real-looking adults 50-65, active, healthy, confident
- NOT: Hospital settings, sad imagery, generic wellness stock
- Include subtle text overlay space (left third clean for title overlay)
- Prompt template: "Warm, editorial photography style. A [specific scene matching article topic]. Natural lighting, authentic, aspirational but realistic. Adults 55-65. No text. 16:9 ratio."

**Inline image 1 (800×500px — concept/data visualization):**
- Infographic style showing key statistic or process from article
- Brand colors: deep navy + warm amber + clean white

**Inline image 2 (800×500px — practical/lifestyle):**
- Action shot or lifestyle image supporting the article's practical advice section

Store all images in Firebase Storage: `gs://yourvitalprime/articles/{slug}/`

---

### Agent 7: GSC Indexer (Triggered on article publish)
**Model:** No LLM — pure API | **Trigger:** On publish event
**Job:**
1. Call Google Search Console Indexing API with new article URL
2. Submit URL for indexing: `POST https://indexing.googleapis.com/v3/urlNotifications:publish`
3. Log response to Firestore `gsc_submissions`
4. On new sitemap update: ping Google via `https://www.google.com/ping?sitemap=https://yourvitalprime.com/sitemap.xml`
5. Retry failed submissions after 24h

**Required GSC setup:**
- Service account with Search Console access
- Verify ownership via DNS TXT record or HTML file
- Enable Google Indexing API in Google Cloud Console

---

## UI/UX Design System

### Brand Identity
**Name:** YourVitalPrime
**Tagline:** "Thrive past 50. On your terms."
**Personality:** Knowledgeable friend, not medical authority. Warm expert, not cheerleader.

### Visual Direction
**Aesthetic:** Editorial magazine meets modern wellness — refined, warm, trustworthy
**NOT:** Clinical white, generic stock photos, purple AI gradients, gym aesthetics

**Color Palette:**
```css
--color-primary: #1B3A4B;      /* Deep ocean — trust, depth */
--color-secondary: #C8773A;    /* Warm amber — energy, vitality */
--color-accent: #4A9B7F;       /* Sage green — health, nature */
--color-surface: #FAF8F5;      /* Warm white — readable, comfortable */
--color-surface-2: #F0EBE3;    /* Warm gray — card backgrounds */
--color-text: #1A1A2E;         /* Near-black — high readability */
--color-text-muted: #6B7280;   /* Muted gray — secondary text */
```

**Typography:**
```css
--font-display: 'Playfair Display', serif;    /* Headlines — editorial, authoritative */
--font-body: 'Source Serif 4', serif;         /* Body — readable at any size, warm */
--font-ui: 'DM Sans', sans-serif;             /* UI elements — clean, modern */

/* Sizes (mobile-first) */
--text-hero: clamp(2rem, 5vw, 3.5rem);
--text-h1: clamp(1.75rem, 4vw, 2.75rem);
--text-h2: clamp(1.375rem, 3vw, 1.875rem);
--text-body: 1.125rem;  /* 18px — critical for 50+ readability */
--line-height-body: 1.75;
```

**Key UX principles for 50+ audience:**
- Minimum font size 18px body, 16px secondary — never smaller
- High contrast: minimum 7:1 ratio for body text
- Large click targets: minimum 48×48px for all interactive elements
- No infinite scroll — paginated article lists with clear navigation
- Reading progress bar on article pages
- Table of contents on all articles (sticky on desktop)
- Estimated reading time displayed prominently
- No autoplaying media
- Print-friendly article styles

### Core Page Layouts

**Homepage:**
- Hero: Bold headline + subheadline + latest article CTA
- Featured article (large card, above fold)
- Content pillars navigation (5 visual cards)
- Latest articles grid (6 cards, 2 cols mobile / 3 cols desktop)
- Newsletter signup (simple, no dark patterns)
- Trust signals: "Evidence-based" + "Written for real adults" + article count

**Article page:**
- Full-width featured image with title overlay
- Article meta: author, date, reading time, pillar category
- Sticky table of contents (desktop)
- Body: Source Serif 4, 18px, max-width 720px, generous line-height
- Pull quotes for key stats
- Inline images with captions
- Ad placements: after intro paragraph, mid-article, end of article (AdSense auto-ads + manual placements)
- Related articles (3 cards)
- Author bio box
- FAQ section (schema-marked)

**Blog index:**
- Filter by pillar (Muscle & Strength / Hormones / Nutrition / Longevity / Mental Vitality)
- Sort by: Latest / Most Read / Quick Wins
- Article cards: image + category badge + title + excerpt + reading time

---

## Content Strategy

### 5 Content Pillars

**Pillar 1: Muscle & Strength** (`/en/muscle-strength`)
Core question: "How do I stop losing muscle and start gaining it back?"
Target: Men and women 52-68, noticing strength decline
Keywords: sarcopenia, muscle loss after 50, strength training over 60, creatine seniors

**Pillar 2: Hormonal Health** (`/en/hormonal-health`)
Core question: "What's happening to my body and what can I do about it?"
Target: Women 45-60 (perimenopause/menopause), men 50-65 (testosterone decline)
Keywords: perimenopause symptoms, testosterone after 50, hormone replacement, weight gain menopause

**Pillar 3: Smart Supplementation** (`/en/supplementation`)
Core question: "Which supplements actually work at my age?"
Target: Adults 50-70 researching evidence-based options
Keywords: NMN benefits, vitamin D over 50, collagen after 50, magnesium glycinate seniors

**Pillar 4: Longevity & Biohacking** (`/en/longevity`)
Core question: "How do I add healthy years, not just years?"
Target: Adults 45-60, forward-thinking, higher income
Keywords: biological age test, metformin anti-aging, healthspan vs lifespan, longevity diet

**Pillar 5: Mental Vitality** (`/en/mental-vitality`)
Core question: "How do I stay sharp and emotionally strong?"
Target: Adults 55-70, concerned about cognitive decline
Keywords: brain health after 50, memory supplements, sleep quality over 60, stress cortisol aging

### Content Calendar — First 30 Articles (Months 1-2)

Priority order based on KD × volume opportunity score:

| # | Title | Keyword | KD | Vol | Pillar | Publish Day |
|---|-------|---------|-----|-----|--------|-------------|
| 1 | Creatine for Seniors Over 60: What the Science Actually Says | creatine for seniors over 60 | 25 | 3.2K | Muscle | Day 1 |
| 2 | Why You're Losing Muscle After 50 (And the Simple Fix Most People Miss) | muscle loss after 50 | 22 | 3.5K | Muscle | Day 3 |
| 3 | Perimenopause Belly Fat: Why It Happens and What to Do About It | perimenopause weight gain belly fat | 38 | 7.5K | Hormonal | Day 5 |
| 4 | How Much Protein Do You Really Need After 60? | protein intake over 60 | 28 | 4.2K | Muscle | Day 7 |
| 5 | NMN vs NR: An Honest Comparison for Over 50s | NMN vs NR which is better | 32 | 1.5K | Longevity | Day 9 |
| 6 | Sarcopenia: The Muscle Thief You've Probably Never Heard Of | sarcopenia treatment at home | 18 | 2.2K | Muscle | Day 11 |
| 7 | The Truth About Vitamin D After 50 (Most People Get This Wrong) | vitamin D deficiency over 50 | 44 | 11K | Supplements | Day 13 |
| 8 | Strength Training After 60 for Women: Start Here | strength training for women over 60 | 30 | 5.5K | Muscle | Day 15 |
| 9 | Testosterone After 50: What's Normal, What's Not, What to Do | testosterone levels by age men | 35 | 6.5K | Hormonal | Day 17 |
| 10 | Does Collagen Actually Work After 50? We Looked at the Research | collagen after 50 does it work | 33 | 5.2K | Supplements | Day 19 |
| 11 | How to Increase Bone Density After 50: The Evidence-Based Guide | how to increase bone density after 50 | 40 | 8K | Muscle | Day 21 |
| 12 | Grip Strength After 50: The Surprising Health Predictor You Should Know | grip strength test over 50 | 15 | 1.4K | Muscle | Day 23 |
| 13 | Metformin for Longevity: What You Should Know Before Asking Your Doctor | metformin longevity anti aging | 28 | 3.2K | Longevity | Day 25 |
| 14 | Sleep After 50: Why It Changes and What Actually Helps | sleep quality over 60 | 36 | 4.8K | Mental | Day 27 |
| 15 | The Best Foods for Muscle After 50 (That You'll Actually Want to Eat) | best foods for muscle after 50 | 26 | 4.5K | Muscle | Day 29 |
| 16 | Biological Age vs Chronological Age: How to Test Yours | biological age vs chronological age test | 20 | 2.5K | Longevity | Day 31 |
| 17 | Intermittent Fasting Over 50: Does It Work Differently for Us? | intermittent fasting over 50 | 50 | 18K | Nutrition | Day 33 |
| 18 | Magnesium for Sleep After 60: What Type, What Dose | magnesium sleep over 60 | 22 | 2.1K | Supplements | Day 35 |
| 19 | Cortisol and Belly Fat After 50: Breaking the Cycle | stress cortisol aging | 30 | 3.1K | Hormonal | Day 37 |
| 20 | Can You Build Muscle at 70? Yes, Here's the Proof | can you build muscle at 70 | 10 | 1.1K | Muscle | Day 39 |
| 21 | DEXA Scan Results Explained: What Your Muscle and Bone Numbers Mean | DEXA scan results muscle mass | 8 | 700 | Longevity | Day 41 |
| 22 | The Longevity Diet After 50: What the Longest-Lived People Actually Eat | longevity diet over 50 | 35 | 5.5K | Longevity | Day 43 |
| 23 | Why Women Over 50 Need More Protein Than They Think | protein women over 50 | 25 | 3.8K | Muscle | Day 45 |
| 24 | HRT Explained Simply: Benefits, Risks, and Questions to Ask Your Doctor | hormone replacement therapy explained | 48 | 12K | Hormonal | Day 47 |
| 25 | Omega-3 After 50: Heart, Brain, Joints — What the Evidence Shows | omega 3 benefits over 50 | 28 | 3.5K | Supplements | Day 49 |
| 26 | The Best Exercises for Men Over 50 Who Hate the Gym | best exercises men over 50 | 46 | 13K | Muscle | Day 51 |
| 27 | Brain Fog After 50: Causes, Fixes, and When to See a Doctor | brain fog after 50 | 32 | 4.1K | Mental | Day 53 |
| 28 | Resistance Bands for Seniors: Full-Body Workout You Can Do at Home | resistance bands seniors workout | 12 | 1.4K | Muscle | Day 55 |
| 29 | NMN Supplement: Benefits, Side Effects, and Who Should Take It | NMN supplement benefits side effects | 32 | 5.2K | Supplements | Day 57 |
| 30 | How to Reverse Muscle Loss After 60: A Practical 12-Week Plan | how to reverse muscle loss after 60 | 22 | 2.8K | Muscle | Day 59 |

---

## Google AdSense Compliance Checklist

The site must pass AdSense review on first submission. Build with these requirements from day one:

### Content Quality Requirements
- [ ] Minimum 20-25 published articles before submitting (hit this at Day 40-50)
- [ ] Each article minimum 1800 words
- [ ] No duplicate content (each article unique, no scraped/spun text)
- [ ] All content in same primary language (English first)
- [ ] No affiliate links on initial review pages (add after approval)

### Required Pages (ship before Day 1)
- [ ] `/en/about` — Who we are, editorial mission, why we exist
- [ ] `/en/privacy` — Full GDPR + CCPA compliant privacy policy
- [ ] `/en/terms` — Terms of service
- [ ] `/en/contact` — Contact form or email
- [ ] `/en/disclaimer` — Medical disclaimer (YMYL requirement)

### Technical Requirements
- [ ] `ads.txt` in public root with AdSense publisher ID
- [ ] No broken links
- [ ] Mobile-friendly (Lighthouse mobile score > 85)
- [ ] Page load speed < 3s (Vercel edge + image optimization)
- [ ] SSL certificate (automatic on Vercel)
- [ ] Sitemap submitted to GSC before AdSense review

### Content Policy Compliance
- [ ] No copyrighted images (use DALL-E 3 generated + CC0 sources)
- [ ] Medical disclaimer on every health article
- [ ] No guaranteed health claims ("This will cure X" → never)
- [ ] External links to authoritative sources (NIH, Mayo, peer-reviewed)
- [ ] Author credibility section on every article

### YMYL (Your Money Your Life) Signals
- [ ] Transparent authorship ("Written by our editorial team, reviewed for accuracy")
- [ ] Date published + date last updated on every article
- [ ] Sources cited with links
- [ ] Medical disclaimer clearly visible
- [ ] No overpromising language

---

## i18n Architecture (Spanish Expansion Ready)

All content uses locale-based routing from day one:
- `/en/blog/[slug]` — English articles
- `/es/blog/[slug]` — Spanish articles (empty until expansion)

**Firestore structure supports bilingual from day one:**
Each article document has `lang` field + `translation_of` reference field.

**When expanding to Spanish:**
1. Agent 3 gains Spanish mode: same pipeline, different prompt persona
2. Spanish persona: "Escribes para adultos de 50+ en España/Latinoamérica..."
3. Spanish keyword bank: separate `keywords_es` collection
4. New domain or subdirectory: `yourvitalprime.com/es/` or `es.yourvitalprime.com`
5. GSC property created for Spanish version
6. Hreflang tags added to both versions

**Translation vs original:** Spanish articles are NOT translations — they are fresh, culturally adapted originals targeting Spanish-specific search intent.

---

## Environment Variables Required

```bash
# .env.local — NEVER COMMIT

# AI Models
ANTHROPIC_API_KEY=
OPENAI_API_KEY=

# Firebase
FIREBASE_PROJECT_ID=yourvitalprime
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

# Google APIs
GOOGLE_SERVICE_ACCOUNT_KEY=    # For GSC Indexing API
GSC_SITE_URL=https://yourvitalprime.com

# SERP / Keyword Research
SERPAPI_KEY=                   # For competitor SERP analysis
# Alternative: DataForSEO API (cheaper)
DATAFORSEO_LOGIN=
DATAFORSEO_PASSWORD=

# Image Generation
STABILITY_API_KEY=             # Stability AI for inline images

# Security
CRON_SECRET=                   # openssl rand -base64 32

# AdSense (add after approval)
NEXT_PUBLIC_ADSENSE_PUBLISHER_ID=ca-pub-XXXXXXXXXX
```

---

## Cron Schedule (Vercel Cron or Firebase Scheduled Functions)

```json
{
  "crons": [
    {
      "path": "/api/cron/generate-article",
      "schedule": "0 7 */2 * *"
    },
    {
      "path": "/api/cron/keyword-research",
      "schedule": "0 9 * * 1"
    },
    {
      "path": "/api/cron/competitor-analysis",
      "schedule": "0 10 * * 2"
    },
    {
      "path": "/api/cron/seo-audit",
      "schedule": "0 8 * * *"
    }
  ]
}
```

---

## Development Phases

### Phase 1 — Foundation (Week 1)
**Goal:** Site live with design system and required pages

Tasks:
- [ ] Next.js 14 project setup with TypeScript + Tailwind
- [ ] Firebase project creation + Firestore rules
- [ ] Design system: tokens, typography, color, base components
- [ ] Header + Footer + Navigation
- [ ] Homepage layout (static, no articles yet)
- [ ] About, Privacy, Terms, Contact, Disclaimer pages
- [ ] i18n routing structure `/[lang]/`
- [ ] Sitemap.ts + robots.ts
- [ ] Deploy to Vercel + connect yourvitalprime.com domain
- [ ] Verify domain in Google Search Console
- [ ] Submit sitemap to GSC

### Phase 2 — Agent Pipeline (Week 2)
**Goal:** Automated content generation working end-to-end

Tasks:
- [ ] Article Writer agent (Claude Sonnet)
- [ ] Humanizer agent (Stop-Slop layer)
- [ ] SEO Auditor agent (pre-publish checks)
- [ ] Image Generator agent (DALL-E 3 + Firebase Storage)
- [ ] GSC Indexer (Indexing API integration)
- [ ] Firestore schemas: articles, keywords, gsc_submissions
- [ ] API routes: /api/cron/generate-article
- [ ] Test pipeline end-to-end locally
- [ ] Seed initial keyword bank (use content calendar above)

### Phase 3 — Content Launch (Weeks 3-4)
**Goal:** First 10 articles live, SEO pipeline running

Tasks:
- [ ] Article page template (full UI)
- [ ] Blog index page with pillar filters
- [ ] ArticleCard component
- [ ] Table of contents (sticky)
- [ ] Reading progress bar
- [ ] Related articles
- [ ] JSON-LD structured data (Article + FAQPage)
- [ ] OG image generation per article
- [ ] Run article generation: articles 1-10
- [ ] Review all generated content manually before publish
- [ ] Submit each URL to GSC after publish

### Phase 4 — SEO & Analytics (Week 5)
**Goal:** Monitoring and optimization loop running

Tasks:
- [ ] Keyword Researcher agent
- [ ] Competitor Spy agent
- [ ] SEO Auditor post-publish daily cron
- [ ] SEO dashboard (Firestore → simple admin page)
- [ ] Google Analytics 4 integration
- [ ] Core Web Vitals monitoring (Vercel Analytics)
- [ ] Internal linking system (auto-suggest related articles)

### Phase 5 — AdSense Submission (Week 6-7, after 20+ articles)
**Goal:** AdSense approval

Tasks:
- [ ] Final content audit (all articles ≥ 1800 words, original, quality)
- [ ] All required pages live and complete
- [ ] `ads.txt` in place
- [ ] No broken links
- [ ] Mobile Lighthouse score > 85
- [ ] Apply for Google AdSense
- [ ] After approval: implement ad placements (after paragraph 2, mid-article, end)

### Phase 6 — Scale & Optimize (Month 3+)
**Goal:** Traffic growth and monetization

Tasks:
- [ ] Increase cadence: 1 article/day
- [ ] Add affiliate links (supplements, wearables)
- [ ] Title/meta A/B testing based on CTR data
- [ ] Content expansion: articles ranking 11-20 → expand to 3000+ words
- [ ] Newsletter setup (ConvertKit or similar)
- [ ] Social sharing optimization
- [ ] Plan Spanish expansion

---

## Skills Active in This Project

| Skill | Applied To | How |
|-------|-----------|-----|
| **stop-slop** | Every article | Agent 4 (Humanizer) applies all 12 rules + scores before publish |
| **frontend-design** | All UI components | Design tokens, typography, 50+-optimized UX |
| **content-strategy** | Content pillars + calendar | Hub-spoke structure, keyword-to-buyer-stage mapping |
| **ai-seo** | All articles | Structured content for LLM citation, clear positioning |
| **copywriting** | Headlines, meta, CTAs | Benefit-driven, audience-aware, no AI slop |

---

## Key Decisions Log

| Decision | Rationale |
|----------|-----------|
| Next.js 14 App Router | Same stack as existing blog project, SSR for SEO |
| Firebase | Same as existing project, familiar infra |
| Claude Sonnet for writing | Best long-form quality, natural voice |
| GPT-4o-mini for analysis agents | Cost-efficient for non-creative tasks |
| Source Serif 4 body font | Best readability for 50+ on screen |
| 18px minimum body | WCAG AAA for older readers |
| English-first | 3-5x higher AdSense CPC vs Spanish |
| Locale routing from day 1 | Avoid painful migration when scaling to Spanish |
| DALL-E 3 for featured images | Consistent style, no copyright issues |
| No AI image for faces | DALL-E face quality inconsistent — use abstract/lifestyle only |
