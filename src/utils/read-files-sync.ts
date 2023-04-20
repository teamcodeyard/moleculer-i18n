import { promises as fsp } from "fs";
import path from "path";

import type { Translation } from "../types";

/**
 * Read files synchronously from a folder, with natural sorting
 *
 * @param dir Absolute path to directory
 * @returns List of object, each object represent a file structured like so: `{ filepath, name }`
 */
export async function readFilesSync<T extends Translation>(dir: string): Promise<T[]> {
  const files: T[] = [];
  const dirs = await fsp.readdir(dir);

  for (let filename of dirs) {
    const name = path.parse(filename).name;
    const filepath = path.resolve(dir, filename);
    const stat = await fsp.stat(filepath);
    const isFile = stat.isFile();

    if (!isFile) {
      continue;
    }

    files.push({ filepath, name } as T);
  };

  files.sort((a, b) => {
    // natural sort alphanumeric strings
    // https://stackoverflow.com/a/38641281
    return a.name.localeCompare(b.name, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  return files;
}
