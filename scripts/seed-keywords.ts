/**
 * YourVitalPrime — Seed Keywords Script
 * Run: npm run seed:keywords
 * Populates Firestore `keywords` collection with the initial 30-article content calendar
 */

import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore, Timestamp } from "firebase-admin/firestore";

initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();

interface SeedKeyword {
  keyword: string;
  keyword_secondary: string[];
  volume_est: number;
  kd_est: number;
  cpc_est: number;
  tier: 2 | 3 | 4;
  pillar: string;
  status: "queued";
  lang: "en";
  opportunity_score: number;
}

// opportunity_score = volume_est * (100 - kd_est) / 100
// Higher = better opportunity for a new site
const seedKeywords: SeedKeyword[] = [
  // TIER 4 — Ultra low competition, quick wins first
  {
    keyword: "can you build muscle at 70 years old",
    keyword_secondary: ["building muscle at 70", "muscle growth elderly"],
    volume_est: 900, kd_est: 10, cpc_est: 2.40, tier: 4, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 900 * (100 - 10) / 100,
  },
  {
    keyword: "grip strength test over 50",
    keyword_secondary: ["grip strength aging", "hand grip strength adults"],
    volume_est: 1400, kd_est: 15, cpc_est: 2.10, tier: 4, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 1400 * (100 - 15) / 100,
  },
  {
    keyword: "DEXA scan results muscle mass interpretation",
    keyword_secondary: ["DEXA scan body composition", "DEXA scan over 50"],
    volume_est: 700, kd_est: 8, cpc_est: 3.20, tier: 4, pillar: "longevity",
    status: "queued", lang: "en", opportunity_score: 700 * (100 - 8) / 100,
  },
  {
    keyword: "does creatine help with sarcopenia",
    keyword_secondary: ["creatine muscle wasting", "creatine elderly muscle"],
    volume_est: 900, kd_est: 9, cpc_est: 3.50, tier: 4, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 900 * (100 - 9) / 100,
  },
  {
    keyword: "resistance bands exercises for seniors over 60",
    keyword_secondary: ["resistance bands seniors workout", "elastic band exercises elderly"],
    volume_est: 1400, kd_est: 12, cpc_est: 1.90, tier: 4, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 1400 * (100 - 12) / 100,
  },

  // TIER 3 — Core content, medium competition
  {
    keyword: "creatine for seniors over 60",
    keyword_secondary: ["creatine supplement elderly", "creatine aging adults"],
    volume_est: 3200, kd_est: 25, cpc_est: 3.80, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 3200 * (100 - 25) / 100,
  },
  {
    keyword: "sarcopenia treatment at home",
    keyword_secondary: ["how to treat sarcopenia", "sarcopenia exercises at home"],
    volume_est: 2200, kd_est: 18, cpc_est: 3.20, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 2200 * (100 - 18) / 100,
  },
  {
    keyword: "how to reverse muscle loss after 60",
    keyword_secondary: ["regain muscle after 60", "reverse sarcopenia naturally"],
    volume_est: 2800, kd_est: 22, cpc_est: 2.90, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 2800 * (100 - 22) / 100,
  },
  {
    keyword: "muscle loss after 50",
    keyword_secondary: ["losing muscle over 50", "why am I losing muscle at 50"],
    volume_est: 3500, kd_est: 22, cpc_est: 2.80, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 3500 * (100 - 22) / 100,
  },
  {
    keyword: "protein intake for over 60",
    keyword_secondary: ["how much protein over 60", "protein needs elderly adults"],
    volume_est: 4200, kd_est: 28, cpc_est: 3.40, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 4200 * (100 - 28) / 100,
  },
  {
    keyword: "NMN vs NR supplement comparison",
    keyword_secondary: ["NMN NR which is better", "nicotinamide riboside vs NMN"],
    volume_est: 1500, kd_est: 32, cpc_est: 4.80, tier: 3, pillar: "longevity",
    status: "queued", lang: "en", opportunity_score: 1500 * (100 - 32) / 100,
  },
  {
    keyword: "NMN supplement benefits side effects",
    keyword_secondary: ["NMN supplement review", "NMN anti-aging benefits"],
    volume_est: 5200, kd_est: 32, cpc_est: 4.60, tier: 3, pillar: "supplementation",
    status: "queued", lang: "en", opportunity_score: 5200 * (100 - 32) / 100,
  },
  {
    keyword: "best foods for muscle building after 50",
    keyword_secondary: ["foods that build muscle over 50", "high protein foods aging"],
    volume_est: 4500, kd_est: 26, cpc_est: 2.80, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 4500 * (100 - 26) / 100,
  },
  {
    keyword: "biological age vs chronological age test",
    keyword_secondary: ["how to test biological age", "biological age clock"],
    volume_est: 2500, kd_est: 20, cpc_est: 3.90, tier: 3, pillar: "longevity",
    status: "queued", lang: "en", opportunity_score: 2500 * (100 - 20) / 100,
  },
  {
    keyword: "metformin longevity anti-aging",
    keyword_secondary: ["metformin for longevity off-label", "metformin aging research"],
    volume_est: 3200, kd_est: 28, cpc_est: 4.20, tier: 3, pillar: "longevity",
    status: "queued", lang: "en", opportunity_score: 3200 * (100 - 28) / 100,
  },
  {
    keyword: "magnesium for sleep over 60",
    keyword_secondary: ["magnesium glycinate sleep elderly", "best magnesium for seniors"],
    volume_est: 2100, kd_est: 22, cpc_est: 3.10, tier: 3, pillar: "supplementation",
    status: "queued", lang: "en", opportunity_score: 2100 * (100 - 22) / 100,
  },
  {
    keyword: "collagen supplement after 50 does it work",
    keyword_secondary: ["collagen for skin aging", "collagen joints over 50"],
    volume_est: 5200, kd_est: 33, cpc_est: 4.10, tier: 3, pillar: "supplementation",
    status: "queued", lang: "en", opportunity_score: 5200 * (100 - 33) / 100,
  },
  {
    keyword: "perimenopause belly fat solution",
    keyword_secondary: ["perimenopause weight gain belly", "menopause abdominal fat"],
    volume_est: 7500, kd_est: 38, cpc_est: 3.60, tier: 3, pillar: "hormonal-health",
    status: "queued", lang: "en", opportunity_score: 7500 * (100 - 38) / 100,
  },
  {
    keyword: "strength training for women over 60",
    keyword_secondary: ["weight training women 60+", "resistance training senior women"],
    volume_est: 5500, kd_est: 30, cpc_est: 2.20, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 5500 * (100 - 30) / 100,
  },
  {
    keyword: "testosterone levels by age men chart",
    keyword_secondary: ["normal testosterone 50 year old man", "low testosterone symptoms over 50"],
    volume_est: 6500, kd_est: 35, cpc_est: 5.10, tier: 3, pillar: "hormonal-health",
    status: "queued", lang: "en", opportunity_score: 6500 * (100 - 35) / 100,
  },
  {
    keyword: "how to increase bone density after 50",
    keyword_secondary: ["improve bone density naturally", "osteoporosis prevention exercises"],
    volume_est: 8000, kd_est: 40, cpc_est: 3.70, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 8000 * (100 - 40) / 100,
  },
  {
    keyword: "stress cortisol belly fat aging",
    keyword_secondary: ["cortisol weight gain over 50", "reduce cortisol naturally"],
    volume_est: 3100, kd_est: 30, cpc_est: 2.90, tier: 3, pillar: "hormonal-health",
    status: "queued", lang: "en", opportunity_score: 3100 * (100 - 30) / 100,
  },
  {
    keyword: "protein for women over 50",
    keyword_secondary: ["how much protein women over 50", "protein needs menopause"],
    volume_est: 3800, kd_est: 25, cpc_est: 3.00, tier: 3, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 3800 * (100 - 25) / 100,
  },
  {
    keyword: "omega-3 benefits for adults over 50",
    keyword_secondary: ["fish oil supplement over 50", "omega-3 heart brain aging"],
    volume_est: 3500, kd_est: 28, cpc_est: 3.20, tier: 3, pillar: "supplementation",
    status: "queued", lang: "en", opportunity_score: 3500 * (100 - 28) / 100,
  },
  {
    keyword: "brain fog after 50 causes and solutions",
    keyword_secondary: ["cognitive decline 50s", "memory problems over 50"],
    volume_est: 4100, kd_est: 32, cpc_est: 3.80, tier: 3, pillar: "mental-vitality",
    status: "queued", lang: "en", opportunity_score: 4100 * (100 - 32) / 100,
  },
  {
    keyword: "longevity diet for over 50",
    keyword_secondary: ["what to eat for longevity over 50", "blue zone diet adults"],
    volume_est: 5500, kd_est: 35, cpc_est: 2.90, tier: 3, pillar: "longevity",
    status: "queued", lang: "en", opportunity_score: 5500 * (100 - 35) / 100,
  },
  {
    keyword: "sleep quality decline after 50 solutions",
    keyword_secondary: ["why sleep gets worse with age", "better sleep over 50"],
    volume_est: 4800, kd_est: 36, cpc_est: 3.10, tier: 3, pillar: "mental-vitality",
    status: "queued", lang: "en", opportunity_score: 4800 * (100 - 36) / 100,
  },

  // TIER 2 — Scale up after authority established (6+ months)
  {
    keyword: "vitamin D deficiency symptoms over 50",
    keyword_secondary: ["vitamin D supplement dosage elderly", "vitamin D and aging"],
    volume_est: 11000, kd_est: 44, cpc_est: 3.80, tier: 2, pillar: "supplementation",
    status: "queued", lang: "en", opportunity_score: 11000 * (100 - 44) / 100,
  },
  {
    keyword: "intermittent fasting for women over 50",
    keyword_secondary: ["intermittent fasting menopause", "16:8 fasting over 50"],
    volume_est: 18000, kd_est: 50, cpc_est: 2.40, tier: 2, pillar: "longevity",
    status: "queued", lang: "en", opportunity_score: 18000 * (100 - 50) / 100,
  },
  {
    keyword: "best exercises for men over 50",
    keyword_secondary: ["workout plan men over 50", "fitness after 50 male"],
    volume_est: 13000, kd_est: 46, cpc_est: 2.10, tier: 2, pillar: "muscle-strength",
    status: "queued", lang: "en", opportunity_score: 13000 * (100 - 46) / 100,
  },
  {
    keyword: "hormone replacement therapy explained",
    keyword_secondary: ["HRT benefits risks women", "menopause HRT options"],
    volume_est: 12000, kd_est: 48, cpc_est: 5.20, tier: 2, pillar: "hormonal-health",
    status: "queued", lang: "en", opportunity_score: 12000 * (100 - 48) / 100,
  },
];

async function seedKeywords() {
  console.log(`Seeding ${seedKeywords.length} keywords to Firestore...`);

  const batch = db.batch();

  for (const kw of seedKeywords) {
    const ref = db.collection("keywords").doc();
    batch.set(ref, {
      ...kw,
      created_at: Timestamp.now(),
      assigned_to_article: null,
      pipeline_run_id: null,
    });
  }

  await batch.commit();

  // Sort summary by opportunity score
  const sorted = [...seedKeywords].sort(
    (a, b) => b.opportunity_score - a.opportunity_score
  );

  console.log("\n✅ Keywords seeded successfully!");
  console.log("\nTop 10 by opportunity score:");
  sorted.slice(0, 10).forEach((kw, i) => {
    console.log(
      `${i + 1}. [Tier ${kw.tier}] "${kw.keyword}" — Score: ${kw.opportunity_score.toFixed(0)} (Vol: ${kw.volume_est}, KD: ${kw.kd_est})`
    );
  });
}

seedKeywords().catch(console.error);
