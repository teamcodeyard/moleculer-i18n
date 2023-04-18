import type Polyglot from 'node-polyglot'

export interface I18nSettings<LanguageKey extends string> {
  i18n: {
    dirName: string
    languages: Record<LanguageKey, string>
    polyglot: Polyglot
  }
}

export type LanguageKey =
  | 'EN'
  | 'ES'
