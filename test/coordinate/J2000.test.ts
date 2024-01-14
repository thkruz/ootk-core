// Generated by CodiumAI

import { EpochUTC, ClassicalElements, Kilometers, Radians, J2000, Vector3D } from '../../src/main';
import { exampleDate } from '../lib/mockData';

describe('J2000', () => {
  const epoch = EpochUTC.fromDateTime(exampleDate);

  // can be created from classical elements
  it('should create a J2000 coordinate from classical elements', () => {
    const elements = new ClassicalElements({
      epoch,
      semimajorAxis: 6943.547853722985 as Kilometers,
      eccentricity: 0.0011235968124658146,
      inclination: 0.7509087232045765 as Radians,
      rightAscension: 0.028239555738616327 as Radians,
      argPerigee: 2.5386411901807353 as Radians,
      trueAnomaly: 0.5931399364974058 as Radians,
    });
    const j2000 = J2000.fromClassicalElements(elements);

    expect(j2000.epoch).toEqual(elements.epoch);
    expect(j2000.position).toEqual(elements.toPositionVelocity().position);
    expect(j2000.velocity).toEqual(elements.toPositionVelocity().velocity);
  });

  // can get the name of the coordinate system
  it('should return the name of the coordinate system as "J2000"', () => {
    const j2000 = new J2000(
      epoch,
      new Vector3D<Kilometers>(5000 as Kilometers, 10000 as Kilometers, 2100 as Kilometers),
      new Vector3D<Kilometers>(7 as Kilometers, 4 as Kilometers, 2 as Kilometers),
    );

    expect(j2000.name).toBe('J2000');
  });

  // can get a value indicating whether the coordinate system is inertial
  it('should return true for the inertial property', () => {
    const j2000 = new J2000(
      epoch,
      new Vector3D<Kilometers>(5000 as Kilometers, 10000 as Kilometers, 2100 as Kilometers),
      new Vector3D<Kilometers>(7 as Kilometers, 4 as Kilometers, 2 as Kilometers),
    );

    expect(j2000.inertial).toBe(true);
  });

  // Check conversion to and from
  it('should convert to and from other coordinate systems', () => {
    const j2000 = new J2000(
      epoch,
      new Vector3D<Kilometers>(5000 as Kilometers, 10000 as Kilometers, 2100 as Kilometers),
      new Vector3D<Kilometers>(7 as Kilometers, 4 as Kilometers, 2 as Kilometers),
    );
    const itrf = j2000.toITRF();
    const j200FromItf = itrf.toJ2000();

    expect(j200FromItf.position.x).toBeCloseTo(j2000.position.x, 8);
    expect(j200FromItf.position.y).toBeCloseTo(j2000.position.y, 8);
    expect(j200FromItf.position.z).toBeCloseTo(j2000.position.z, 8);

    const teme = j2000.toTEME();
    const j200FromTeme = teme.toJ2000();

    expect(j200FromTeme.position.x).toBeCloseTo(j2000.position.x, 8);
    expect(j200FromTeme.position.y).toBeCloseTo(j2000.position.y, 8);
    expect(j200FromTeme.position.z).toBeCloseTo(j2000.position.z, 8);
  });
});
