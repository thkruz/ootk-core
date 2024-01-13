/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable multiline-comment-style */
/* eslint-disable no-console */

import { calcGmst, DEG2RAD, GroundPosition, Satellite, Sgp4 } from '../../lib/index.js';

// Example Date
const exampleDate = new Date(1705109326817);

// Sample TLE
const tle1 = '1 56006U 23042W   24012.45049317  .00000296  00000-0  36967-4 0  9992';
const tle2 = '2 56006  43.0043  13.3620 0001137 267.5965  92.4747 15.02542972 44491';

// Initialize a Satellite Object
const satellite = new Satellite({
  tle1,
  tle2,
});

// You can still propagate a satellite using time since epoch (in minutes), but it's not recommended.
const timeSinceTleEpochMinutes = 10;
let positionAndVelocity = Sgp4.propagate(satellite.satrec, timeSinceTleEpochMinutes);

// Use a Date object instead
positionAndVelocity = satellite.eci(new Date(2024, 0, 1));
// Or use the current time
positionAndVelocity = satellite.eci();

// The position_velocity result is a key-value pair of ECI coordinates.
// These are the base results from which all other coordinates are derived.
const positionEci = positionAndVelocity.position;
const velocityEci = positionAndVelocity.velocity;

// Set the Observer at 71°W, 41°N, 0.37 km altitude using DEGREES because who likes using Radians?
const observer = new GroundPosition({
  lon: -71.0308,
  lat: 41.9613422,
  alt: 0.37,
});

// You can still calculate GMST if you want to, but unlike satellite.js it's not required.
const { gmst, j } = calcGmst(new Date());

// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
const positionEcf = satellite.ecf();
const observerEcf = observer.ecf();
const positionGd = satellite.lla(exampleDate);
const lookAngles = satellite.rae(observer, exampleDate);
// This never worked in satellite.js, but it does now!
const uplinkFreq = 420e6;
const dopplerFactor = satellite.dopplerFactor(observer, exampleDate);
let dopplerShiftedFrequency = uplinkFreq * dopplerFactor;

dopplerShiftedFrequency = satellite.applyDoppler(uplinkFreq, observer, exampleDate);

// The coordinates are all stored in strongly typed key-value pairs.
// ECI and ECF are accessed by `x`, `y`, `z` properties.
const position = satellite.eci(exampleDate).position;
const satelliteX = position.x;
const satelliteY = position.y;
const satelliteZ = position.z;

// Look Angles may be accessed by `azimuth`, `elevation`, `range` properties.
const azimuth = lookAngles.azimuth; // Radians
const azimuthDegrees = lookAngles.azimuthDegrees; // Degrees
const elevation = lookAngles.elevation; // Radians
const elevationDegrees = lookAngles.elevationDegrees; // Degrees
const rangeSat = lookAngles.range; // Kilometers
const rangeRate = lookAngles.rangeRate; // Kilometers/Second

// Geodetic coords are accessed via `longitude`, `latitude`, `height`.
const longitude = positionGd.lon; // longitude is in degrees
const latitude = positionGd.lat; // latitude is in degrees
const height = positionGd.alt; // height is in kilometers

//  Convert the degrees to radians if you want.
const longitudeRad = longitude * DEG2RAD;
const latitudeRad = latitude * DEG2RAD;

// There is no need to use the units seen in TypeScript examples.
// const longitudeRad = (longitude * DEG2RAD) as Radians;
// const latitudeRad = (latitude * DEG2RAD) as Radians;

console.log('Satellite.js Migration Example');
console.log('======================================');
console.log('TLE: ', tle1);
console.log('     ', tle2);
console.log('======================================');
console.log('Position (ECI):');
console.log('     x: ', satelliteX);
console.log('     y: ', satelliteY);
console.log('     z: ', satelliteZ);
console.log('Position (ECF):');
console.log('     x: ', positionEcf.x);
console.log('     y: ', positionEcf.y);
console.log('     z: ', positionEcf.z);
console.log('Position (Geodetic):');
console.log('     longitude: ', longitude);
console.log('     latitude: ', latitude);
console.log('     height: ', height);
console.log('Look Angles:');
console.log('     azimuth: ', azimuthDegrees);
console.log('     elevation: ', elevationDegrees);
console.log('     rangeSat: ', rangeSat);
console.log('     rangeRate: ', rangeRate);
console.log('Doppler Factor:');
console.log('     dopplerFactor: ', dopplerFactor);
dopplerShiftedFrequency /= 1e6; // Hz to MHz
console.log('     420MHz: ', `${dopplerShiftedFrequency.toPrecision(6)} MHz`);
console.log('======================================');
