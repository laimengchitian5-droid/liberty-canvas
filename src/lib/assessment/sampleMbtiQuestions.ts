import { TestType, type Question } from "@/types/platform";

export const SAMPLE_MBTI_QUESTIONS: Question[] = [
  {
    id: "mbti-e-1",
    text: "大人数の集まりでエネルギーが湧いてくる。",
    type: TestType.MBTI,
    dimension: "E",
    weight: 1,
  },
  {
    id: "mbti-i-1",
    text: "一人の時間を確保しないと消耗してしまう。",
    type: TestType.MBTI,
    dimension: "I",
    weight: 1,
  },
  {
    id: "mbti-s-1",
    text: "事実と具体的なデータを重視する。",
    type: TestType.MBTI,
    dimension: "S",
    weight: 1,
  },
  {
    id: "mbti-n-1",
    text: "可能性やパターンを考えるのが好きだ。",
    type: TestType.MBTI,
    dimension: "N",
    weight: 1,
  },
  {
    id: "mbti-t-1",
    text: "判断するときは論理を優先する。",
    type: TestType.MBTI,
    dimension: "T",
    weight: 1,
  },
  {
    id: "mbti-f-1",
    text: "人への影響を最優先で考える。",
    type: TestType.MBTI,
    dimension: "F",
    weight: 1,
  },
  {
    id: "mbti-j-1",
    text: "計画通りに進めると安心する。",
    type: TestType.MBTI,
    dimension: "J",
    weight: 1,
  },
  {
    id: "mbti-p-1",
    text: "選択肢を開いたまま柔軟に進めたい。",
    type: TestType.MBTI,
    dimension: "P",
    weight: 1,
  },
];

export const SAMPLE_MBTI_TEST_ID = "sample-mbti-v1";
