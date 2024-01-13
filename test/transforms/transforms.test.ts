import {
  Degrees,
  ecf2eci,
  ecf2rae,
  eci2ecf,
  eci2lla,
  getDegLat,
  getDegLon,
  getRadLat,
  getRadLon,
  Kilometers,
  lla2ecf,
  rae2ecf,
  rae2sez,
} from '../../lib/index';
import { transformsData } from './transformsData';

const numDigits = 6;

describe('Latitude & longitude conversions', () => {
  const {
    validLatitudes,
    validLongitudes,
    validGeodeticToEcf,
    validEciToGeodetic,
    validEciToEcf,
    validEcfToEci,
    validEcfToLookangles,
    invalidLatitudes,
    invalidLongitudes,
  } = transformsData;

  validLatitudes.forEach((item) => {
    it(`convert valid latitude value (${item.radians} radians) to degrees`, () => {
      expect(getDegLat(item.radians)).toBeCloseTo(item.degrees, numDigits);
    });
    it(`convert valid latitude value (${item.degrees} degrees) to radians`, () => {
      expect(getRadLat(item.degrees)).toBeCloseTo(item.radians, numDigits);
    });
  });

  validLongitudes.forEach((item) => {
    it(`convert valid longitude value (${item.radians} radians) to degrees`, () => {
      expect(getDegLon(item.radians)).toBeCloseTo(item.degrees, numDigits);
    });
    it(`convert valid longitude value (${item.degrees} degrees) to radians`, () => {
      expect(getRadLon(item.degrees)).toBeCloseTo(item.radians, numDigits);
    });
  });

  validGeodeticToEcf.forEach((item) => {
    it('convert valid LLA coordinates to ECF', () => {
      const ecfCoordinates = lla2ecf(item.lla);

      expect(ecfCoordinates.x).toBeCloseTo(item.ecf.x);
      expect(ecfCoordinates.y).toBeCloseTo(item.ecf.y);
      expect(ecfCoordinates.z).toBeCloseTo(item.ecf.z);
    });
  });

  validEciToGeodetic.forEach((item) => {
    it('convert valid ECI coordinates to LLA', () => {
      const llaCoordinates = eci2lla(item.eci, item.gmst);

      expect(llaCoordinates.lon).toBeCloseTo(item.lla.lon);
      expect(llaCoordinates.lat).toBeCloseTo(item.lla.lat);
      expect(llaCoordinates.alt).toBeCloseTo(item.lla.alt);
    });
  });

  validEciToEcf.forEach((item) => {
    it('convert valid ECI coordinates to ECF', () => {
      const ecfCoordinates = eci2ecf(item.eci, item.gmst);

      expect(ecfCoordinates.x).toBeCloseTo(item.ecf.x);
      expect(ecfCoordinates.y).toBeCloseTo(item.ecf.y);
      expect(ecfCoordinates.z).toBeCloseTo(item.ecf.z);
    });
  });

  validEcfToEci.forEach((item) => {
    it('convert valid ECF coordinates to ECI', () => {
      const eciCoordinates = ecf2eci(item.ecf, item.gmst);

      expect(eciCoordinates.x).toBeCloseTo(item.eci.x);
      expect(eciCoordinates.y).toBeCloseTo(item.eci.y);
      expect(eciCoordinates.z).toBeCloseTo(item.eci.z);
    });
  });

  validEcfToLookangles.forEach((item) => {
    it('convert valid ECF coordinates to RAE', () => {
      const raeCoordinates = ecf2rae(item.lla, item.satelliteEcf);

      expect(raeCoordinates.rng).toBeCloseTo(item.rae.rng, 0);
      expect(raeCoordinates.az).toBeCloseTo(item.rae.az, 1);
      expect(raeCoordinates.el).toBeCloseTo(item.rae.el, 1);
    });
  });

  invalidLatitudes.forEach((item) => {
    it(`convert invalid latitude value (${item.radians} radians) to degrees`, () => {
      expect(() => getDegLat(item.radians)).toThrowError(RangeError);
    });
    it(`convert invalid latitude value (${item.degrees} degrees) to radians`, () => {
      expect(() => getRadLat(item.degrees)).toThrowError(RangeError);
    });
  });

  invalidLongitudes.forEach((item) => {
    it(`convert invalid longitude value (${item.radians} radians) to degrees`, () => {
      expect(() => getDegLon(item.radians)).toThrowError(RangeError);
    });
    it(`convert invalid longitude value (${item.degrees} degrees) to radians`, () => {
      expect(() => getRadLon(item.degrees)).toThrowError(RangeError);
    });
  });
});

describe('Rae2Sez', () => {
  it('should convert valid RAE coordinates to SEZ', () => {
    const { rae, sez } = transformsData.validRae2Sez[0];
    const sezCoordinates = rae2sez(rae);

    expect(sezCoordinates.s).toBeCloseTo(sez.s);
    expect(sezCoordinates.e).toBeCloseTo(sez.e);
    expect(sezCoordinates.z).toBeCloseTo(sez.z);
  });
});

describe('Rae2Ecf', () => {
  it('should convert valid RAE coordinates to ECF', () => {
    // const { rae, ecf, lla } = transformData.validRae2Ecf[0];
    const ecf = {
      x: 4000,
      y: 4000,
      z: 4000,
    };
    const lla = {
      lon: 0 as Degrees,
      lat: 0 as Degrees,
      alt: 0 as Kilometers,
    };
    const rae = ecf2rae(lla, ecf);

    const ecfCoordinates = rae2ecf(rae, lla);

    expect(ecfCoordinates.x).toBeCloseTo(ecf.x);
    expect(ecfCoordinates.y).toBeCloseTo(ecf.y);
    expect(ecfCoordinates.z).toBeCloseTo(ecf.z);
  });
});
