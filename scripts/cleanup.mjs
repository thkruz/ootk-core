import { rmSync } from 'fs';

console.log('Removing ./lib...');
try {
  rmSync('./lib', { recursive: true });
} catch (error) {
  // Intentionally left blank
}

console.log('Removing ./commonjs...');
try {
  rmSync('./commonjs', { recursive: true });
} catch (error) {
  // Intentionally left blank
}
