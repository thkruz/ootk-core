import { Satellite } from '../../lib/ootk-core.mjs';

const tle1 = '1 25544U 98067A   19156.50900463  .00003075  00000-0  59442-4 0  9992';
const tle2 = '2 25544  51.6433  59.2583 0008217  16.4489 347.6017 15.51174618173442';

const satellite = new Satellite({
  tle1,
  tle2,
});

// eslint-disable-next-line no-console
console.log(satellite.eci());
