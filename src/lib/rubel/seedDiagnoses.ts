import type { Diagnosis } from "@/types/rubel";
import { inferCrossLingualKeywords } from "@/lib/rubel/i18n/constants";
import { normalizeSeedCatalog } from "@/lib/rubel/normalizeSingleQuestion";

function traitModifiers(openness: number, empathyNeed: number, ego: number) {
  return [
    { trait: "openness" as const, value: openness },
    { trait: "empathy_need" as const, value: empathyNeed },
    { trait: "ego" as const, value: ego },
  ];
}

export const JA_NEKO_DIAGNOSIS: Diagnosis = {
  id: "rubel-neko-ja-v1",
  title: "あなたのネコ度診断",
  creatorName: "@neko_studio",
  language: "ja",
  searchKeywords: inferCrossLingualKeywords(
    "あなたのネコ度診断 cat neko ネコ gato",
    "ja",
  ),
  totalSubmissions: 15600,
  results: [
    {
      id: "result-neko-black",
      name: "マイペース黒猫タイプ",
      baselineProfile: { openness: -4, empathy_need: -1, ego: 2 },
      aiConfig: {
        tone: "princess",
        activeTherapyMode: "unconditional_praise",
      },
    },
    {
      id: "result-inu-social",
      name: "社交的犬タイプ",
      baselineProfile: { openness: 4, empathy_need: 4, ego: -1 },
      aiConfig: {
        tone: "gal",
        activeTherapyMode: "emotional_mirror",
      },
    },
  ],
  questions: [
    {
      id: "q-holiday-ja",
      text: "休日の過ごし方は？",
      options: [
        {
          id: "q-holiday-ja-a",
          text: "マイペースで本を読む",
          scoreModifier: traitModifiers(-2, -1, 1),
        },
        {
          id: "q-holiday-ja-b",
          text: "誰かを誘って外出する",
          scoreModifier: traitModifiers(2, 2, -1),
        },
      ],
    },
    {
      id: "q-morning-ja",
      text: "朝起きたら最初にすることは？",
      options: [
        {
          id: "q-morning-ja-a",
          text: "窓辺で日向ぼっこ",
          scoreModifier: traitModifiers(-1, 0, 1),
        },
        {
          id: "q-morning-ja-b",
          text: "To-doリストを確認する",
          scoreModifier: traitModifiers(1, 1, -1),
        },
      ],
    },
    {
      id: "q-contact-ja",
      text: "友達からの連絡頻度は？",
      options: [
        {
          id: "q-contact-ja-a",
          text: "週に1回くらいで十分",
          scoreModifier: traitModifiers(-2, -2, 0),
        },
        {
          id: "q-contact-ja-b",
          text: "毎日やり取りしたい",
          scoreModifier: traitModifiers(2, 3, 1),
        },
      ],
    },
    {
      id: "q-pose-ja",
      text: "家でくつろぐときの定番ポーズは？",
      options: [
        {
          id: "q-pose-ja-a",
          text: "丸くなってソファでゴロゴロ",
          scoreModifier: traitModifiers(-2, -1, 2),
        },
        {
          id: "q-pose-ja-b",
          text: "ストレッチしてから活動開始",
          scoreModifier: traitModifiers(1, 1, -2),
        },
      ],
    },
  ],
};

export const SAMPLE_CAT_DOG_DIAGNOSIS: Diagnosis = {
  id: "rubel-cat-dog-v1",
  title: "What kind of cat are you?",
  creatorName: "@rubel_official",
  language: "en",
  searchKeywords: inferCrossLingualKeywords(
    "What kind of cat are you cat dog personality",
    "en",
  ),
  totalSubmissions: 8420,
  results: [
    {
      id: "result-cat",
      name: "Whimsical Black Cat Type",
      baselineProfile: { openness: -3, empathy_need: -2, ego: 2 },
      aiConfig: {
        tone: "princess",
        activeTherapyMode: "unconditional_praise",
      },
    },
    {
      id: "result-dog",
      name: "Loyal Golden Dog Type",
      baselineProfile: { openness: 4, empathy_need: 5, ego: -2 },
      aiConfig: {
        tone: "mentor",
        activeTherapyMode: "strict_coaching",
      },
    },
  ],
  questions: [
    {
      id: "q-weekend",
      text: "How do you spend your weekends?",
      options: [
        {
          id: "q-weekend-a",
          text: "Curled up with a book and tea at home",
          scoreModifier: traitModifiers(-2, -1, 1),
        },
        {
          id: "q-weekend-b",
          text: "Out exploring parks with friends",
          scoreModifier: traitModifiers(2, 2, -1),
        },
      ],
    },
    {
      id: "q-morning",
      text: "Your ideal morning routine looks like…",
      options: [
        {
          id: "q-morning-a",
          text: "Slow stretches, soft music, no rush",
          scoreModifier: traitModifiers(-1, 0, 1),
        },
        {
          id: "q-morning-b",
          text: "Early walk, checklist, ready to go",
          scoreModifier: traitModifiers(1, 1, -1),
        },
      ],
    },
    {
      id: "q-social",
      text: "At a gathering, you usually…",
      options: [
        {
          id: "q-social-a",
          text: "Observe quietly, then share a thoughtful remark",
          scoreModifier: traitModifiers(-2, -1, 0),
        },
        {
          id: "q-social-b",
          text: "Greet everyone and keep the energy moving",
          scoreModifier: traitModifiers(2, 2, -1),
        },
      ],
    },
    {
      id: "q-stress",
      text: "When you feel stressed, you tend to…",
      options: [
        {
          id: "q-stress-a",
          text: "Retreat to a cozy corner and reset alone",
          scoreModifier: traitModifiers(-1, -2, 1),
        },
        {
          id: "q-stress-b",
          text: "Talk it through and make a quick action plan",
          scoreModifier: traitModifiers(1, 2, -2),
        },
      ],
    },
    {
      id: "q-gift",
      text: "Picking a gift for a friend, you choose…",
      options: [
        {
          id: "q-gift-a",
          text: "Something aesthetic and subtly personal",
          scoreModifier: traitModifiers(-1, 0, 2),
        },
        {
          id: "q-gift-b",
          text: "Something practical they will use every day",
          scoreModifier: traitModifiers(1, 2, -1),
        },
      ],
    },
  ],
};

