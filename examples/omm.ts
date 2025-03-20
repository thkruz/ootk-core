/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */
import { Satellite, TleLine1, TleLine2 } from '../dist/main';

const tle = {
  // tle1: '1 00005U 58002B   25032.17662036  .00000370  00000+0  48949-3 0  9999',
  // tle2: '2 00005  34.2472  60.6908 1841561  39.5383 332.6023 10.85864520388811',
  tle1: '1 00011U 59001A   25032.54308812  .00001779  00000+0  94731-3 0  9990',
  tle2: '2 00011  32.8630 178.5185 1451213  89.8565 286.7680 11.89134918475816',
};

const omm = {
  // OBJECT_NAME: 'VANGUARD 1',
  // OBJECT_ID: '1958-002B',
  // EPOCH: '2025-02-01T04:14:19.999104',
  // MEAN_MOTION: '10.85864520',
  // ECCENTRICITY: '.1841561',
  // INCLINATION: '34.2472',
  // RA_OF_ASC_NODE: '60.6908',
  // ARG_OF_PERICENTER: '39.5383',
  // MEAN_ANOMALY: '332.6023',
  // EPHEMERIS_TYPE: '0',
  // CLASSIFICATION_TYPE: 'U',
  // NORAD_CAT_ID: '5',
  // ELEMENT_SET_NO: '999',
  // REV_AT_EPOCH: '38881',
  // BSTAR: '.48949E-3',
  // MEAN_MOTION_DOT: '.37E-5',
  // MEAN_MOTION_DDOT: '0',
  OBJECT_NAME: 'VANGUARD 2',
  OBJECT_ID: '1959-001A',
  EPOCH: '2025-02-01T13:02:02.813568',
  MEAN_MOTION: '11.89134918',
  ECCENTRICITY: '.1451213',
  INCLINATION: '32.8630',
  RA_OF_ASC_NODE: '178.5185',
  ARG_OF_PERICENTER: '89.8565',
  MEAN_ANOMALY: '286.7680',
  EPHEMERIS_TYPE: '0',
  CLASSIFICATION_TYPE: 'U',
  NORAD_CAT_ID: '11',
  ELEMENT_SET_NO: '999',
  REV_AT_EPOCH: '47581',
  BSTAR: '.94731E-3',
  MEAN_MOTION_DOT: '.1779E-4',
  MEAN_MOTION_DDOT: '0',
};

const sat1 = new Satellite({
  omm,
});
const sat2 = new Satellite({
  tle1: tle.tle1 as TleLine1,
  tle2: tle.tle2 as TleLine2,
});

// const keys = new Set([
//   ...Object.keys(sat1.satrec),
//   ...Object.keys(sat2.satrec),
// ]);

// keys.forEach((key) => {
//   const val1 = (sat1.satrec)[key];
//   const val2 = (sat2.satrec)[key];

//   if (val1 !== val2) {
//     if (key === 'epochdays') {
//       // Subtract the two epochs to get the difference in days
//       const diff = Math.abs(val1 - val2) * 86400000;

//       console.log(`Parameter ${key} is different: sat1 = ${val1}, sat2 = ${val2}, diff = ${diff}`);
//     } else {
//       console.log(`Parameter ${key} is different: sat1 = ${val1}, sat2 = ${val2}`);
//     }
//   }
// });

console.log(sat1.lla());
console.log(sat2.lla());
