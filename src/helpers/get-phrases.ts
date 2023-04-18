import { basename, dirname, extname, resolve } from 'node:path'
import fg from 'fast-glob'

import type { Json } from '~/types'

export const root = resolve(dirname(__dirname))

export async function getPhrases(path: string | string[]): Promise<Json> {
  path = Array.isArray(path)
    ? path.map(item => `${root}/${item}/*.json`)
    : `${root}/${path}/*.json`

  const result: Json = {}
  const locales = await fg(path)

  await Promise.all(
    locales.map(async (locale) => {
      const localization: Json = (await import(locale)).default
      const localeKey = basename(locale, extname(locale))

      result[localeKey] = localization
    }),
  )

  return result
}
