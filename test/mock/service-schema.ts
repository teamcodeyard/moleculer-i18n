import type { ServiceSchema } from 'moleculer'

import { I18nMixin } from '~/index'

export const mockSchema: ServiceSchema = {
  name: 'greeter',
  mixins: [
    // TODO: check type here
    I18nMixin as unknown as Partial<ServiceSchema>,
  ],
  settings: {
    i18n: {
      dirName: './test/mock/translations',
      languages: {
        EN: 'en',
        ES: 'es',
      },
    },
  },
  actions: {
    welcome: {
      handler(ctx) {
        // @ts-expect-error t function does not exists
        return this.t(ctx, 'greeter.welcome.message')
      },
    },
  },
}
