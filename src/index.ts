import glob from 'globby';
import { readFile, writeFile, copyFile } from 'fs';
import { promisify } from 'util';
import hash from 'rev-hash';
import { parse, resolve, relative } from 'path';
import mkdirp from 'mkdirp';

const readFileP = promisify(readFile);
const writeFileP = promisify(writeFile);
const copyFileP = promisify(copyFile);
const mkdirpP = promisify(mkdirp);

export interface IRevRewriteOptions {
    readonly dest: string;
    readonly pattern: string | readonly string[];
}

export interface IMapping {
    oldName: string;
    newName: string;
}

export async function rev(options: IRevRewriteOptions) {
    await mkdirpP(resolve(options.dest));
    const filesToRev = await glob(options.pattern, {});
    const map: IMapping[] = [];
    if (filesToRev.length === 0) {
        console.warn(`Matched zero files with pattern ${options.pattern}`);
        process.exit(1);
    }
    for (const file of filesToRev) {
        const buffer = await readFileP(file);
        const fileHash = hash(buffer);
        const { name, ext, base } = parse(file);
        const oldName = base;
        const newName = `${name}.${fileHash}${ext}`;
        const newPath = resolve(options.dest, newName);
        await copyFileP(resolve(file), newPath);
        console.log(`Copied ${oldName} to ${relative(process.cwd(), newPath)}`);
        map.push({ oldName, newName });
    }
    return map;
}

export async function rewrite(options: IRevRewriteOptions, map: IMapping[]) {
    await mkdirpP(resolve(options.dest));
    const filesToRewrite = await glob(options.pattern, {});
    if (filesToRewrite.length === 0) {
        console.warn(`Matched zero files with pattern ${options.pattern}`);
        process.exit(1);
    }
    for (const file of filesToRewrite) {
        const text = await readFileP(file, { encoding: 'utf-8' });
        const { base } = parse(file);
        console.group('rewrite', base, ':');
        const updatedText = map.reduce((acc: string, current): string => {
            return acc.replace(new RegExp(current.oldName, 'g'), found => {
                console.log(
                    `Replacing reference to ${found} with ${current.newName}`
                );
                return current.newName;
            });
        }, text);
        const path = resolve(options.dest, base);
        await writeFileP(path, updatedText, { encoding: 'utf-8' });
        console.log(`Wrote ${base} to ${relative(process.cwd(), path)}`);
        console.groupEnd();
    }
}
