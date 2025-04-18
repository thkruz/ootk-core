/**
 * @author Theodore Kruczek.
 * @license MIT
 * @copyright (c) 2022-2025 Theodore Kruczek Permission is
 * hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the
 * Software without restriction, including without limitation the rights to use,
 * copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { AzEl, Degrees, Kilometers, RAD2DEG, RaDec, Radians, Sun } from '../main.js';

/**
 * Celestial is a static class that provides methods for calculating the position of celestial objects such as the Sun,
 * Moon, and planets in the sky.
 */
export class Celestial {
  private constructor() {
    // disable constructor
  }

  /**
   * Calculates the azimuth and elevation of a celestial object at a given date, latitude,
   * longitude, right ascension, and declination.
   * @param date - The date for which to calculate the azimuth and elevation.
   * @param lat - The latitude of the observer.
   * @param lon - The longitude of the observer.
   * @param ra - The right ascension of the celestial object.
   * @param dec - The declination of the celestial object.
   * @returns An object containing the azimuth and elevation in degrees.
   */
  static azEl(date: Date, lat: Degrees, lon: Degrees, ra: Radians, dec: Radians): AzEl<Degrees> {
    const c: RaDec = {
      ra,
      dec,
      dist: 0 as Kilometers,
    };
    const azEl = Sun.azEl(date, lat, lon, c);

    const el = <Radians>(azEl.el + Celestial.atmosphericRefraction(azEl.el)); // elevation correction for refraction

    return {
      az: (azEl.az * RAD2DEG) as Degrees,
      el: (el * RAD2DEG) as Degrees,
    };
  }

  /**
   * Atmospheric refraction in astronomy, refers to the bending of light as it passes through the Earth's
   * atmosphere. This effect is most noticeable for celestial objects like stars and planets when they are
   * close to the horizon. Here's a breakdown of how it works:
   *
   * Actual Position: Due to this bending of light, the apparent position of a celestial object is slightly
   * different from its true position in the sky. When a star or planet is near the horizon, the effect is more
   * pronounced because the light path passes through more of the Earth's atmosphere, which increases the amount of
   * bending.
   *
   * A familiar example of atmospheric refraction is observed during sunrise and sunset. The Sun appears to
   * be above the horizon when it is actually just below it. This is because the light from the Sun is bent
   * upwards as it passes through the atmosphere.
   * @param h - elevation
   * @returns refraction
   */
  static atmosphericRefraction(h: Radians): Radians {
    if (h < 0) {
      h = <Radians>0;
    }

    return <Radians>(0.0002967 / Math.tan(h + 0.00312536 / (h + 0.08901179)));
  }

  /**
   * Calculate the declination. Similar to latitude on Earth, declination is another celestial coordinate.
   * It measures how far north or south an object is from the celestial equator
   * @param l - ecliptic longitude
   * @param b - ecliptic latitude
   * @returns declination
   */
  static declination(l: number, b: number): Radians {
    return <Radians>Math.asin(Math.sin(b) * Math.cos(Sun.e) + Math.cos(b) * Math.sin(Sun.e) * Math.sin(l));
  }

  /**
   * Calculate the right ascension. This is a celestial coordinate used to determine the position of objects
   * in the sky. It's analogous to longitude on Earth. Right Ascension indicates how far east an object is
   * from the vernal equinox along the celestial equator.
   * @param l - ecliptic longitude
   * @param b - ecliptic latitude
   * @returns right ascension
   */
  static rightAscension(l: number, b: number): Radians {
    return <Radians>Math.atan2(Math.sin(l) * Math.cos(Sun.e) - Math.tan(b) * Math.sin(Sun.e), Math.cos(l));
  }

  /**
   * Calculate the elevation. Elevation, or altitude, is the angle between an object in the sky and the
   * observer's local horizon. It's commonly expressed in degrees, where 0 degrees is right at the horizon
   * and 90 degrees is directly overhead (the zenith), but we are using radians to support trigonometric
   * functions like Math.sin() and Math.cos().
   * @param H - siderealTime
   * @param phi - latitude
   * @param dec - The declination of the sun
   * @returns elevation
   */
  static elevation(H: number, phi: Radians, dec: Radians): Radians {
    return <Radians>Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
  }

  /**
   * Calculate the azimuth. This is a compass direction measurement. Azimuth measures the angle along
   * the horizon from a specific reference direction (usually true north) to the point where a vertical
   * line from the object intersects the horizon.
   * @param H - siderealTime
   * @param phi - latitude
   * @param dec - The declination of the sun
   * @returns azimuth in rad
   */
  static azimuth(H: number, phi: Radians, dec: Radians): Radians {
    return <Radians>(Math.PI + Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi)));
  }
}
