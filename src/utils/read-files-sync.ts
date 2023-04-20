import { promises as fsp } from 'node:fs'
import path from 'node:path'

import type { Translation } from '../types'

/**
 *
 * Read files synchronously from a folder, with natural sorting
 *
 * @param dir Relative path to directory
 * @returns List of object, each object represent a file structured like so: `{ filepath, name }`
 */
export async function readFilesSync<T extends Translation>(dir: string): Promise<T[]> {
  const files: T[] = []
  const dirs = await fsp.readdir(dir)

  for (const filename of dirs) {
    const name = path.parse(filename).name
    const filepath = path.resolve(dir, filename)
    const stat = await fsp.stat(filepath)
    const isFile = stat.isFile()

    if (!isFile)
      continue

    files.push({ filepath, name } as T)
  }

  files.sort(naturalSortFactory<T>())

  return files
}

/**
 * Natural sort alphanumeric strings.
 *
 * @see https://stackoverflow.com/a/38641281
 */
function naturalSortFactory<T extends Translation>(): ((previous: T, next: T) => number) | undefined {
  return (previous, next) => {
    return previous.name.localeCompare(next.name, undefined, {
      numeric: true,
      sensitivity: 'base',
    })
  }
}