export const INTROVERT_LEVEL_DIAGNOSIS: Diagnosis = {
  id: "rubel-introvert-level-v1",
  title: "What Level of Introvert Are You?",
  creatorName: "@airfriend_labs",
  language: "en",
  searchKeywords: inferCrossLingualKeywords(
    "What Level of Introvert Are You introvert shy personality",
    "en",
  ),
  totalSubmissions: 12000,
  results: [
    {
      id: "result-soft-introvert",
      name: "Soft Introvert",
      baselineProfile: { openness: -2, empathy_need: 1, ego: -1 },
      aiConfig: {
        tone: "gal",
        activeTherapyMode: "emotional_mirror",
      },
    },
    {
      id: "result-deep-introvert",
      name: "Deep Introvert",
      baselineProfile: { openness: -5, empathy_need: -2, ego: 0 },
      aiConfig: {
        tone: "mentor",
        activeTherapyMode: "unconditional_praise",
      },
    },
    {
      id: "result-social-introvert",
      name: "Social Introvert",
      baselineProfile: { openness: 1, empathy_need: 3, ego: 1 },
      aiConfig: {
        tone: "tsundere",
        activeTherapyMode: "strict_coaching",
      },
    },
  ],
  questions: [
    {
      id: "q-party",
      text: "After a party, you feel…",
      options: [
        {
          id: "q-party-a",
          text: "Drained — I need quiet time to recharge",
          scoreModifier: traitModifiers(-3, -1, 0),
        },
        {
          id: "q-party-b",
          text: "Energized — I love meeting new people",
          scoreModifier: traitModifiers(3, 2, 1),
        },
      ],
    },
    {
      id: "q-text",
      text: "When a friend texts, you prefer…",
      options: [
        {
          id: "q-text-a",
          text: "Time to think before replying",
          scoreModifier: traitModifiers(-2, 0, -1),
        },
        {
          id: "q-text-b",
          text: "Quick back-and-forth all day",
          scoreModifier: traitModifiers(2, 2, 1),
        },
      ],
    },
    {
      id: "q-work",
      text: "Your ideal work setup is…",
      options: [
        {
          id: "q-work-a",
          text: "Solo focus with headphones on",
          scoreModifier: traitModifiers(-2, -2, 1),
        },
        {
          id: "q-work-b",
          text: "Open floor with constant collaboration",
          scoreModifier: traitModifiers(2, 3, -1),
        },
      ],
    },
    {
      id: "q-weekend-plan",
      text: "Unplanned weekend — you…",
      options: [
        {
          id: "q-weekend-plan-a",
          text: "Stay in with a hobby or show",
          scoreModifier: traitModifiers(-1, -1, 0),
        },
        {
          id: "q-weekend-plan-b",
          text: "Say yes to every invite that pops up",
          scoreModifier: traitModifiers(2, 2, 2),
        },
      ],
    },
  ],
};

