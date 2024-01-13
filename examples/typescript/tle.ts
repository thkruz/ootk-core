/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Tle, TleLine1, TleLine2 } from '../../lib/index';

// Sample TLE
const tle1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992' as TleLine1;
const tle2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442' as TleLine2;

// Getting the inclination is as easy as passing the second line to the inclination function
const inc = Tle.inclination(tle2);

/**
 * TypeScript asserts that you can't call this on a TleLine2, so you don't need
 * to memorize which functions are for which line.
 *
 * const bstar = Tle.getBstar(tle2);
 */

const bstarGood = Tle.bstar(tle1);

// You can get all parameters from a TLE line with the parseLine1 or parseLine2 functions
const {
  satNum,
  classification,
  intlDes,
  epochYear,
  epochDay,
  meanMoDev1,
  meanMoDev2,
  bstar,
  ephemerisType,
  elsetNum,
  checksum1,
} = Tle.parseLine1(tle1);

// You can get the most common parameters from a TLE with the parse function
const tle = Tle.parse(tle1, tle2);
// {
//   satNum: 25544,
//   intlDes: '98067A',
//   epochYear: 19,
//   epochDay: 156.50900463,
//   meanMoDev1: 0.00003075,
//   meanMoDev2: 0,
//   bstar: 0.000059442,
//   inclination: 51.6433,
//   rightAscension: 59.2583,
//   eccentricity: 0.0008217,
//   argOfPerigee: 16.4489,
//   meanAnomaly: 347.6017,
//   meanMotion: 15.51174618,
//   period: 92.83287537651032
// }

// Or get everything with the parseAll function
const tleAll = Tle.parseAll(tle1, tle2);
// {
//   lineNumber1: 1,
//   satNum: 25544,
//   satNumRaw: '25544',
//   classification: 'U',
//   intlDes: '98067A',
//   intlDesYear: 98,
//   intlDesLaunchNum: 67,
//   intlDesLaunchPiece: 'A',
//   epochYear: 19,
//   epochYearFull: 2019,
//   epochDay: 156.50900463,
//   meanMoDev1: 0.00003075,
//   meanMoDev2: 0,
//   bstar: 0.000059442,
//   ephemerisType: 0,
//   elsetNum: 999,
//   checksum1: 2,
//   lineNumber2: 2,
//   inclination: 51.6433,
//   rightAscension: 59.2583,
//   eccentricity: 0.0008217,
//   argOfPerigee: 16.4489,
//   meanAnomaly: 347.6017,
//   meanMotion: 15.51174618,
//   revNum: 17344,
//   checksum2: 2,
//   period: 92.83287537651032
// }
