import { Satellite } from '/dist/main.js';
/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */

const sats = [];
const ecis = [];
const llas = [];

fetch('https://api.keeptrack.space/v2/sats').then((response) => response.json()).then((data) => {

  const date = new Date();
  const {j, gmst} = Satellite.calculateTimeVariables(date);

  console.time('satrec processing');
  console.log('Processing satellite data...');
  for (const entry of data) {
    const sat = new Satellite(entry);

    sats.push(sat);
  }
  console.timeEnd('satrec processing');

  processEciVectors(date, j, gmst);

  console.time('lla processing');
  console.log('Processing LLA vectors...');
  for (const sat of sats) {
    const lla = sat.lla(date, j, gmst);

    llas.push(lla);
  }
  console.timeEnd('lla processing');

  console.log('Processing complete.');
  console.log(`Number of satellites processed: ${data.length}`);
  console.log(`Number of LLA vectors created: ${llas.length}`);
  console.log('First LLA vector:', llas[0]);
  console.log('Last LLA vector:', llas[llas.length - 1]);
});

/**
 * Processes ECI vectors for all satellites.
 * @param date - The current date.
 * @param j - Julian date.
 * @param gmst - Greenwich Mean Sidereal Time.
 * @description This function processes ECI vectors for all satellites in the `sats` array.
 */
function processEciVectors(date, j, gmst) {
  console.time('eci processing');
  console.log('Processing ECI vectors...');

  for (const sat of sats) {
    const eci = sat.eci(date, j, gmst);

    ecis.push(eci);
  }
  console.timeEnd('eci processing');
}