export const BURNOUT_RISK_DIAGNOSIS: Diagnosis = {
  id: "rubel-burnout-v1",
  title: "What's Your Burnout Archetype?",
  creatorName: "@wellness_canvas",
  language: "en",
  searchKeywords: inferCrossLingualKeywords(
    "What's Your Burnout Archetype burnout stress exhausted",
    "en",
  ),
  totalSubmissions: 6800,
  results: [
    {
      id: "result-overgiver",
      name: "Overgiver Flame",
      baselineProfile: { openness: 2, empathy_need: 5, ego: -3 },
      aiConfig: {
        tone: "princess",
        activeTherapyMode: "emotional_mirror",
      },
    },
    {
      id: "result-perfectionist",
      name: "Perfectionist Engine",
      baselineProfile: { openness: -1, empathy_need: 0, ego: 4 },
      aiConfig: {
        tone: "tsundere",
        activeTherapyMode: "strict_coaching",
      },
    },
  ],
  questions: [
    {
      id: "q-boundary",
      text: "When someone asks for help on your day off…",
      options: [
        {
          id: "q-boundary-a",
          text: "I say yes even if I'm exhausted",
          scoreModifier: traitModifiers(1, 3, -2),
        },
        {
          id: "q-boundary-b",
          text: "I protect my rest without guilt",
          scoreModifier: traitModifiers(-1, -2, 2),
        },
      ],
    },
    {
      id: "q-mistake",
      text: "When you make a small mistake…",
      options: [
        {
          id: "q-mistake-a",
          text: "I replay it for hours",
          scoreModifier: traitModifiers(-2, 1, 3),
        },
        {
          id: "q-mistake-b",
          text: "I fix it and move on quickly",
          scoreModifier: traitModifiers(1, -1, -2),
        },
      ],
    },
    {
      id: "q-praise",
      text: "Receiving praise makes you feel…",
      options: [
        {
          id: "q-praise-a",
          text: "Uncomfortable — I deflect it",
          scoreModifier: traitModifiers(-1, 2, -3),
        },
        {
          id: "q-praise-b",
          text: "Proud — I earned it",
          scoreModifier: traitModifiers(0, -1, 3),
        },
      ],
    },
  ],
};

export const URA_SEISHIKI_DIAGNOSIS: Diagnosis = {
  id: "rubel-ura-seishiki-v1",
  title: "あなたの裏性格診断",
  creatorName: "@rubel_studio",
  language: "ja",
  searchKeywords: inferCrossLingualKeywords(
    "あなたの裏性格診断 裏性格 hidden personality ガラス 芸術家",
    "ja",
  ),
  totalSubmissions: 9200,
  results: [
    {
      id: "result-glass-artist",
      name: "ガラスのハートの芸術家タイプ",
      baselineProfile: { openness: 5, empathy_need: 4, ego: -2 },
      aiConfig: {
        tone: "gal",
        activeTherapyMode: "unconditional_praise",
      },
    },
    {
      id: "result-iron-realist",
      name: "鉄壁のリアリストタイプ",
      baselineProfile: { openness: -3, empathy_need: -2, ego: 3 },
      aiConfig: {
        tone: "tsundere",
        activeTherapyMode: "strict_coaching",
      },
    },
  ],
  questions: [
    {
      id: "q-inner-voice-ja",
      text: "一人の時間、頭の中で一番大きい声は？",
      options: [
        {
          id: "q-inner-voice-a",
          text: "「もっと自由に生きたい」",
          scoreModifier: traitModifiers(3, 2, -1),
        },
        {
          id: "q-inner-voice-b",
          text: "「ちゃんとしなきゃ」",
          scoreModifier: traitModifiers(-2, -1, 2),
        },
      ],
    },
    {
      id: "q-hurt-ja",
      text: "傷ついたとき、無意識にやることは？",
      options: [
        {
          id: "q-hurt-a",
          text: "創作や日記に逃げ込む",
          scoreModifier: traitModifiers(2, 3, -2),
        },
        {
          id: "q-hurt-b",
          text: "感情を封じて平常運転",
          scoreModifier: traitModifiers(-1, -2, 3),
        },
      ],
    },
    {
      id: "q-praise-ja",
      text: "褒められると本音では？",
      options: [
        {
          id: "q-praise-a",
          text: "嬉しいけど素直に受け取れない",
          scoreModifier: traitModifiers(2, 2, -1),
        },
        {
          id: "q-praise-b",
          text: "当然だと思う（照れない）",
          scoreModifier: traitModifiers(-1, -1, 3),
        },
      ],
    },
  ],
};

export const SEED_DIAGNOSES: Diagnosis[] = normalizeSeedCatalog([
  URA_SEISHIKI_DIAGNOSIS,
  JA_NEKO_DIAGNOSIS,
  INTROVERT_LEVEL_DIAGNOSIS,
  SAMPLE_CAT_DOG_DIAGNOSIS,
  BURNOUT_RISK_DIAGNOSIS,
]);

export const RUBEL_LOCAL_CATALOG_KEY = "rubel-diagnosis-catalog";

/** @deprecated Use RUBEL_LOCAL_CATALOG_KEY */
export const RUBEL_ACTIVE_DIAGNOSIS_KEY = RUBEL_LOCAL_CATALOG_KEY;
