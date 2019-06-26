#!/usr/bin/env node

import arg from 'arg';
import { rev, rewrite } from '.';

revRewrite().then(
    () => undefined,
    error => {
        console.error(error);
        process.exit(1);
    }
);

async function revRewrite() {
    const args = arg({
        '--rev-dest': String,
        '--rev-pattern': [String],
        '--rewrite-dest': String,
        '--rewrite-pattern': [String]
    });

    if (!args['--rev-dest']) {
        throw new Error(`Missing required parameter --rev-dest`);
    } else if (!args['--rev-pattern']) {
        throw new Error(`Missing required parameter --rev-pattern`);
    } else if (!args['--rewrite-dest']) {
        throw new Error(`Missing required parameter --rewrite-dest`);
    } else if (!args['--rewrite-pattern']) {
        throw new Error(`Missing required parameter --rewrite-pattern`);
    }
    const map = await rev({
        dest: args['--rev-dest'],
        pattern: args['--rev-pattern']
    });
    await rewrite(
        { dest: args['--rewrite-dest'], pattern: args['--rewrite-pattern'] },
        map
    );
}
