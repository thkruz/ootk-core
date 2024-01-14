/* eslint-disable no-console */
import { Degrees, ecf2rae, EcfVec3, GroundPosition, Kilometers, lla2ecf, lla2sez, RAD2DEG } from '../../src/ootk-core';

const observer = new GroundPosition({
  name: 'ground-position',
  lat: (0.7287584767123405 * RAD2DEG) as Degrees,
  lon: (-1.2311404365114507 * RAD2DEG) as Degrees,
  alt: 0.060966 as Kilometers,
});

const ecf = {
  x: 1838.5578358534067,
  y: -4971.972919387344,
  z: 4466.101983887215,
} as EcfVec3<Kilometers>;

const llaRad = observer.llaRad();

console.log(llaRad); // Good
console.log(lla2ecf(observer)); // Good
console.log(lla2sez(llaRad, ecf));
console.log(ecf2rae(observer, ecf));
