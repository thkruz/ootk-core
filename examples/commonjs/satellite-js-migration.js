const { Satellite, Sgp4, GroundPosition, calcGmst } = require('../../lib/ootk-core');

// Sample TLE
const tle1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992';
const tle2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';

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

// Set the Observer at 122.03 West by 36.96 North, in DEGREES (because who likes working in radians?)
const observer = new GroundPosition({
  lon: -122.0308,
  lat: 36.9613422,
  alt: 0.37,
});

// You can still calculate GMST if you want to, but unlike satellite.js it's not required.
const { gmst, j } = calcGmst(new Date());

// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
const positionEcf = satellite.ecf();
const observerEcf = observer.ecf();
const positionGd = satellite.lla();
const lookAngles = satellite.rae(observer);
// This never worked in satellite.js, but it does now!
const dopplerFactor = satellite.dopplerFactor(observer);

// The coordinates are all stored in strongly typed key-value pairs.
// ECI and ECF are accessed by `x`, `y`, `z` properties.
const position = satellite.eci().position;
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
