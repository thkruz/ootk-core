import { cpSync } from 'fs';

cpSync('./lib/index.js', './lib/index.mjs');
cpSync('./lib/index.js.map', './lib/index.mjs.map');
cpSync('./lib/index.d.ts', './lib/index.d.mts');
