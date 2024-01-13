/**
 * @author Theodore Kruczek.
 * @description Orbital Object ToolKit (ootk) is a collection of tools for working
 * with satellites and other orbital objects.
 *
 * @file The Star class is meant to help with cacluating star positions relative to
 * satellites and earth based sensors.
 *
 * @license MIT License
 *
 * @Copyright (c) 2024 Theodore Kruczek
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this
 * software and associated documentation files (the "Software"), to deal in the Software
 * without restriction, including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons
 * to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or
 * substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
 * PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE
 * FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

import { StarObjectParams } from '../interfaces/StarObjectParams';
import {
  Degrees,
  EciVec3,
  GreenwichMeanSiderealTime,
  Kilometers,
  LlaVec3,
  Radians,
  RaeVec3,
  SpaceObjectType,
} from '../types/types';
import { MILLISECONDS_TO_DAYS } from '../utils/constants';

import { Celestial } from '../body';
import { Sgp4 } from '../sgp4/sgp4';
import { ecf2eci, jday, rae2ecf } from '../transforms/transforms';
import { BaseObject } from './BaseObject';

export class Star extends BaseObject {
  ra: Radians;
  dec: Radians;
  bf: string;
  h: string;
  pname: string;
  vmag?: number;

  constructor(info: StarObjectParams) {
    super(info);
    this.type = SpaceObjectType.STAR;

    this.ra = info.ra;
    this.dec = info.dec;

    this.pname = info.pname ?? '';
    this.bf = info.bf ?? '';
    this.h = info.h ?? '';
    this.vmag = info.vmag;
  }

  eci(lla: LlaVec3 = { lat: <Degrees>180, lon: <Degrees>0, alt: <Kilometers>0 }, date: Date = this.time): EciVec3 {
    const rae = this.rae(lla, date);
    const { gmst } = Star.calculateTimeVariables_(date);

    // Arbitrary distance to enable using ECI coordinates
    return ecf2eci(rae2ecf(rae, { lat: <Degrees>0, lon: <Degrees>0, alt: <Kilometers>0 }), gmst);
  }

  rae(
    lla: LlaVec3<Degrees, Kilometers> = { lat: <Degrees>180, lon: <Degrees>0, alt: <Kilometers>0 },
    date: Date = this.time,
  ): RaeVec3 {
    const starPos = Celestial.getStarAzEl(date, lla.lat, lla.lon, this.ra, this.dec);

    return { az: starPos.az, el: starPos.el, rng: <Kilometers>250000 };
  }

  private static calculateTimeVariables_(date: Date): { gmst: GreenwichMeanSiderealTime; j: number } {
    const j =
      jday(
        date.getUTCFullYear(),
        date.getUTCMonth() + 1,
        date.getUTCDate(),
        date.getUTCHours(),
        date.getUTCMinutes(),
        date.getUTCSeconds(),
      ) +
      date.getUTCMilliseconds() * MILLISECONDS_TO_DAYS;
    const gmst = Sgp4.gstime(j);

    return { gmst, j };
  }
}
