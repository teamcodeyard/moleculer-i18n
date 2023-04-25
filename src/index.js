"use strict";

const Polyglot = require("node-polyglot");
const fsp = require("fs").promises;
const path = require("path");

/**
 * @description Read files synchronously from a folder, with natural sorting
 * @param {String} dir Absolute path to directory
 * @returns {Object[]} List of object, each object represent a file
 * structured like so: `{ filepath, name, ext, stat }`
 */
async function readFilesSync(dir) {
    const files = [];
    const dirs = await fsp.readdir(dir);
    for (let filename of dirs) {
        const name = path.parse(filename).name;
        const ext = path.parse(filename).ext;
        const filepath = path.resolve(dir, filename);
        const stat = await fsp.stat(filepath);
        const isFile = stat.isFile();

        if (isFile) files.push({ filepath, name, ext, stat });
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

/** @type {Partial<ServiceSchema>} */
const I18nMixin = {
    name: "I18nMixin",
    settings: {
        i18n: {
            polyglot: new Polyglot(),
            languages: ['en'],
            dirName: "translations"
        },
    },
    methods: {
        t(ctx, key, interpolation) {
            const availableLanguages = this.settings.i18n.languages;
            let locale = ctx.meta.locale;
            if (
                locale == null ||
                locale == undefined ||
                !availableLanguages.includes(locale)
            ) {
                locale = "en";
            }
            return this.settings.i18n.polyglot.t(locale + "." + key, interpolation);
        },
    },

    async started() {
        const files = await readFilesSync(this.settings.i18n.dirName);
        for (let translation of files) {
            if (translation.filepath.split(".").pop() === "json") {
                const content = await fsp.readFile(translation.filepath, "utf-8")
                const object = {};
                object[translation.name] = JSON.parse(content);
                this.settings.i18n.polyglot.extend(object);
            }
        };
    }
};
module.exports = I18nMixin;