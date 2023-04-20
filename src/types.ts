import type { Context, ServiceSchema, ServiceSettingSchema } from 'moleculer'
import type Polyglot from 'node-polyglot'
import type { InterpolationOptions } from 'node-polyglot'

export interface Translation {
  name: string
  filepath: string
}

export interface I18NSettings {
  /**
   *
   * Directory name where locale files are stored.
   */
  dirName: string
  /**
   *
   * Available locale list.
   */
  languages: string[]
  /**
   *
   * Instance of translation service.
   */
  polyglot: Polyglot
}

type TranslationContext = Context<{}, { locale: string }>

type _I18nServiceSchema = ServiceSchema<{ i18n: I18NSettings }> & ServiceSchema<ServiceSettingSchema>

export type ServiceMethods = {
  /**
   *
   * Proxied `t` function of {@link Polyglot}.
   */
  t: (ctx: TranslationContext, key: string, interpolation?: InterpolationOptions | number) => string
} & ThisType<_I18nServiceSchema>

export type I18nServiceSchema = {
  name: 'I18nMixin'
  methods: ServiceMethods
} & _I18nServiceSchema
