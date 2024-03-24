/**
 * @author Theodore Kruczek.
 * @license MIT
 * @copyright (c) 2022-2024 Theodore Kruczek Permission is
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

import { Kilometers, KilometersPerSecond, Radians, RadiansPerSecond } from '../main.js';
import { Vector3D } from '../operations/Vector3D.js';

export const radecToPosition = (ra: Radians, dec: Radians, r: Kilometers): Vector3D<Kilometers> => {
  const ca = Math.cos(ra);
  const sa = Math.sin(ra);
  const cd = Math.cos(dec);
  const sd = Math.sin(dec);

  return new Vector3D(r * cd * ca as Kilometers, r * cd * sa as Kilometers, r * sd as Kilometers);
};

export const radecToVelocity = (
  ra: Radians,
  dec: Radians,
  r: Kilometers,
  raDot: RadiansPerSecond,
  decDot: RadiansPerSecond,
  rDot: KilometersPerSecond,
): Vector3D<KilometersPerSecond> => {
  const ca = Math.cos(ra);
  const sa = Math.sin(ra);
  const cd = Math.cos(dec);
  const sd = Math.sin(dec);

  return new Vector3D(
    rDot * cd * ca - r * sd * ca * decDot - r * cd * sa * raDot as KilometersPerSecond,
    rDot * cd * sa - r * sd * sa * decDot + r * cd * ca * raDot as KilometersPerSecond,
    rDot * sd + r * cd * decDot as KilometersPerSecond,
  );
};
