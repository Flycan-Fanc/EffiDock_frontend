export const supportedLocales = ["en-US", "zh-CN", "ja-JP"] as const;

export type SupportedLocale = (typeof supportedLocales)[number];
export type LocalePreference = SupportedLocale | "system";
export type TranslationParams = Record<string, string | number>;
export type TranslateFn = (key: string, params?: TranslationParams) => string;
