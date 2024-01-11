/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  calcGmst,
  DEG2RAD,
  Degrees,
  GroundPosition,
  Kilometers,
  lla2eci,
  Radians,
  Satellite,
  Sgp4,
  TleLine1,
  TleLine2,
} from '../src/ootk-core';

// Sample TLE
const tle1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992' as TleLine1;
const tle2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442' as TleLine2;

// Initialize a Satellite Object
const satellite = new Satellite({
  tle1,
  tle2,
});

// You can still propagate a satellite using time since epoch (in minutes), but it's not recommended.
const timeSinceTleEpochMinutes = 10;
const positionAndVelocity = Sgp4.propagate(satellite.satrec, timeSinceTleEpochMinutes);

// Use a Date object instead
const positionAndVelocity2 = satellite.eci(new Date(2024, 0, 1));
// Or use the current time
const positionAndVelocity3 = satellite.eci();

/*
 * The position_velocity result is a key-value pair of ECI coordinates.
 * These are the base results from which all other coordinates are derived.
 */
const positionEci = positionAndVelocity.position; // positionAndVelocity might be false
const velocityEci = positionAndVelocity.velocity; // typescript will error on this code

/*
 * Unlike satellite.js using the eci method will ALWAYS return a result or throw
 * an error if it can't propagate the satellite. No more checking for false and trying to handle
 * a combined object and boolean result.
 */
const positionEci2 = satellite.eci().position; // This is correctly typed

// Set the Observer at 122.03 West by 36.96 North, in DEGREES (because who likes working in radians?)
const observer = new GroundPosition({
  lon: -122.0308 as Degrees,
  lat: 36.9613422 as Degrees,
  alt: 0.37 as Kilometers,
});

/**
 * You can still calculate GMST if you want to, but unlike satellite.js it's not required.
 */
const { gmst, j } = calcGmst(new Date());

// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
const positionEcf = satellite.ecf();
const observerEcf = observer.ecf();
const positionGd = satellite.lla();
const lookAngles = satellite.rae(observer);
// This never worked in satellite.js, but it does now!
const dopplerFactor = satellite.dopplerFactor(observer);

/**
 * The coordinates are all stored in strongly typed key-value pairs.
 * ECI and ECF are accessed by `x`, `y`, `z` properties.
 *
 * satellite.js generates Property 'x' does not exist on type 'boolean | { x: number; y: number; z: number; }'.
 */
const position = satellite.eci().position;
const satelliteX = position.x; // This is typed as Kilometers
const satelliteY = position.y; // to prevent you from accidentally
const satelliteZ = position.z; // mixing Meters with Kilometers.

// Look Angles may be accessed by `azimuth`, `elevation`, `range` properties.
const azimuth = lookAngles.azimuth; // Typed as Degrees
const elevation = lookAngles.elevation; // Typed as Degrees
const rangeSat = lookAngles.range; // Typed as Kilometers

// Geodetic coords are accessed via `longitude`, `latitude`, `height`.
const longitude = positionGd.lon; // Longitude is in Degrees
const latitude = positionGd.lat; // Latitude is in Degrees
const height = positionGd.alt; // Height is in Kilometers

//  Convert the DEGREES to RADIANS if you want.
const longitudeRad = longitude * DEG2RAD;
const latitudeRad = latitude * DEG2RAD;
/**
 * In TypeScript you need to label your units.
 * This will help prevent you from passing the wrong units into functions.
 */
const longitudeRad2 = (longitude * DEG2RAD) as Radians;
const latitudeRad2 = (latitude * DEG2RAD) as Radians;

// lla2eci(positionGd, gmst); // Throws an error: Argument of type 'LlaVec3<Degrees, Kilometers>' is not assignable to parameter of type 'LlaVec3<Radians, Kilometers>'.
lla2eci(observer.llaRad(), gmst); // This is correctly typed

// eslint-disable-next-line no-console
console.log(
  positionEci2,
  positionEcf,
  observerEcf,
  positionGd,
  lookAngles,
  dopplerFactor,
  satelliteX,
  satelliteY,
  satelliteZ,
  azimuth,
  elevation,
  rangeSat,
  longitude,
  latitude,
  height,
  longitudeRad,
  latitudeRad,
  longitudeRad2,
  latitudeRad2,
);
