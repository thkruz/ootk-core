/* eslint-disable no-console */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  calcGmst,
  DEG2RAD,
  Degrees,
  GroundObject,
  Kilometers,
  lla2eci,
  Radians,
  Satellite,
  Sgp4,
  TleLine1,
  TleLine2,
} from '../dist/main';

// Example Date
const exampleDate = new Date(1705109326817);

// Sample TLE
const tle1 = '1 56006U 23042W   24012.45049317  .00000296  00000-0  36967-4 0  9992' as TleLine1;
const tle2 = '2 56006 143.0043  13.3620 0001137 267.5965  92.4747 15.02542972 44491' as TleLine2;

// Initialize a Satellite Object
const satellite = new Satellite({
  tle1,
  tle2,
});

const period = satellite.toJ2000(new Date(1705109326817)).period;

console.warn(period);

/*
 * You can still propagate a satellite using time since epoch (in minutes), but
 * it's not recommended.
 */
const timeSinceTleEpochMinutes = 10;
const positionAndVelocity = Sgp4.propagate(satellite.satrec, timeSinceTleEpochMinutes);

// Use a Date object instead
const positionAndVelocity2 = satellite.eci(new Date(2024, 0, 1));
// Or use the current time
const positionAndVelocity3 = satellite.eci();

/*
 * The position_velocity result is a key-value pair of ECI coordinates. These
 * are the base results from which all other coordinates are derived.
 */
const positionEci = positionAndVelocity.position; // positionAndVelocity might be false
const velocityEci = positionAndVelocity.velocity; // typescript will error on this code

/*
 * Unlike satellite.js using the eci method will ALWAYS return a result or throw
 * an error if it can't propagate the satellite. No more checking for false and
 * trying to handle a combined object and boolean result.
 */
const positionEci2 = satellite.eci().position; // This is correctly typed

/*
 * Set the Observer at 71°W, 41°N, 0.37 km altitude using DEGREES because who
 * likes using Radians?
 */
const observer = new GroundObject({
  lon: -71.0308 as Degrees,
  lat: 41.9613422 as Degrees,
  alt: 0.37 as Kilometers,
});

/**
 * You can still calculate GMST if you want to, but unlike satellite.js it's not
 * required.
 */
const { gmst, j } = calcGmst(new Date());

// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
const positionEcf = satellite.ecf(exampleDate);
const observerEcf = observer.ecf();
const positionGd = satellite.lla(exampleDate);
const lookAngles = satellite.toRae(observer, exampleDate);
// This never worked in satellite.js, but it does now!
const uplinkFreq = 420e6;
const dopplerFactor = satellite.dopplerFactor(observer, exampleDate);
let dopplerShiftedFrequency = uplinkFreq * dopplerFactor;

dopplerShiftedFrequency = satellite.applyDoppler(uplinkFreq, observer, exampleDate);

/**
 * The coordinates are all stored in strongly typed key-value pairs. ECI and ECF
 * are accessed by `x`, `y`, `z` properties.
 *
 * satellite.js generates Property 'x' does not exist on type 'boolean | { x:
 * number; y: number; z: number; }'.
 */
const position = satellite.eci(exampleDate).position;
const satelliteX = position.x; // This is typed as Kilometers
const satelliteY = position.y; // to prevent you from accidentally
const satelliteZ = position.z; // mixing Meters with Kilometers.

// Look Angles may be accessed by `azimuth`, `elevation`, `range` properties.
const azimuth = lookAngles.azimuth; // Typed as Radians
const azimuthDegrees = lookAngles.azimuthDegrees; // Typed as Degrees
const elevation = lookAngles.elevation; // Typed as Radains
const elevationDegrees = lookAngles.elevationDegrees; // Typed as Degrees
const rangeSat = lookAngles.range; // Typed as Kilometers
const rangeRate = lookAngles.rangeRate; // Kilometers/Second

/*
 * There is a built in cache to allow fast retrieval of repeated calculations.
 * This means you can make repeat calls to `.rae()` for minimal performance hit.
 */
const rangeCache = satellite.rae(observer, exampleDate).rng;
const azimuthCached = satellite.rae(observer, exampleDate).az;
const elevationCached = satellite.rae(observer, exampleDate).el;
const latitudeCached = satellite.lla(exampleDate).lat;
const longitudeCached = satellite.lla(exampleDate).lon;
const heightCached = satellite.lla(exampleDate).alt;

// Geodetic coords are accessed via `longitude`, `latitude`, `height`.
const longitude = positionGd.lon; // Longitude is in Degrees
const latitude = positionGd.lat; // Latitude is in Degrees
const height = positionGd.alt; // Height is in Kilometers

//  Convert the DEGREES to RADIANS if you want.
const longitudeRad = longitude * DEG2RAD;
const latitudeRad = latitude * DEG2RAD;
/**
 * In TypeScript you need to label your units. This will help prevent you from
 * passing the wrong units into functions.
 */
const longitudeRad2 = (longitude * DEG2RAD) as Radians;
const latitudeRad2 = (latitude * DEG2RAD) as Radians;

/*
 * lla2eci(positionGd, gmst); // Throws an error: Argument of type
 * 'LlaVec3<Degrees, Kilometers>' is not assignable to parameter of type
 * 'LlaVec3<Radians, Kilometers>'.
 */
lla2eci(observer.llaRad(), gmst); // This is correctly typed

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
