export const CONSENT_STORAGE_KEY = "personality-quiz-consent-v1";
export const CONSENT_FLAG_KEY = "personality-quiz-consent-flag";
export const CONSENT_VERSION = 1;
export const CONSENT_UPDATED_EVENT = "personality-consent-updated";

export type ConsentLevel = "pending" | "essential" | "all";

export interface ConsentRecord {
  level: ConsentLevel;
  analytics: boolean;
  marketing: boolean;
  timestamp: number;
  version: number;
}

const DEFAULT_RECORD: ConsentRecord = {
  level: "pending",
  analytics: false,
  marketing: false,
  timestamp: 0,
  version: CONSENT_VERSION,
};

function isConsentLevel(value: unknown): value is ConsentLevel {
  return value === "pending" || value === "essential" || value === "all";
}

function isConsentRecord(value: unknown): value is ConsentRecord {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as ConsentRecord;
  return (
    isConsentLevel(record.level) &&
    typeof record.analytics === "boolean" &&
    typeof record.marketing === "boolean" &&
    typeof record.timestamp === "number" &&
    typeof record.version === "number"
  );
}

function normalizeLegacyLevel(level: string): ConsentLevel {
  if (level === "analytics") {
    return "all";
  }

  if (level === "essential" || level === "all" || level === "pending") {
    return level;
  }

  return "pending";
}

export function readConsentFlag(): ConsentLevel {
  if (typeof window === "undefined") {
    return "pending";
  }

  const raw = window.localStorage.getItem(CONSENT_FLAG_KEY);

  if (!raw) {
    return "pending";
  }

  if (raw === "essential" || raw === "all") {
    return raw;
  }

  return "pending";
}

export function writeConsentFlag(level: "essential" | "all"): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(CONSENT_FLAG_KEY, level);
}

export function readConsentRecord(): ConsentRecord {
  if (typeof window === "undefined") {
    return DEFAULT_RECORD;
  }

  const flag = readConsentFlag();

  if (flag === "essential" || flag === "all") {
    return {
      level: flag,
      analytics: flag === "all",
      marketing: false,
      timestamp: Date.now(),
      version: CONSENT_VERSION,
    };
  }

  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_RECORD;
    }

    const parsed = JSON.parse(raw) as unknown;

    if (!isConsentRecord(parsed) || parsed.version !== CONSENT_VERSION) {
      return DEFAULT_RECORD;
    }

    const normalizedLevel = normalizeLegacyLevel(parsed.level);

    return {
      ...parsed,
      level: normalizedLevel,
      analytics: normalizedLevel === "all",
    };
  } catch {
    return DEFAULT_RECORD;
  }
}

export function writeConsentRecord(record: ConsentRecord): void {
  if (typeof window === "undefined") {
    return;
  }

  if (record.level === "essential" || record.level === "all") {
    writeConsentFlag(record.level);
  }

  window.localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(record));
  window.dispatchEvent(
    new CustomEvent(CONSENT_UPDATED_EVENT, {
      detail: record,
    }),
  );
}

export function hasAnalyticsConsent(): boolean {
  return readConsentRecord().level === "all";
}

export function hasResolvedConsent(): boolean {
  const flag = readConsentFlag();
  return flag === "essential" || flag === "all";
}

export function acceptEssentialConsent(): ConsentRecord {
  const record: ConsentRecord = {
    level: "essential",
    analytics: false,
    marketing: false,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  writeConsentRecord(record);
  return record;
}

export function acceptAllConsent(): ConsentRecord {
  const record: ConsentRecord = {
    level: "all",
    analytics: true,
    marketing: false,
    timestamp: Date.now(),
    version: CONSENT_VERSION,
  };

  writeConsentRecord(record);
  return record;
}

export function runIfAnalyticsConsented(callback: () => void): void {
  if (hasAnalyticsConsent()) {
    callback();
  }
}
