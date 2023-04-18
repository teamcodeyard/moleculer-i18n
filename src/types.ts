import type { ServiceSchema } from 'moleculer'
import type Polyglot from 'node-polyglot'

type JsonPrimitive = string | number | boolean | null

interface JsonMap {
  [member: string]: JsonPrimitive | JsonArray | JsonMap
}

interface JsonArray extends Array<JsonPrimitive | JsonArray | JsonMap> { }

export type Json = JsonPrimitive | JsonMap | JsonArray

export interface I18nSettings {
  i18n: {
    availableLocales: string[]
    path: string | string[]
    fallbackLocale: string
    polyglot: Polyglot | null
  }
}

export type I18nServiceSchema = {
  name: 'I18nMixin'
  methods: ThisType<ServiceSchema<I18nSettings>>
} & ServiceSchema<I18nSettings>
