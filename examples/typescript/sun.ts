import { Degrees, Meters, Sun } from '../../lib/index';
/* eslint-disable no-console */

console.log(Sun.getTimes(new Date(), 41 as Degrees, -71 as Degrees, 0 as Meters));
