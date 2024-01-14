/* eslint-disable no-console */
import { rmSync } from 'fs';

console.log('Removing ./lib...');
try {
  rmSync('./lib', { recursive: true });
} catch (error) {
  // Intentionally left blank
}
