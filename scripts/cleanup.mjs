/* eslint-disable no-console */
import rimraf from 'rimraf';

console.log('Removing ./lib...');
try {
  rimraf.sync('./lib');
} catch (error) {
  // Intentionally left blank
}

console.log('Removing ./commonjs...');
try {
  rimraf.sync('./commonjs');
} catch (error) {
  // Intentionally left blank
}

console.log('Removing ./mjs...');
try {
  rimraf.sync('./mjs');
} catch (error) {
  // Intentionally left blank
}
