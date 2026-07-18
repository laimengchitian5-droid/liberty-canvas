import { buildBrandDiscoverCopyFrDe } from "@/lib/landing/brandLandingCopy";
import type { LandingPageCopy } from "@/lib/landing/landingCopy";
import type { EuropeanDiscoverLocale } from "@/lib/landing/landingLocales";
import type { LandingTopicSlug } from "@/lib/landing/landingTopics";
import { buildSpecialtyDiscoverCopyFrDe } from "@/lib/landing/specialtyLandingCopy";

const DISCLAIMER_FR =
  "Liberty Canvas utilise la science académique du Big Five et des archétypes Liberty originaux — pas d'instruments propriétaires sous licence.";
const DISCLAIMER_DE =
  "Liberty Canvas nutzt akademische Big-Five-Trait-Wissenschaft und originale Liberty-Archetypen — keine lizenzierten proprietären Typinstrumente.";

const TRUST_FR = "Science des traits · Routage instantané · Sans inscription";
const TRUST_DE = "Trait-Wissenschaft · Sofort-Routing · Ohne Anmeldung";

function licensedFaqFr(): LandingPageCopy["faq"] {
  return [
    {
      question: "S'agit-il d'un test sous licence ?",
      answer: DISCLAIMER_FR,
    },
    {
      question: "Faut-il un compte ?",
      answer: "Non. Une réponse suffit pour lancer le moteur Liberty Canvas.",
    },
  ];
}

function licensedFaqDe(): LandingPageCopy["faq"] {
  return [
    {
      question: "Ist das ein lizenzierter Test?",
      answer: DISCLAIMER_DE,
    },
    {
      question: "Brauche ich ein Konto?",
      answer: "Nein. Eine Antwort startet die Liberty Canvas-Engine.",
    },
  ];
}

type FrDeMatrix = Record<
  LandingTopicSlug,
  Record<EuropeanDiscoverLocale, LandingPageCopy>
>;

