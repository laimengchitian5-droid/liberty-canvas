const REF_SESSION_KEY = "lc-diagnosis-ref";
const LANG_SESSION_KEY = "lc-diagnosis-lang";

function readSessionValue(key: string): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}

function writeSessionValue(key: string, value: string): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    sessionStorage.setItem(key, value);
  } catch {
    // quota / private mode
  }
}

export function readDiagnosisRef(): string | null {
  return readSessionValue(REF_SESSION_KEY);
}

export function writeDiagnosisRef(ref: string): void {
  writeSessionValue(REF_SESSION_KEY, ref);
}

export function readDiagnosisLang(): string | null {
  return readSessionValue(LANG_SESSION_KEY);
}

export function writeDiagnosisLang(lang: string): void {
  writeSessionValue(LANG_SESSION_KEY, lang);
}
