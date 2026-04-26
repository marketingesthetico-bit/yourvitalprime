/**
 * YourVitalPrime — Audience Personas
 * Used by Agent 3 (Article Writer) to calibrate voice, tone, and content depth
 */

export interface Persona {
  id: string;
  name: string;
  age_range: string;
  gender: string;
  pillars: string[];
  pain_points: string[];
  goals: string[];
  language_style: string;
  avoid: string[];
  writing_notes: string;
}

export const personas: Persona[] = [
  {
    id: "margaret",
    name: "Margaret",
    age_range: "52-62",
    gender: "female",
    pillars: ["hormonal-health", "muscle-strength", "mental-vitality"],
    pain_points: [
      "Sudden weight gain around the belly she can't explain",
      "Waking up at 3am drenched in sweat",
      "Feeling invisible at the gym — content written for 25-year-olds",
      "Doctors who dismiss her symptoms as 'normal aging'",
      "Losing the muscle tone she worked hard to build",
      "Brain fog that makes her feel like a different person",
    ],
    goals: [
      "Understand what's happening to her body without a medical degree",
      "Find practical, realistic steps — not a total lifestyle overhaul",
      "Feel like herself again",
      "Get through the day with energy left over",
    ],
    language_style:
      "Intelligent and direct. She's read the NHS guidance and found it useless. " +
      "She wants real information, not reassurance. Speak to her as a peer, " +
      "not a patient. She has a career, family, and limited time.",
    avoid: [
      "Patronizing explanations of basic biology",
      "Suggesting she 'just' do something complex",
      "Generic 'eat well and exercise' advice",
      "Overly technical jargon without plain-English explanation",
      "Cheerful positivity that ignores how hard this actually is",
    ],
    writing_notes:
      "Margaret respects evidence. Cite studies but translate them into plain English. " +
      "Acknowledge the frustration before offering solutions. She is not a hypochondriac — " +
      "she is paying attention to real changes in her body.",
  },
  {
    id: "david",
    name: "David",
    age_range: "55-68",
    gender: "male",
    pillars: ["muscle-strength", "longevity", "supplementation"],
    pain_points: [
      "Noticing his body doesn't recover like it used to",
      "Gut is growing despite no change in diet",
      "Lower energy — especially afternoon crash",
      "Wondering if testosterone is the issue or if it's something else",
      "Skeptical of supplements but open to evidence",
      "Doesn't want to become frail like his father",
    ],
    goals: [
      "Stay strong and independent as long as possible",
      "Understand which supplements are worth the money",
      "Have the energy to keep up with grandchildren",
      "Avoid the hospital as long as possible",
    ],
    language_style:
      "Practical and evidence-first. David is an engineer or business owner type. " +
      "He trusts data over anecdote. He is skeptical of health marketing. " +
      "He wants to understand mechanisms, not just 'take this pill'. " +
      "Speak man-to-man. No gym bro energy. No excessive positivity.",
    avoid: [
      "Gym-bro language ('crush it', 'gains', 'beast mode')",
      "Vague encouragement without specifics",
      "Assuming he's starting from zero fitness",
      "Treating 60 as if it means giving up",
      "Overselling supplements without acknowledging limitations",
    ],
    writing_notes:
      "David wants the honest version. If a supplement has mixed evidence, say so. " +
      "He will respect you more for the caveat than for the oversell. " +
      "Reference mechanisms (why something works at the cellular level) — " +
      "but keep it brief. He gets it quickly.",
  },
  {
    id: "carol",
    name: "Carol",
    age_range: "62-72",
    gender: "female",
    pillars: ["mental-vitality", "muscle-strength", "supplementation"],
    pain_points: [
      "Worried about memory decline and dementia risk",
      "Osteoporosis diagnosis — wants to understand what to actually do",
      "Feeling weak after a health scare that kept her inactive for months",
      "GP visits feel rushed — no time to discuss prevention",
      "Overwhelmed by conflicting health information online",
    ],
    goals: [
      "Stay independent and out of care homes as long as possible",
      "Understand which supplements have real evidence behind them",
      "Rebuild strength after a period of illness or inactivity",
      "Feel confident navigating the medical system",
    ],
    language_style:
      "Warm but not condescending. Carol is not technically minded but she is sharp. " +
      "She wants clarity, not complexity. Use 'you' liberally. Real examples. " +
      "Acknowledge that starting feels hard. She has faced real health challenges — " +
      "respect that without making her feel like a patient.",
    avoid: [
      "Any implication that it's 'too late' to make changes",
      "Overwhelming lists of things to change at once",
      "Dismissing fear about cognitive decline",
      "Suggesting she consult a doctor for everything — she already knows that",
    ],
    writing_notes:
      "Carol is motivated by independence and legacy (her grandchildren). " +
      "Frame health improvements in terms of what she can do, not what she avoids. " +
      "'You'll be able to carry your own groceries at 80' beats 'reduce fracture risk by 20%'. " +
      "Both are true. Lead with the human benefit.",
  },
];

/**
 * Get persona by pillar — returns most relevant persona for article topic
 */
export function getPersonaForPillar(pillar: string): Persona {
  const mapping: Record<string, string> = {
    "muscle-strength": "david",
    "hormonal-health": "margaret",
    supplementation: "carol",
    longevity: "david",
    "mental-vitality": "carol",
  };
  const personaId = mapping[pillar] || "margaret";
  return personas.find((p) => p.id === personaId) || personas[0];
}
