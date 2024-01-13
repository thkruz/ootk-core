import { cpSync, renameSync } from 'fs';

renameSync('./lib/index.js', './lib/index.mjs');
renameSync('./lib/index.js.map', './lib/index.mjs.map');
cpSync('./lib/index.d.ts', './lib/index.d.mts');
