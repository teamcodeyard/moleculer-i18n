import Polyglot from "node-polyglot";
import { promises as fsp } from "fs";
import path from "path";

import type { I18nServiceSchema, Translation } from "./types";

/**
 * Read files synchronously from a folder, with natural sorting
 *
 * @param dir Absolute path to directory
 * @returns List of object, each object represent a file structured like so: `{ filepath, name, ext, stat }`
 */
async function readFilesSync(dir: string): Promise<Translation[]> {
    const files: Translation[] = [];
    const dirs = await fsp.readdir(dir);
    for (let filename of dirs) {
        const name = path.parse(filename).name;
        const filepath = path.resolve(dir, filename);
        const stat = await fsp.stat(filepath);
        const isFile = stat.isFile();

        if (isFile) files.push({ filepath, name })
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

export const I18nMixin: I18nServiceSchema = {
    name: "I18nMixin",
    settings: {
        i18n: {
            polyglot: new Polyglot(),
            languages: ['en'],
            dirName: "testTranslations"
        },
    },
    methods: {
        t(ctx, key, interpolation) {
            let locale = ctx.meta.locale;
            if (!this.settings) {
                return locale + "." + key;
            }
            const availableLanguages = this.settings.i18n.languages;
            if (!Boolean(locale) || !availableLanguages.includes(locale)) {
                locale = "en";
            }
            return this.settings.i18n.polyglot.t(locale + "." + key, interpolation);
        },
    },
    async started() {
        const files = await readFilesSync(this.settings.i18n.dirName);
        for (let translation of files) {
            if (translation.filepath.split(".").pop() === "json") {
                const content = await fsp.readFile(translation.filepath, "utf-8");
                const object: Record<string, string> = {};
                object[translation.name] = JSON.parse(content);
                this.settings.i18n.polyglot.extend(object);
            }
        };
    }
};
