import { config, type Config } from "../config";

type DotPaths<T extends object> = {
  [K in keyof T & string]: T[K] extends readonly unknown[]
    ? K
    : T[K] extends object
      ? K | `${K}.${DotPaths<T[K]>}`
      : K;
}[keyof T & string];

type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? PathValue<T[K], R>
    : string
  : P extends keyof T
    ? T[P]
    : string;

export type TranslationKey = DotPaths<Config>;

export function useTranslations() {
  return function t<K extends TranslationKey>(key: K): PathValue<Config, K> {
    const parts = key.split(".");
    let current: unknown = config;
    for (const part of parts) {
      if (
        current == null ||
        typeof current !== "object" ||
        Array.isArray(current)
      )
        return key as never;
      current = (current as Record<string, unknown>)[part];
    }
    return (current ?? key) as PathValue<Config, K>;
  };
}
