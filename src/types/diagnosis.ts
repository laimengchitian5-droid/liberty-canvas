export type PersonalityCategory =

  | "empathy"

  | "logic"

  | "creativity"

  | "leadership";



export const PERSONALITY_CATEGORIES: readonly PersonalityCategory[] = [

  "empathy",

  "logic",

  "creativity",

  "leadership",

] as const;



export interface DiagnosticOption {

  id: string;

  text: string;

  scores: Record<PersonalityCategory, number>;

}



/** Prompt-spec alias — same contract as `DiagnosticOption`. */

export type Option = DiagnosticOption;



export interface DiagnosticQuestion {

  id: string;

  index: number;

  text: string;

  category: PersonalityCategory;

  options: DiagnosticOption[];

}



/** Prompt-spec alias — same contract as `DiagnosticQuestion`. */

export type Question = DiagnosticQuestion;



export interface DiagnosticAnswer {

  questionId: string;

  optionId: string;

  selectedAt: number;

}



export interface CategoryScoreMap {

  empathy: number;

  logic: number;

  creativity: number;

  leadership: number;

}



export interface DiagnosisResult {

  id: string;

  title: string;

  subtitle: string;

  baseAnalysis: string;

  themeColor: string;

  dominantCategory: PersonalityCategory;

}



export interface DiagnosisEvaluation {

  scores: CategoryScoreMap;

  dominantCategory: PersonalityCategory;

  result: DiagnosisResult;

  isComplete: boolean;

  answeredCount: number;

  totalQuestions: number;

}



export interface AIPromptBlueprint {

  systemContext: string;

  temperature: number;

  maxTokens: number;

  responseSchema: string;

}



export interface PersonalizedAdvicePayload {

  personalizedAdvice: string;

  dailyTip: string;

  affirmation: string;

}



export interface DiagnosisAdviceRequestBody {

  result: DiagnosisResult;

  scores: CategoryScoreMap;

  answers: DiagnosticAnswer[];

}



export type DiagnosisPhase = "intro" | "questions" | "result" | "advice";



const SCORE = {

  empathy: { empathy: 3, logic: 0, creativity: 1, leadership: 0 },

  logic: { empathy: 0, logic: 3, creativity: 0, leadership: 1 },

  creativity: { empathy: 1, logic: 0, creativity: 3, leadership: 0 },

  leadership: { empathy: 0, logic: 1, creativity: 0, leadership: 3 },

} as const satisfies Record<string, Record<PersonalityCategory, number>>;



/**

 * Phase 1 sample matrix — 5 questions, Adult-Cute Japanese copy

 * tailored for an elegant everyday-life (主婦) demographic.

 */

export const SAMPLE_DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [

  {

    id: "q1",

    index: 0,

    text: "朝のキッチンで、いちばん心地よいと感じる瞬間はどれに近いですか？",

    category: "empathy",

    options: [

      {

        id: "q1-a",

        text: "家族の笑い声が聞こえて、テーブルがやわらかく温まるとき",

        scores: SCORE.empathy,

      },

      {

        id: "q1-b",

        text: "献立と時間配分が整い、落ち着いて動き出せるとき",

        scores: SCORE.logic,

      },

      {

        id: "q1-c",

        text: "お気に入りの器や色合いに、ふっと心が弾むとき",

        scores: SCORE.creativity,

      },

      {

        id: "q1-d",

        text: "今日の流れが見えて、余裕をもって始められるとき",

        scores: SCORE.leadership,

      },

    ],

  },

  {

    id: "q2",

    index: 1,

    text: "お買い物や用事の段取りを考えるとき、あなたが大切にしているのは？",

    category: "logic",

    options: [

      {

        id: "q2-a",

        text: "誰の負担も増やさない、やさしい配慮",

        scores: SCORE.empathy,

      },

      {

        id: "q2-b",

        text: "無駄のない順序と、無理のない予算感",

        scores: SCORE.logic,

      },

      {

        id: "q2-c",

        text: "季節感や小さな発見が楽しめる余白",

        scores: SCORE.creativity,

      },

      {

        id: "q2-d",

        text: "迷いなく進める、はっきりした優先順位",

        scores: SCORE.leadership,

      },

    ],

  },

  {

    id: "q3",

    index: 2,

    text: "おうち時間のなかで、心が静かに満たされるのはどんなときですか？",

    category: "creativity",

    options: [

      {

        id: "q3-a",

        text: "大切な人とゆっくり話せたあと",

        scores: SCORE.empathy,

      },

      {

        id: "q3-b",

        text: "片づけや記録が終わり、頭がすっと軽くなったあと",

        scores: SCORE.logic,

      },

      {

        id: "q3-c",

        text: "花や香り、音楽など、感性に触れたあと",

        scores: SCORE.creativity,

      },

      {

        id: "q3-d",

        text: "予定どおりに進み、次の一歩が見えたあと",

        scores: SCORE.leadership,

      },

    ],

  },

  {

    id: "q4",

    index: 3,

    text: "家族や身近な人との予定が重なったとき、最初に意識するのは？",

    category: "leadership",

    options: [

      {

        id: "q4-a",

        text: "みんなが無理なく、安心して過ごせるか",

        scores: SCORE.empathy,

      },

      {

        id: "q4-b",

        text: "現実的に可能かどうか、根拠を確かめること",

        scores: SCORE.logic,

      },

      {

        id: "q4-c",

        text: "その日を少し特別に感じられるかどうか",

        scores: SCORE.creativity,

      },

      {

        id: "q4-d",

        text: "全体の流れを整え、前に進められるか",

        scores: SCORE.leadership,

      },

    ],

  },

  {

    id: "q5",

    index: 4,

    text: "一日の終わり、「今日もよかったな」と感じやすいのはどんなときですか？",

    category: "empathy",

    options: [

      {

        id: "q5-a",

        text: "誰かの表情がやわらいだのを見られたとき",

        scores: SCORE.empathy,

      },

      {

        id: "q5-b",

        text: "小さなことも丁寧に片づけられたとき",

        scores: SCORE.logic,

      },

      {

        id: "q5-c",

        text: "日常の中に、美しい瞬間を見つけられたとき",

        scores: SCORE.creativity,

      },

      {

        id: "q5-d",

        text: "大切なことを一つ、前に進められたとき",

        scores: SCORE.leadership,

      },

    ],

  },

];



export const DIAGNOSTIC_QUESTION_COUNT = SAMPLE_DIAGNOSTIC_QUESTIONS.length;


