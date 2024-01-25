# ootk-core

<!-- [![Release](https://img.shields.io/github/v/release/thkruz/ootk-core?style=flat-square)](https://www.npmjs.com/package/ootk-core) -->

![Size](https://img.shields.io/github/languages/code-size/thkruz/ootk-core?style=flat-square)
[![Issues](https://img.shields.io/github/issues/thkruz/ootk-core?style=flat-square)](https://github.com/thkruz/ootk-core/issues)
[![License](https://img.shields.io/github/license/thkruz/ootk-core?style=flat-square)](LICENSE.md)

> An Orbital Object Toolkit in Your Web Browser

**ootk-core** is the core libraries of [ootk](https://github.com/thkruz/ootk) for doing math related to orbital objects
written in TypeScript and built for JavaScript or TypeScript. **ootk-core** was developed to simplify the math and let
you focus on using the results. It is the culmination of years of fixes and improvements to
other libraries.

If you would like more functionality the expanded **ootk** library is available free under the AGPL license
[here](https://github.com/thkruz/ootk). The full library has features for doing initial orbit determination, maneuver
calculations, and more.

Most of the functionality was originally written for [KeepTrack](https://github.com/thkruz/keeptrack.space) and then
later refactored into this library for others to use.

## :blue_book: Table of Contents

- [ootk-core](#ootk-core)
  - [:blue\_book: Table of Contents](#blue_book-table-of-contents)
  - [:wrench: Installation](#wrench-installation)
    - [Loading the Library](#loading-the-library)
  - [:satellite: Usage](#satellite-usage)
    - [Common Patterns](#common-patterns)
    - [Propagating a TLE](#propagating-a-tle)
    - [Creating a Satellite](#creating-a-satellite)
    - [Creating a Sensor](#creating-a-sensor)
    - [More Examples](#more-examples)
  - [Changelog](#changelog)
  - [:desktop\_computer: Building](#desktop_computer-building)
  - [:gem: NPM Scripts](#gem-npm-scripts)
  - [:man\_teacher: Contributing](#man_teacher-contributing)
  - [:man\_scientist: Contributors](#man_scientist-contributors)
  - [:balance\_scale: License](#balance_scale-license)

## :wrench: Installation

Install the library with [NPM](https://www.npmjs.com/):

```bash
npm i ootk-core
```

Make sure you are using ESM modules in your package.json:

```json
{
  name: "your project name"
  type: "module"
  ...
}
```

Without that line in package.json you may get an `Error [ERR_REQUIRE_ESM]: require() of ES Module` error.

### Loading the Library

```js
import { Satellite } from 'ootk-core';
...
const satellite = new Satellite({
   tle1: line1,
   tle2: line2
});
```

## :satellite: Usage

### Common Patterns

- If you don't specify a date, the method will assume you want to use the current date/time.
- Many parameters are in shorthand - Ex: `sensor.rng`.
- Changing a variable requires you to cast its units before using it as a parameters - Ex: `(3.14 * -1) as Radians`
- Methods starting with 'to' change the class - Ex: `satellite.toGeodetic()` or `satellite.toITRF()`
  - Methods that are optimized for loops are marked as `@variation optimized`
  - Methods that are slower with expanded capabilities are marked as `@variation expanded`
- Class parameters assume degrees and specify radians - Ex: `sensor.az` is in `degrees` and `sensor.azRad` is in `radians`.

### Propagating a TLE

```js
import { Satellite } from 'ootk-core';
...
const satellite = new Satellite({
   tle1: line1,
   tle2: line2
});
const state = satellite.eci();
console.log(state.position);
// {
//   x:  1538.223335842895
//   y:  5102.261204021967
//   z:  4432.634965003577
// }
console.log(state.velocity);
// {
//   x:  -4.26262363267920
//   y:  0.159169020320195
//   z:  1.502351885030190
// }
```

### Creating a Satellite

```js
import { Satellite } from 'ootk-core';

const sat = new Satellite({ name: 'Test', tle1, tle2 });

console.log(sat.intlDes); // International Designator
console.log(sat.epochYear); // Epoch Year
console.log(sat.epochDay); // Epoch Day
console.log(sat.meanMoDev1); // Mean Motion Deviation 1
console.log(sat.meanMoDev2); // Mean Motion Deviation 2
console.log(sat.bstar); // Bstar (Drag Coefficient)
console.log(sat.inclination); // inclination in degrees
console.log(sat.rightAscension); // right ascension of the ascending node in degrees
console.log(sat.eccentricity); // eccentricity
console.log(sat.argOfPerigee); // argument of perigee in degrees
console.log(sat.meanAnomaly); // mean anomaly in degrees
console.log(sat.meanMotion); // mean motion in revolutions per day
console.log(sat.period); // period in seconds
console.log(sat.apogee); // apogee in kilometers
console.log(sat.perigee); // perigee in kilometers

sat.lla(); // Get the satellite's position in latitude, longitude, altitude at its current time
sat.eci(time); // Get the satellite's position in Earth-Centered Inertial coordinates at the given time
sat.rae(sensor, time); // Get position in range, aziimuth, elevation relative to a sensor object at the given time
```

### Creating a Sensor

```js
import { GroundPosition } from 'ootk-core';

const sensor = new GroundPosition({ name: 'Test', lat: lat, lon: lon, alt: alt });
sensor.rae(sat); // Get satellite position in range, aziimuth, elevation at the sensor's current time
sensor.rae(sat, time); // Get position in range, aziimuth, elevation relative to a satellite object at the given time
sensor.eci() // Get the sensor's position in ECI coordinates
```

### More Examples

More examples can be found in the `examples` folder of the code.

## Changelog

You can find a [list of changes here](https://github.com/thkruz/ootk-core/blob/main/CHANGELOG.md).

## :desktop_computer: Building

1. Install [Node.js](https://nodejs.org/) and [Node Package Manager](https://www.npmjs.com/);

2. Install all required packages with NPM by running the following command from repository's root directory:

   ```bash
   npm install
   ```

3. Run the following NPM script to build everything:

   ```bash
   npm run build
   ```

## :gem: NPM Scripts

- `build` compiles TypeScript into ES6 Modules in `dist` directory
- `lint` lints source code located in `src` directory with [ESLint](http://eslint.org/)
- `test` runs jest to verify the final library remains functional

## :man_teacher: Contributing

This repo follows [Gitflow Workflow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow).

Before starting a work on new [pull request](https://github.com/thkruz/ootk-core/compare), please, checkout your feature or
bugfix branch from `develop` branch:

```bash
git checkout develop
git fetch origin
git merge origin/develop
git checkout -b my-feature
```

When you are done, make sure that your changes don't break the existing code by running:

```bash
npm test
```

After you have pushed your branch you can [create a pull request here](https://github.com/thkruz/ootk-core/pulls).

If you need help, just open an issue and I'll happily walk you through the process.

## :man_scientist: Contributors

This whole project is an example of standing on the shoulder's of giants. None of it would have been possible without
the previous work of the following:

- [@ezze (Dmitriy Pushkov)](https://github.com/ezze)
- [@david-rc-dayton (David RC Dayton)](https://github.com/david-rc-dayton)
- [@davidcalhoun (David Calhoun)](https://github.com/davidcalhoun)
- [@shashwatak (Shashwat Kandadai)](https://github.com/shashwatak)
- [@brandon-rhodes (Brandon Rhodes)](https://github.com/brandon-rhodes)
- [@mourner (Volodymyr Agafonkin)](https://github.com/mourner)
- [@Hypnos (Robert Gester)](https://github.com/Hypnos3)

## :balance_scale: License

In order to maximize the usabiltiy of the core modules of ootk with other projects I support, I have placed this
repository under the [MIT License](LICENSE.md). I strongly encourage you to conisder a GPL license for your own project
to keep your project free for everyone to use. [Learn more here](https://www.gnu.org/philosophy/philosophy.html).
