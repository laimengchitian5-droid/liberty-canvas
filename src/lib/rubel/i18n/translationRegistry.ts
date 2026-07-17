import type { LocaleCode } from "@/types/rubel-i18n";

type TranslationTable = Partial<Record<LocaleCode, string>>;

/**
 * Mock translation registry keyed by source-language canonical strings.
 * Production would swap this for a TMS / LLM translation service.
 */
export const TRANSLATION_REGISTRY: Record<string, TranslationTable> = {
  // --- Titles ---
  "What kind of cat are you?": {
    ja: "あなたはどんなネコタイプ？",
    es: "¿Qué tipo de gato eres?",
    ko: "당신은 어떤 고양이 타입?",
    fr: "Quel type de chat es-tu ?",
  },
  あなたのネコ度診断: {
    en: "How Cat Are You? (Neko Diagnosis)",
    es: "¿Qué tan gato eres? (Diagnóstico Neko)",
    ko: "당신의 고양이 정도 진단",
    fr: "Quel est ton degré de chat ?",
  },
  "What Level of Introvert Are You?": {
    ja: "あなたの内向度レベル診断",
    es: "¿Qué tan introvertido eres?",
    ko: "당신의 내향성 레벨은?",
    fr: "Quel est ton niveau d'introversion ?",
  },
  "What's Your Burnout Archetype?": {
    ja: "あなたの燃え尽きアーキタイプ診断",
    es: "¿Cuál es tu arquetipo de burnout?",
    ko: "당신의 번아웃 유형은?",
    fr: "Quel est ton archétype d'épuisement ?",
  },

  // --- Cat/Dog results ---
  "Whimsical Black Cat Type": {
    ja: "気まぐれブラックキャットタイプ",
    es: "Tipo Gato Negro Caprichoso",
    ko: "변덕 블랙캣 타입",
    fr: "Type Chat Noir Fantaisiste",
  },
  "Loyal Golden Dog Type": {
    ja: "忠実ゴールデンドッグタイプ",
    es: "Tipo Perro Dorado Leal",
    ko: "충성 골든독 타입",
    fr: "Type Chien Doré Loyal",
  },

  // --- Introvert results ---
  "Soft Introvert": {
    ja: "ソフト内向タイプ",
    es: "Introvertido Suave",
    ko: "소프트 내향형",
    fr: "Introverti Doux",
  },
  "Deep Introvert": {
    ja: "ディープ内向タイプ",
    es: "Introvertido Profundo",
    ko: "딥 내향형",
    fr: "Introverti Profond",
  },
  "Social Introvert": {
    ja: "ソーシャル内向タイプ",
    es: "Introvertido Social",
    ko: "소셜 내향형",
    fr: "Introverti Social",
  },

  // --- Burnout results ---
  "Overgiver Flame": {
    ja: "与えすぎフレイム",
    es: "Llama Donadora Excesiva",
    ko: "과잉 헌신 플레임",
    fr: "Flamme Trop Donneuse",
  },
  "Perfectionist Engine": {
    ja: "完璧主義エンジン",
    es: "Motor Perfeccionista",
    ko: "완벽주의 엔진",
    fr: "Moteur Perfectionniste",
  },

  // --- JA cat diagnosis results ---
  マイペース黒猫タイプ: {
    en: "My-Pace Black Cat Type",
    es: "Tipo Gato Negro a Mi Ritmo",
    ko: "마이페이스 흑묘 타입",
    fr: "Type Chat Noir à Son Rythme",
  },
  社交的犬タイプ: {
    en: "Social Dog Type",
    es: "Tipo Perro Social",
    ko: "사교적 강아지 타입",
    fr: "Type Chien Social",
  },

  // --- Questions (cat/dog EN) ---
  "How do you spend your weekends?": {
    ja: "週末はどう過ごしますか？",
    es: "¿Cómo pasas los fines de semana?",
    ko: "주말을 어떻게 보내나요?",
    fr: "Comment passes-tu tes week-ends ?",
  },
  "Your ideal morning routine looks like…": {
    ja: "理想の朝のルーティンは…",
    es: "Tu rutina matutina ideal se ve así…",
    ko: "이상적인 아침 루틴은…",
    fr: "Ta routine matinale idéale ressemble à…",
  },
  "At a gathering, you usually…": {
    ja: "集まりでは、たいてい…",
    es: "En una reunión, normalmente…",
    ko: "모임에서 당신은 보통…",
    fr: "Lors d'un rassemblement, tu…",
  },
  "When you feel stressed, you tend to…": {
    ja: "ストレスを感じたとき、あなたは…",
    es: "Cuando te sientes estresado, tiendes a…",
    ko: "스트레스를 받으면 보통…",
    fr: "Quand tu es stressé, tu as tendance à…",
  },
  "Picking a gift for a friend, you choose…": {
    ja: "友達へのプレゼント選びでは…",
    es: "Al elegir un regalo para un amigo, eliges…",
    ko: "친구 선물을 고를 때 당신은…",
    fr: "Pour offrir un cadeau à un ami, tu choisis…",
  },

  // --- Options cat/dog EN ---
  "Curled up with a book and tea at home": {
    ja: "家で本とお茶にくるまる",
    es: "En casa con un libro y té",
    ko: "집에서 책과 차와 함께",
    fr: "Recroquevillé avec un livre et du thé",
  },
  "Out exploring parks with friends": {
    ja: "友達と公園を探索",
    es: "Explorando parques con amigos",
    ko: "친구들과 공원 탐험",
    fr: "Explorer les parcs avec des amis",
  },
  "Slow stretches, soft music, no rush": {
    ja: "ゆっくりストレッチ、穏やかな音楽、急がない",
    es: "Estiramientos lentos, música suave, sin prisa",
    ko: "천천히 스트레칭, 잔잔한 음악, 여유롭게",
    fr: "Étirements lents, musique douce, sans pression",
  },
  "Early walk, checklist, ready to go": {
    ja: "早朝散歩、チェックリスト、準備万端",
    es: "Caminata temprana, lista, listo para salir",
    ko: "이른 산책, 체크리스트, 준비 완료",
    fr: "Marche matinale, checklist, prêt à partir",
  },
  "Observe quietly, then share a thoughtful remark": {
    ja: "静かに観察し、 thoughtful な一言",
    es: "Observar en silencio, luego un comentario reflexivo",
    ko: "조용히 관찰 후 thoughtful 한 한마디",
    fr: "Observer en silence, puis une remarque réfléchie",
  },
  "Greet everyone and keep the energy moving": {
    ja: "全員に挨拶し、場のエネルギーを保つ",
    es: "Saludar a todos y mantener la energía",
    ko: "모두에게 인사하고 분위기 이끌기",
    fr: "Saluer tout le monde et maintenir l'énergie",
  },
  "Retreat to a cozy corner and reset alone": {
    ja: "居心地の良い場所に退いて一人でリセット",
    es: "Retirarte a un rincón acogedor y reiniciar solo",
    ko: "아늑한 곳으로 물러나 혼자 리셋",
    fr: "Se retirer dans un coin cosy et se ressourcer seul",
  },
  "Talk it through and make a quick action plan": {
    ja: "話して整理し、すぐ行動プランを立てる",
    es: "Hablarlo y hacer un plan de acción rápido",
    ko: "이야기하고 빠른 실행 계획 세우기",
    fr: "En parler et faire un plan d'action rapide",
  },
  "Something aesthetic and subtly personal": {
    ja: "美的で subtly パーソナルなもの",
    es: "Algo estético y sutilmente personal",
    ko: "미적이고 은은히 개인적인 것",
    fr: "Quelque chose d'esthétique et subtilement personnel",
  },
  "Something practical they will use every day": {
    ja: "毎日使える実用的なもの",
    es: "Algo práctico que usen a diario",
    ko: "매일 쓸 실용적인 것",
    fr: "Quelque chose de pratique qu'ils utilisent chaque jour",
  },

  // --- JA cat diagnosis questions ---
  "休日の過ごし方は？": {
    en: "How do you spend your days off?",
    es: "¿Cómo pasas tus días libres?",
    ko: "휴일을 어떻게 보내나요?",
    fr: "Comment passes-tu tes jours de repos ?",
  },
  "朝起きたら最初にすることは？": {
    en: "What's the first thing you do when you wake up?",
    es: "¿Qué haces primero al despertar?",
    ko: "아침에 일어나면 가장 먼저?",
    fr: "Que fais-tu en premier au réveil ?",
  },
  "友達からの連絡頻度は？": {
    en: "How often do friends reach out to you?",
    es: "¿Con qué frecuencia te contactan amigos?",
    ko: "친구들의 연락 빈도는?",
    fr: "À quelle fréquence tes amis te contactent ?",
  },
  "家でくつろぐときの定番ポーズは？": {
    en: "Your go-to pose when relaxing at home?",
    es: "¿Tu pose habitual al relajarte en casa?",
    ko: "집에서 쉴 때의 단골 포즈는?",
    fr: "Ta pose habituelle pour te détendre chez toi ?",
  },
  マイペースで本を読む: {
    en: "Read a book at my own pace",
    es: "Leer a mi ritmo",
    ko: "마이페이스로 책 읽기",
    fr: "Lire à mon rythme",
  },
  誰かを誘って外出する: {
    en: "Invite someone and go out",
    es: "Invitar a alguien y salir",
    ko: "누군가를 초대해 외출",
    fr: "Inviter quelqu'un et sortir",
  },
  窓辺で日向ぼっこ: {
    en: "Sunbathe by the window",
    es: "Tomar el sol junto a la ventana",
    ko: "창가에서 햇볕 쬐기",
    fr: "Prendre le soleil au bord de la fenêtre",
  },
  "To-doリストを確認する": {
    en: "Check my to-do list",
    es: "Revisar mi lista de tareas",
    ko: "할 일 목록 확인",
    fr: "Vérifier ma to-do list",
  },
  週に1回くらいで十分: {
    en: "Once a week is enough",
    es: "Una vez por semana es suficiente",
    ko: "주 1회면 충분",
    fr: "Une fois par semaine suffit",
  },
  毎日やり取りしたい: {
    en: "I want daily back-and-forth",
    es: "Quiero charlar a diario",
    ko: "매일 연락하고 싶다",
    fr: "Je veux échanger chaque jour",
  },
  丸くなってソファでゴロゴロ: {
    en: "Curl up and lounge on the sofa",
    es: "Enrollarme en el sofá",
    ko: "동그랗게 말아 소파에서 뒹굴",
    fr: "Me rouler en boule sur le canapé",
  },
  ストレッチしてから活動開始: {
    en: "Stretch, then start moving",
    es: "Estirar y luego activarme",
    ko: "스트레칭 후 활동 시작",
    fr: "M'étirer puis me mettre en action",
  },

  // --- Introvert questions ---
  "After a party, you feel…": {
    ja: "パーティーの後、あなたは…",
    es: "Después de una fiesta, te sientes…",
    ko: "파티 후 당신은…",
    fr: "Après une fête, tu te sens…",
  },
  "Drained — I need quiet time to recharge": {
    ja: "消耗 — 静かな時間で充電が必要",
    es: "Agotado — necesito silencio para recargar",
    ko: "지침 — 조용히 재충전 필요",
    fr: "Épuisé — j'ai besoin de calme pour me recharger",
  },
  "Energized — I love meeting new people": {
    ja: "エネルギッシュ — 新しい人に会うのが好き",
    es: "Con energía — me encanta conocer gente",
    ko: "활력 — 새 사람 만나는 게 좋다",
    fr: "Énergisé — j'adore rencontrer de nouvelles personnes",
  },
  "When a friend texts, you prefer…": {
    ja: "友達からメッセージが来たら…",
    es: "Cuando un amigo escribe, prefieres…",
    ko: "친구가 문자를 보내면…",
    fr: "Quand un ami envoie un message, tu préfères…",
  },
  "Time to think before replying": {
    ja: "返信前に考える時間が欲しい",
    es: "Tiempo para pensar antes de responder",
    ko: "답하기 전에 생각할 시간",
    fr: "Du temps pour réfléchir avant de répondre",
  },
  "Quick back-and-forth all day": {
    ja: "一日中サクサクやり取り",
    es: "Intercambio rápido todo el día",
    ko: "하루 종일 빠른 주고받기",
    fr: "Échanges rapides toute la journée",
  },
  "Your ideal work setup is…": {
    ja: "理想の仕事環境は…",
    es: "Tu entorno de trabajo ideal es…",
    ko: "이상적인 업무 환경은…",
    fr: "Ton environnement de travail idéal est…",
  },
  "Solo focus with headphones on": {
    ja: "ヘッドホンで一人集中",
    es: "Enfoque solo con auriculares",
    ko: "헤드폰 쓰고 혼자 집중",
    fr: "Focus solo avec un casque",
  },
  "Open floor with constant collaboration": {
    ja: "常に協働するオープンフロア",
    es: "Planta abierta con colaboración constante",
    ko: "끊임없이 협업하는 오픈 플로어",
    fr: "Open space avec collaboration constante",
  },
  "Unplanned weekend — you…": {
    ja: "予定のない週末 — あなたは…",
    es: "Fin de semana sin planes — tú…",
    ko: "계획 없는 주말 — 당신은…",
    fr: "Week-end sans plan — tu…",
  },
  "Stay in with a hobby or show": {
    ja: "趣味や番組を楽しんで家にいる",
    es: "Quedarte en casa con un hobby o serie",
    ko: "취미나 프로그램 보며 집에",
    fr: "Rester chez toi avec un hobby ou une série",
  },
  "Say yes to every invite that pops up": {
    ja: "飛び込む誘いには全部イエス",
    es: "Decir sí a cada invitación",
    ko: "뜨는 초대엔 전부 yes",
    fr: "Dire oui à chaque invitation",
  },

  // --- Burnout questions ---
  "When someone asks for help on your day off…": {
    ja: "休日に助けを求められたら…",
    es: "Cuando piden ayuda en tu día libre…",
    ko: "휴일에 도움을 요청받으면…",
    fr: "Quand on te demande de l'aide ton jour off…",
  },
  "I say yes even if I'm exhausted": {
    ja: "疲れていてもイエスと言う",
    es: "Digo que sí aunque esté agotado",
    ko: "지쳐도 yes라고 한다",
    fr: "Je dis oui même épuisé",
  },
  "I protect my rest without guilt": {
    ja: "罪悪感なく休息を守る",
    es: "Protejo mi descanso sin culpa",
    ko: "죄책감 없이 휴식을 지킨다",
    fr: "Je protège mon repos sans culpabilité",
  },
  "When you make a small mistake…": {
    ja: "小さなミスをしたとき…",
    es: "Cuando cometes un pequeño error…",
    ko: "작은 실수를 했을 때…",
    fr: "Quand tu fais une petite erreur…",
  },
  "I replay it for hours": {
    ja: "何時間も反芻する",
    es: "Lo repaso durante horas",
    ko: "몇 시간이나 되새긴다",
    fr: "Je le repasse pendant des heures",
  },
  "I fix it and move on quickly": {
    ja: "修正してすぐ前に進む",
    es: "Lo arreglo y sigo rápido",
    ko: "고치고 빨리 넘어간다",
    fr: "Je corrige et j'avance vite",
  },
  "Receiving praise makes you feel…": {
    ja: "褒められると…",
    es: "Recibir elogios te hace sentir…",
    ko: "칭찬을 받으면…",
    fr: "Recevoir des compliments te fait sentir…",
  },
  "Uncomfortable — I deflect it": {
    ja: "居心地が悪い — はぐらかす",
    es: "Incómodo — lo desvío",
    ko: "불편 — 피한다",
    fr: "Mal à l'aise — je dévie",
  },
  "Proud — I earned it": {
    ja: "誇らしい — 自分の成果",
    es: "Orgulloso — me lo gané",
    ko: "자랑스럽 — 내가 earned",
    fr: "Fier — je l'ai mérité",
  },
};

export function lookupTranslation(
  sourceText: string,
  sourceLanguage: LocaleCode,
  targetLanguage: LocaleCode,
): string | null {
  if (sourceLanguage === targetLanguage) {
    return sourceText;
  }

  const direct = TRANSLATION_REGISTRY[sourceText]?.[targetLanguage];

  if (direct) {
    return direct;
  }

  for (const [canonical, table] of Object.entries(TRANSLATION_REGISTRY)) {
    if (table[sourceLanguage] === sourceText) {
      const translated = table[targetLanguage];

      if (translated) {
        return translated;
      }
    }

    if (canonical === sourceText && table[targetLanguage]) {
      return table[targetLanguage] ?? null;
    }
  }

  return null;
}
