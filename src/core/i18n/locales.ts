import type { LocalePreference, SupportedLocale } from "@/core/i18n/types";

const systemLanguageMap: Array<{ match: RegExp; locale: SupportedLocale }> = [
  { match: /^zh\b/i, locale: "zh-CN" },
  { match: /^ja\b/i, locale: "ja-JP" },
];

export function detectSystemLocale(): SupportedLocale {
  if (typeof navigator === "undefined") {
    return "en-US";
  }

  const candidates = [...(navigator.languages ?? []), navigator.language].filter(Boolean);

  for (const candidate of candidates) {
    const matched = systemLanguageMap.find((item) => item.match.test(candidate));

    if (matched) {
      return matched.locale;
    }
  }

  return "en-US";
}

export function resolveLocale(preference: LocalePreference): SupportedLocale {
  if (preference === "system") {
    return detectSystemLocale();
  }

  return preference;
}
