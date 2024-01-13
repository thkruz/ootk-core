/**
 * @file   Tests from Utils Module to ensure compatibility
 * @since  1.0.0-alpha3
 */

import { EciVec3, Kilometers, linearDistance, Vec3 } from '../../lib/index'; // eslint-disable-line
import { dopplerFactor, getDayOfYear } from '../../lib/utils/functions';

const numDigits = 8;

const earthRadius = 6378.137;
const sincos45deg = Math.sqrt(2) / 2;

describe('Doppler factor', () => {
  it('without observer movement', () => {
    // North Pole
    const observerEci = {
      x: 0,
      y: 0,
      z: earthRadius,
    } as EciVec3;
    const positionEci = {
      x: 0,
      y: 0,
      z: earthRadius + 500,
    } as EciVec3;
    // Escape velocity
    const velocityEci = {
      x: 7.91,
      y: 0,
      z: 0,
    } as EciVec3;
    const dopFactor = dopplerFactor(observerEci, positionEci, velocityEci);

    expect(dopFactor).toBeCloseTo(1, numDigits);
  });

  it('movement of observer is not affected', () => {
    const observerEci = {
      x: earthRadius,
      y: 0,
      z: 0,
    } as EciVec3;
    const positionEci = {
      x: earthRadius + 500,
      y: 0,
      z: 0,
    } as EciVec3;
    const velocityEci = {
      x: 0,
      y: 7.91,
      z: 0,
    } as EciVec3;
    const dopFactor = dopplerFactor(observerEci, positionEci, velocityEci);

    expect(dopFactor).toBeCloseTo(1, numDigits);
  });

  it('special case', () => {
    const observerEci = {
      x: earthRadius,
      y: 0,
      z: 0,
    } as EciVec3;
    const positionEci = {
      x: (earthRadius + 500) * sincos45deg, // z*sin(45)
      y: (earthRadius + 500) * sincos45deg, // z*cos(45)
      z: 0,
    } as EciVec3;
    const velocityEci = {
      x: 7.91 * sincos45deg,
      y: 7.91 * sincos45deg,
      z: 0,
    } as EciVec3;
    const dopFactor = dopplerFactor(observerEci, positionEci, velocityEci);

    expect(dopFactor).toBeCloseTo(0.9999892152210788, numDigits);
  });

  test('if negative range rate works', () => {
    const observerEci = {
      x: earthRadius,
      y: 0,
      z: 0,
    } as EciVec3;
    const positionEci = {
      x: (earthRadius + 500) * sincos45deg, // z*sin(45)
      y: (earthRadius + 500) * sincos45deg, // z*cos(45)
      z: 0,
    } as EciVec3;
    const velocityEci = {
      x: -7.91 * sincos45deg,
      y: -7.91 * sincos45deg,
      z: 0,
    } as EciVec3;
    const dopFactor = dopplerFactor(observerEci, positionEci, velocityEci);

    expect(dopFactor).toBeCloseTo(1.000013747277977, numDigits);
  });
});

describe('Distance function', () => {
  test('if distance calculation is correct', () => {
    expect(
      linearDistance(
        { x: 1000, y: 1000, z: 1000 } as Vec3<Kilometers>,
        { x: 1000, y: 1000, z: 1000 } as Vec3<Kilometers>,
      ),
    ).toEqual(0);
    expect(
      linearDistance(
        { x: 1000, y: 1000, z: 1000 } as Vec3<Kilometers>,
        { x: 1000, y: 1000, z: 1100 } as Vec3<Kilometers>,
      ),
    ).toEqual(100);
  });
});

describe('doy Functions', () => {
  test('if doy is correct', () => {
    expect(getDayOfYear(new Date(2022, 0, 1))).toEqual(1);
    expect(getDayOfYear(new Date(2022, 1, 1))).toEqual(32);
    expect(getDayOfYear(new Date(2022, 2, 1))).toEqual(60);
    expect(getDayOfYear(new Date(2022, 3, 1))).toEqual(91);
    expect(getDayOfYear(new Date(2022, 4, 1))).toEqual(121);
    expect(getDayOfYear(new Date(2022, 5, 1))).toEqual(152);
    expect(getDayOfYear(new Date(2022, 6, 1))).toEqual(182);
    expect(getDayOfYear(new Date(2022, 7, 1))).toEqual(213);
    expect(getDayOfYear(new Date(2022, 8, 1))).toEqual(244);
    expect(getDayOfYear(new Date(2022, 9, 1))).toEqual(274);
    expect(getDayOfYear(new Date(2022, 10, 1))).toEqual(305);
    expect(getDayOfYear(new Date(2022, 11, 1))).toEqual(335);
  });

  test('if getDayOfYear is correct in leap year', () => {
    expect(getDayOfYear(new Date(2020, 0, 1, 0))).toEqual(1);
    expect(getDayOfYear(new Date(2020, 1, 1, 0))).toEqual(32);
    expect(getDayOfYear(new Date(2020, 2, 1, 0))).toEqual(61);
    expect(getDayOfYear(new Date(2020, 3, 1, 0))).toEqual(92);
    expect(getDayOfYear(new Date(2020, 4, 1, 0))).toEqual(122);
    expect(getDayOfYear(new Date(2020, 5, 1, 0))).toEqual(153);
    expect(getDayOfYear(new Date(2020, 6, 1, 0))).toEqual(183);
    expect(getDayOfYear(new Date(2020, 7, 1, 0))).toEqual(214);
    expect(getDayOfYear(new Date(2020, 8, 1, 0))).toEqual(245);
    expect(getDayOfYear(new Date(2020, 9, 1, 0))).toEqual(275);
    expect(getDayOfYear(new Date(2020, 10, 1, 0))).toEqual(306);
    expect(getDayOfYear(new Date(2020, 11, 1, 0))).toEqual(336);
  });
});