export const DISCOVER_COPY_FR_DE: FrDeMatrix = {
  ...buildSpecialtyDiscoverCopyFrDe(),
  ...buildBrandDiscoverCopyFrDe(),
  "enneagram-nine-types": {
    fr: {
      keyword: "Test du spectre motivationnel",
      title: "Test gratuit du spectre motivationnel — match IA cosmique | Liberty Canvas",
      headline: "Lequel des 9 motifs motivationnels vous habite ?",
      subhead:
        "Une réponse sincère → archétypes motivationnels Liberty Canvas et chat IA bienveillant. Science des traits académique — sans inscription.",
      metaDescription:
        "Test gratuit du spectre motivationnel. Une réponse, match cosmique IA et chat. Neuf motifs de motivation — sans connexion.",
      keywords: [
        "test spectre motivationnel",
        "motifs de motivation",
        "test personnalité gratuit",
        "Big Five traits",
        "Liberty Canvas",
      ],
      promptLabel: "Quelle peur ou quel désir vous anime le plus ?",
      promptPlaceholder: "ex. J'ai besoin de grandir sans perdre qui je suis…",
      submitLabel: "Révéler mon motif motivationnel →",
      trustLine: TRUST_FR,
      schemaName: "Quiz spectre motivationnel",
      schemaDescription:
        "Découverte de motifs motivationnels en une réponse avec compagnon IA bienveillant sur Liberty Canvas.",
      faq: [
        {
          question: "Couvre-t-il neuf motifs motivationnels ?",
          answer:
            "Oui — votre réponse est mappée à l'archétype motivationnel Liberty Canvas le plus proche.",
        },
        { question: "Instrument sous licence ?", answer: DISCLAIMER_FR },
      ],
    },
    de: {
      keyword: "Motivationsspektrum-Test",
      title: "Kostenloser Motivationsspektrum-Test — KI-Kosmos-Match | Liberty Canvas",
      headline: "Welches der 9 Motivationsmuster steckt in Ihnen?",
      subhead:
        "Eine ehrliche Antwort → Liberty Canvas-Motivations-Archetypen und bestärkender KI-Chat. Akademische Trait-Wissenschaft — ohne Anmeldung.",
      metaDescription:
        "Kostenloser Motivationsspektrum-Persönlichkeitstest. Eine Antwort, sofortiger KI-Kosmos-Match und Chat. Neun Antriebsmuster — ohne Login.",
      keywords: [
        "Motivationsspektrum Test",
        "Antriebsmuster",
        "kostenloser Persönlichkeitstest",
        "Big Five Traits",
        "Liberty Canvas",
      ],
      promptLabel: "Welche Angst oder welches Verlangen treibt Sie am meisten?",
      promptPlaceholder: "z. B. Ich muss wachsen, ohne mich selbst zu verlieren…",
      submitLabel: "Mein Motivationsmuster enthüllen →",
      trustLine: TRUST_DE,
      schemaName: "Motivationsspektrum-Persönlichkeitsquiz",
      schemaDescription:
        "Motivationsmuster-Entdeckung in einer Antwort mit bestärkendem KI-Begleiter auf Liberty Canvas.",
      faq: [
        {
          question: "Deckt es neun Motivationsmuster ab?",
          answer:
            "Ja — Ihre Antwort wird dem nächsten Liberty Canvas-Motivations-Archetyp zugeordnet.",
        },
        { question: "Lizenziertes Instrument?", answer: DISCLAIMER_DE },
      ],
    },
  },
  "mbti-personality-types": {
    fr: {
      keyword: "Test du spectre de personnalité",
      title: "Test de personnalité gratuit — résultat IA cosmique | Liberty Canvas",
      headline: "Axes de traits académiques → une réponse → votre personnage cosmique",
      subhead:
        "Une réponse honnête mappe votre profil de traits Liberty Canvas. Science Big Five — sans inscription.",
      metaDescription:
        "Test gratuit du spectre de personnalité en ligne. Une réponse, match cosmique IA + chat. Science Big Five — sans connexion.",
      keywords: [
        "test personnalité gratuit",
        "spectre de personnalité",
        "axes de traits",
        "Big Five",
        "Liberty Canvas",
      ],
      promptLabel: "Comment rechargez-vous vos batteries ?",
      promptPlaceholder: "ex. Après une fête, je lis seul·e pour retrouver mon énergie…",
      submitLabel: "Voir mon profil de traits →",
      trustLine: TRUST_FR,
      schemaName: "Quiz spectre de personnalité",
      schemaDescription:
        "Évaluation du spectre de personnalité en une réponse avec retour IA sur Liberty Canvas.",
      faq: licensedFaqFr(),
    },
    de: {
      keyword: "Persönlichkeitsspektrum-Test",
      title: "Kostenloser Persönlichkeitstest — KI-Kosmos-Ergebnis | Liberty Canvas",
      headline: "Akademische Trait-Achsen → eine Antwort → Ihr Kosmoscharakter",
      subhead:
        "Eine ehrliche Antwort mappt Ihr Liberty Canvas-Trait-Profil. Big-Five-Wissenschaft — ohne Anmeldung.",
      metaDescription:
        "Kostenloser Persönlichkeitsspektrum-Test online. Eine Antwort, KI-Kosmos-Match + Chat. Big-Five-Wissenschaft — ohne Login.",
      keywords: [
        "Persönlichkeitstest kostenlos",
        "Persönlichkeitsspektrum",
        "Trait-Achsen",
        "Big Five",
        "Liberty Canvas",
      ],
      promptLabel: "Wie laden Sie Ihre Batterien auf?",
      promptPlaceholder: "z. B. Nach Partys lese ich allein, um Energie zu tanken…",
      submitLabel: "Mein Trait-Profil anzeigen →",
      trustLine: TRUST_DE,
      schemaName: "Persönlichkeitsspektrum-Quiz",
      schemaDescription:
        "Persönlichkeitsspektrum-Bewertung in einer Antwort mit KI-Feedback auf Liberty Canvas.",
      faq: licensedFaqDe(),
    },
  },
  "sixteen-personalities": {
    fr: {
      keyword: "Test personnalité 4 axes",
      title: "Test 4 axes gratuit — match IA instantané | Liberty Canvas",
      headline: "Quatre axes de traits. Une réponse. Personnage cosmique instantané.",
      subhead:
        "Spectre à quatre axes mappé par Liberty Canvas AI. Pas d'instrument propriétaire — sans inscription.",
      metaDescription:
        "Test gratuit du spectre à 4 axes. Une réponse → personnage cosmique IA + chat. Sans connexion.",
      keywords: [
        "test 4 axes personnalité",
        "spectre de traits",
        "test personnalité gratuit",
        "Big Five",
        "Liberty Canvas",
      ],
      promptLabel: "Quel trait vous décrit le mieux au quotidien ?",
      promptPlaceholder:
        "ex. Je planifie tout à l'avance mais j'adore improviser en groupe…",
      submitLabel: "Voir mon match cosmique →",
      trustLine: TRUST_FR,
      schemaName: "Quiz spectre 4 axes",
      schemaDescription:
        "Découverte du spectre à quatre axes en une réponse avec Liberty Canvas.",
      faq: licensedFaqFr(),
    },
    de: {
      keyword: "4-Achsen-Persönlichkeitstest",
      title: "Kostenloser 4-Achsen-Test — sofortiger KI-Match | Liberty Canvas",
      headline: "Vier Trait-Achsen. Eine Antwort. Sofortiger Kosmoscharakter.",
      subhead:
        "Vier-Achsen-Spektrum von Liberty Canvas AI gemappt. Kein proprietäres Instrument — ohne Anmeldung.",
      metaDescription:
        "Kostenloser Vier-Achsen-Persönlichkeitsspektrum-Test. Eine Antwort → KI-Kosmoscharakter + Chat.",
      keywords: [
        "4 Achsen Persönlichkeitstest",
        "Trait-Spektrum",
        "Persönlichkeitstest kostenlos",
        "Big Five",
        "Liberty Canvas",
      ],
      promptLabel: "Welcher Trait beschreibt Sie im Alltag am besten?",
      promptPlaceholder: "z. B. Ich plane alles, liebe aber spontane Gruppenmomente…",
      submitLabel: "Meinen Kosmos-Match anzeigen →",
      trustLine: TRUST_DE,
      schemaName: "4-Achsen-Spektrum-Quiz",
      schemaDescription:
        "Vier-Achsen-Spektrum-Entdeckung in einer Antwort mit Liberty Canvas.",
      faq: licensedFaqDe(),
    },
  },
  "big-five-ocean": {
    fr: {
      keyword: "Test Big Five OCEAN",
      title: "Test Big Five (OCEAN) gratuit — résultat IA | Liberty Canvas",
      headline: "Découvrez votre profil OCEAN en une réponse sincère",
      subhead:
        "Ouverture, Conscienciosité, Extraversion, Agréabilité, Névrosisme — mappés instantanément par Liberty Canvas AI. Sans inscription.",
      metaDescription:
        "Test Big Five OCEAN gratuit. Une réponse, diagnostic IA et chat. Cinq facteurs de personnalité.",
      keywords: [
        "test Big Five",
        "OCEAN gratuit",
        "modèle à cinq facteurs",
        "test personnalité en ligne",
        "Liberty Canvas",
      ],
      promptLabel: "Quelle habitude révèle le plus votre personnalité ?",
      promptPlaceholder:
        "ex. Après des événements sociaux, je me recharge seul·e avec un livre…",
      submitLabel: "Voir mon type OCEAN →",
      trustLine: "12k+ participants · IA open source · Sans connexion",
      schemaName: "Quiz Big Five OCEAN",
      schemaDescription:
        "Évaluation Big Five (OCEAN) en une réponse avec retour IA instantané sur Liberty Canvas.",
      faq: [
        {
          question: "Est-ce le test Big Five officiel ?",
          answer:
            "C'est un intake rapide Liberty Canvas mappé aux dimensions OCEAN, conçu pour l'auto-insight plutôt qu'une certification clinique.",
        },
        {
          question: "Faut-il un compte ?",
          answer:
            "Non. Une réponse textuelle lance directement le moteur Liberty Canvas.",
        },
      ],
    },
    de: {
      keyword: "Big Five OCEAN Persönlichkeitstest",
      title: "Kostenloser Big-Five (OCEAN) Test — KI-Ergebnis | Liberty Canvas",
      headline: "Entdecken Sie Ihr OCEAN-Profil in einer ehrlichen Antwort",
      subhead:
        "Offenheit, Gewissenhaftigkeit, Extraversion, Verträglichkeit, Neurotizismus — sofort von Liberty Canvas AI gemappt. Ohne Anmeldung.",
      metaDescription:
        "Kostenloser Big-Five-OCEAN-Persönlichkeitstest. Eine Antwort, KI-Diagnose und Chat. Fünf-Faktoren-Modell.",
      keywords: [
        "Big Five Persönlichkeitstest",
        "OCEAN Test kostenlos",
        "Fünf-Faktoren-Modell",
        "Persönlichkeitstest online",
        "Liberty Canvas",
      ],
      promptLabel: "Welche Gewohnheit verrät am meisten über Ihre Persönlichkeit?",
      promptPlaceholder: "z. B. Nach Events lade ich allein mit einem Buch auf…",
      submitLabel: "Meinen OCEAN-Typ anzeigen →",
      trustLine: "12k+ Teilnehmer · Open-Source-KI · Ohne Login",
      schemaName: "Big-Five-OCEAN-Persönlichkeitsquiz",
      schemaDescription:
        "Big-Five-(OCEAN)-Bewertung in einer Antwort mit sofortigem KI-Feedback auf Liberty Canvas.",
      faq: [
        {
          question: "Ist das der offizielle Big-Five-Test?",
          answer:
            "Ein schneller Liberty Canvas-Intake, auf OCEAN-Dimensionen gemappt — für Selbsterkenntnis, nicht für klinische Zertifizierung.",
        },
        {
          question: "Brauche ich ein Konto?",
          answer: "Nein. Eine Textantwort startet direkt die Liberty Canvas-Engine.",
        },
      ],
    },
  },
  "introvert-personality": {
    fr: {
      keyword: "Test personnalité introvertie",
      title: "Test introverti vs extraverti — diagnostic IA gratuit",
      headline: "À quel point êtes-vous vraiment introverti·e ?",
      subhead: "Une phrase honnête → placement sur le spectre + IA qui vous comprend.",
      metaDescription:
        "Test gratuit de personnalité introvertie. Une réponse révèle votre niveau d'introversion avec chat IA.",
      keywords: [
        "test introverti",
        "introverti vs extraverti",
        "suis-je introverti",
        "test personnalité gratuit",
        "Liberty Canvas",
      ],
      promptLabel: "Qu'est-ce qui vous épuise le plus — les gens ou le silence ?",
      promptPlaceholder:
        "ex. Les small talks en soirée vident ma batterie en 20 minutes…",
      submitLabel: "Mesurer mon niveau d'introversion →",
      trustLine: "Accroche psychologie · Injection instantanée",
      schemaName: "Quiz niveau d'introversion",
      schemaDescription: "Évaluation du spectre d'introversion en une réponse.",
      faq: [
        {
          question: "L'introversion est-elle un trouble ?",
          answer: "Non — outil ludique d'auto-découverte, pas un diagnostic clinique.",
        },
        {
          question: "Les extravertis peuvent-ils l'utiliser ?",
          answer: "Absolument. Le spectre inclut aussi les ambivertis.",
        },
      ],
    },
    de: {
      keyword: "Introvert-Persönlichkeitstest",
      title: "Introvert vs Extravert — kostenlose KI-Diagnose",
      headline: "Wie introvertiert sind Sie wirklich?",
      subhead: "Ein ehrlicher Satz → Spektrum-Platzierung + KI, die Sie versteht.",
      metaDescription:
        "Kostenloser Introvert-Persönlichkeitstest. Eine Antwort zeigt Ihr Introversionsniveau mit KI-Chat.",
      keywords: [
        "Introvert Test",
        "Introvert vs Extravert",
        "bin ich introvertiert",
        "Persönlichkeitstest kostenlos",
        "Liberty Canvas",
      ],
      promptLabel: "Was erschöpft Sie schneller — Menschen oder Stille?",
      promptPlaceholder: "z. B. Smalltalk auf Partys leert meine Batterie in 20 Minuten…",
      submitLabel: "Mein Introvert-Niveau messen →",
      trustLine: "Psychologie-Hook · Sofort-Engine",
      schemaName: "Introvert-Niveau-Quiz",
      schemaDescription: "Introversionsspektrum-Bewertung in einer Antwort.",
      faq: [
        {
          question: "Ist Introversion eine Störung?",
          answer: "Nein — spielerisches Selbsterkenntnis-Tool, kein klinischer Befund.",
        },
        {
          question: "Können Extravertierte das nutzen?",
          answer: "Absolut. Das Spektrum umfasst auch Ambivertierte.",
        },
      ],
    },
  },
  "love-language-test": {
    fr: {
      keyword: "Test langage amoureux gratuit",
      title: "Test langage amoureux — diagnostic relationnel IA gratuit",
      headline: "Paroles, toucher, temps — quel est votre langage amoureux ?",
      subhead: "Une réponse vulnérable débloque votre archétype relationnel + miroir IA.",
      metaDescription:
        "Test gratuit du langage amoureux. Une réponse, archétype relationnel IA et chat bienveillant.",
      keywords: [
        "test langage amoureux",
        "langages de l'amour",
        "test relationnel",
        "quiz amour gratuit",
        "Liberty Canvas",
      ],
      promptLabel: "Quand vous vous sentez le plus aimé·e, que s'est-il passé ?",
      promptPlaceholder: "ex. Il·elle s'est souvenu·e d'un détail que j'avais mentionné…",
      submitLabel: "Révéler mon langage amoureux →",
      trustLine: "SEO relationnel · Zéro connexion",
      schemaName: "Quiz langage amoureux",
      schemaDescription: "Découverte du style de langage amoureux en une réponse.",
      faq: [
        {
          question: "Inspiré des cinq langages de l'amour ?",
          answer:
            "Inspiré du cadre des cinq langages amoureux — expérience Liberty Canvas originale.",
        },
        {
          question: "Pour les couples ?",
          answer: "Parfait en solo — partagez les résultats après.",
        },
      ],
    },
    de: {
      keyword: "Liebessprachen-Test kostenlos",
      title: "Liebessprachen-Test — kostenlose KI-Beziehungsdiagnose",
      headline: "Worte, Berührung, Zeit — was ist Ihre Liebessprache?",
      subhead:
        "Eine verletzliche Antwort enthüllt Ihren Beziehungs-Archetyp + KI-Spiegel.",
      metaDescription:
        "Kostenloser Liebessprachen-Persönlichkeitstest. Eine Antwort, KI-Beziehungs-Archetyp und bestärkender Chat.",
      keywords: [
        "Liebessprachen Test",
        "5 Liebessprachen",
        "Beziehungstest",
        "Liebesquiz kostenlos",
        "Liberty Canvas",
      ],
      promptLabel: "Wann fühlen Sie sich am meisten geliebt?",
      promptPlaceholder: "z. B. Er/sie erinnerte sich an ein Detail von vor Wochen…",
      submitLabel: "Meine Liebessprache enthüllen →",
      trustLine: "Beziehungs-SEO · Kein Login",
      schemaName: "Liebessprachen-Quiz",
      schemaDescription: "Liebessprachen-Stil-Entdeckung in einer Antwort.",
      faq: [
        {
          question: "Basierend auf dem Fünf-Liebessprachen-Modell?",
          answer:
            "Inspiriert vom Rahmen der fünf Liebessprachen — originelle Liberty Canvas-Erfahrung.",
        },
        {
          question: "Für Paare?",
          answer: "Ideal solo — Ergebnisse danach teilen.",
        },
      ],
    },
  },
  "attachment-style": {
    fr: {
      keyword: "Test style d'attachement",
      title: "Test style d'attachement — sécurisé, anxieux, évitant",
      headline: "Sécurisé, anxieux ou évitant — en une réponse",
      subhead: "Psychologie relationnelle allégée. Texte natif → moteur IA global.",
      metaDescription:
        "Test gratuit du style d'attachement. Sécurisé, anxieux, évitant, désorganisé — une réponse, insight IA.",
      keywords: [
        "test attachement",
        "théorie de l'attachement",
        "sécurisé anxieux évitant",
        "test relationnel",
        "Liberty Canvas",
      ],
      promptLabel: "Quand quelqu'un que vous aimez se tait, vous…",
      promptPlaceholder: "ex. Je panique jusqu'au prochain message, même si je le cache…",
      submitLabel: "Cartographier mon style d'attachement →",
      trustLine: "Inspiré clinique · Pas un avis médical",
      schemaName: "Évaluation style d'attachement",
      schemaDescription: "Auto-évaluation du style d'attachement en une réponse.",
      faq: [
        {
          question: "Remplace la thérapie ?",
          answer: "Non — auto-découverte ludique uniquement.",
        },
        {
          question: "Mes données sont-elles stockées ?",
          answer: "Votre réponse est traitée en session pour le moteur de jeu.",
        },
      ],
    },
    de: {
      keyword: "Bindungsstil-Test",
      title: "Bindungsstil-Test — sicher, ängstlich, vermeidend",
      headline: "Sicher, ängstlich oder vermeidend — in einer Antwort",
      subhead: "Beziehungspsychologie leicht gemacht. Nativer Text → globale KI-Engine.",
      metaDescription:
        "Kostenloser Bindungsstil-Test. Sicher, ängstlich, vermeidend, desorganisiert — eine Antwort, KI-Insight.",
      keywords: [
        "Bindungsstil Test",
        "Bindungstheorie Quiz",
        "sicher ängstlich vermeidend",
        "Beziehungstest",
        "Liberty Canvas",
      ],
      promptLabel: "Wenn jemand, den Sie lieben, schweigt, dann…",
      promptPlaceholder:
        "z. B. Ich drehe durch, bis eine Nachricht kommt, auch wenn ich es verberge…",
      submitLabel: "Meinen Bindungsstil kartieren →",
      trustLine: "Klinisch inspiriert · Kein Medizinrat",
      schemaName: "Bindungsstil-Bewertung",
      schemaDescription: "Bindungsstil-Selbstbewertung in einer Antwort.",
      faq: [
        {
          question: "Therapie-Ersatz?",
          answer: "Nein — nur unterhaltsame Selbsterkenntnis.",
        },
        {
          question: "Werden Daten gespeichert?",
          answer:
            "Ihre Antwort wird nur sitzungsweise an die Play-Engine weitergeleitet.",
        },
      ],
    },
  },
  "burnout-personality": {
    fr: {
      keyword: "Test personnalité burnout",
      title: "Test risque burnout — scan IA gratuit",
      headline: "Votre personnalité est-elle en burnout ?",
      subhead: "Une vérité sur votre charge → archétype burnout + IA supportive.",
      metaDescription:
        "Test gratuit de personnalité burnout. Une réponse révèle le type de risque et chat coaching IA.",
      keywords: [
        "test burnout",
        "personnalité burnout",
        "quiz burnout gratuit",
        "stress travail personnalité",
        "Liberty Canvas",
      ],
      promptLabel: "Comment l'épuisement se manifeste-t-il dans votre corps ?",
      promptPlaceholder: "ex. Ma poitrine se serre le dimanche soir avant lundi…",
      submitLabel: "Scanner le risque burnout →",
      trustLine: "SEO bien-être · Support IA",
      schemaName: "Quiz risque burnout",
      schemaDescription: "Dépistage personnalité burnout en une réponse.",
      faq: [
        {
          question: "Diagnostic médical ?",
          answer: "Non — auto-contrôle bien-être uniquement.",
        },
        {
          question: "Aide immédiate ?",
          answer: "En cas de crise, contactez les services d'urgence locaux.",
        },
      ],
    },
    de: {
      keyword: "Burnout-Persönlichkeitstest",
      title: "Burnout-Risiko-Persönlichkeitstest — kostenloser KI-Scan",
      headline: "Brennt Ihre Persönlichkeit aus?",
      subhead:
        "Eine Wahrheit über Ihre Belastung → Burnout-Archetyp + unterstützende KI.",
      metaDescription:
        "Kostenloser Burnout-Persönlichkeitstest. Eine Antwort zeigt Burnout-Risikotyp und KI-Coaching-Chat.",
      keywords: [
        "Burnout Test",
        "Burnout Persönlichkeit",
        "Burnout Quiz kostenlos",
        "Arbeitsstress Persönlichkeit",
        "Liberty Canvas",
      ],
      promptLabel: "Wie fühlt sich Erschöpfung in Ihrem Körper an?",
      promptPlaceholder: "z. B. Sonntagabend zieht sich meine Brust vor Montag zusammen…",
      submitLabel: "Burnout-Risiko scannen →",
      trustLine: "Wellness-SEO · KI-Unterstützung",
      schemaName: "Burnout-Risiko-Quiz",
      schemaDescription: "Burnout-Persönlichkeits-Screening in einer Antwort.",
      faq: [
        {
          question: "Medizinische Diagnose?",
          answer: "Nein — nur Wellness-Selbstcheck.",
        },
        {
          question: "Sofortige Hilfe?",
          answer: "Bei Krise wenden Sie sich an lokale Notdienste.",
        },
      ],
    },
  },
  "inner-child-healing": {
    fr: {
      keyword: "Test enfant intérieur",
      title: "Quiz enfant intérieur — réflexion IA gratuite",
      headline: "Que veut vous dire votre enfant intérieur ?",
      subhead: "Un souvenir, une phrase — archétype doux + miroir émotionnel IA.",
      metaDescription:
        "Quiz gratuit enfant intérieur. Une réponse, chat IA réflexif pour les schémas émotionnels.",
      keywords: [
        "test enfant intérieur",
        "guérison enfant intérieur",
        "travail enfant intérieur gratuit",
        "personnalité émotionnelle",
        "Liberty Canvas",
      ],
      promptLabel: "Un moment d'enfance qui vous façonne encore…",
      promptPlaceholder:
        "ex. On ne me félicitait que quand je restais calme et serviable…",
      submitLabel: "Rencontrer mon type enfant intérieur →",
      trustLine: "UX empathie d'abord · Sans compte",
      schemaName: "Quiz enfant intérieur",
      schemaDescription: "Réflexion archétype enfant intérieur en une réponse.",
      faq: [
        {
          question: "Remplace la thérapie ?",
          answer: "Non — expérience style journal réflexif.",
        },
        {
          question: "Mon texte est-il privé ?",
          answer: "Traité en session pour générer la réponse IA.",
        },
      ],
    },
    de: {
      keyword: "Inner-Child-Heilungstest",
      title: "Inner-Child-Quiz — kostenlose KI-Reflexion",
      headline: "Was will Ihr inneres Kind Ihnen sagen?",
      subhead: "Eine Erinnerung, ein Satz — sanfter Archetyp + emotionaler KI-Spiegel.",
      metaDescription:
        "Kostenloses Inner-Child-Persönlichkeitsquiz. Eine Antwort, reflektierender KI-Chat für emotionale Muster.",
      keywords: [
        "Inner Child Test",
        "Inner-Child-Heilung Quiz",
        "Inner-Child-Arbeit kostenlos",
        "emotionale Heilung Persönlichkeit",
        "Liberty Canvas",
      ],
      promptLabel: "Ein Kindheitserlebnis, das Sie noch prägt…",
      promptPlaceholder: "z. B. Lob nur, wenn ich ruhig und hilfsbereit blieb…",
      submitLabel: "Meinen Inner-Child-Typ treffen →",
      trustLine: "Empathie-first UX · Kein Konto",
      schemaName: "Inner-Child-Heilungsquiz",
      schemaDescription: "Inner-Child-Archetyp-Reflexion in einer Antwort.",
      faq: [
        {
          question: "Therapie-Ersatz?",
          answer: "Nein — journaling-ähnliche Reflexionserfahrung.",
        },
        {
          question: "Ist mein Text privat?",
          answer: "Nur sitzungsweise für KI-Antworten verarbeitet.",
        },
      ],
    },
  },
  "shadow-self-archetype": {
    fr: {
      keyword: "Test archétype ombre",
      title: "Test ombre — archétype jungien IA",
      headline: "Affrontez votre ombre. Une phrase suffit.",
      subhead: "Archétype d'ombre inspiré de Jung, mappé depuis votre confession native.",
      metaDescription:
        "Test gratuit archétype ombre. Inspiré Jung. Une réponse, chat miroir ombre IA.",
      keywords: [
        "test ombre",
        "archétype jungien quiz",
        "travail sur l'ombre",
        "test côté sombre personnalité",
        "Liberty Canvas",
      ],
      promptLabel: "Un trait que vous cachez par honte…",
      promptPlaceholder:
        "ex. Je désire secrètement plus de reconnaissance que je l'admets…",
      submitLabel: "Révéler mon archétype ombre →",
      trustLine: "Accroche jungienne · Moteur global",
      schemaName: "Quiz archétype ombre",
      schemaDescription: "Découverte archétype ombre jungien en une réponse.",
      faq: [
        {
          question: "Le travail sur l'ombre est-il dangereux ?",
          answer: "Légère auto-réflexion ludique, pas de thérapie profonde.",
        },
        {
          question: "Qui a créé ceci ?",
          answer: "Liberty Canvas — expérience cosmique de libération des belles âmes.",
        },
      ],
    },
    de: {
      keyword: "Schatten-Selbst-Archetyp-Test",
      title: "Schatten-Selbst-Test — jungianischer Archetyp KI",
      headline: "Stellen Sie sich Ihrem Schatten. Ein Satz genügt.",
      subhead:
        "Jung-inspirierter Schatten-Archetyp aus Ihrem nativen Geständnis gemappt.",
      metaDescription:
        "Kostenloser Schatten-Selbst-Archetyp-Test. Jung-inspiriert. Eine Antwort, KI-Schatten-Spiegel-Chat.",
      keywords: [
        "Schatten Selbst Test",
        "jungianischer Archetyp Quiz",
        "Schattenarbeit Persönlichkeit",
        "dunkle Seite Persönlichkeitstest",
        "Liberty Canvas",
      ],
      promptLabel: "Ein Trait, den Sie aus Scham verbergen…",
      promptPlaceholder:
        "z. B. Ich sehne mich heimlich nach Anerkennung mehr als ich zugebe…",
      submitLabel: "Meinen Schatten-Archetyp enthüllen →",
      trustLine: "Jung-Hook · Globale Engine",
      schemaName: "Schatten-Selbst-Archetyp-Quiz",
      schemaDescription: "Jungianische Schatten-Archetyp-Entdeckung in einer Antwort.",
      faq: [
        {
          question: "Ist Schattenarbeit gefährlich?",
          answer: "Leichte Selbstreflexion-Unterhaltung, keine Tiefentherapie.",
        },
        {
          question: "Wer hat das gebaut?",
          answer: "Liberty Canvas — kosmische Erfahrung zur Befreiung schöner Seelen.",
        },
      ],
    },
  },
};

export function getDiscoverCopyFrDe(
  slug: LandingTopicSlug,
  locale: EuropeanDiscoverLocale,
): LandingPageCopy {
  return DISCOVER_COPY_FR_DE[slug][locale];
}
