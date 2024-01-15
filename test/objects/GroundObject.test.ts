import { mockExampleDate } from '../lib/mockData';
import { Degrees, Geodetic, GroundObject, Kilometers, Radians } from '../../src/main';

describe('GroundObject', () => {
  let groundObject: GroundObject;
  let geodetic: Geodetic;

  beforeEach(() => {
    groundObject = new GroundObject({
      lat: 0 as Degrees,
      lon: 0 as Degrees,
      alt: 0 as Kilometers,
    });

    geodetic = new Geodetic(
      0 as Radians,
      0 as Radians,
      0 as Kilometers,
    );
  });

  it('should be defined', () => {
    expect(groundObject).toBeDefined();
  });

  it('should have a name', () => {
    expect(groundObject.name).toBeDefined();
  });

  it('should have a latitude', () => {
    expect(groundObject.lat).toBeDefined();
  });

  it('should have a longitude', () => {
    expect(groundObject.lon).toBeDefined();
  });

  it('should calculate ecf', () => {
    expect(groundObject.ecf()).toMatchSnapshot();
  });

  it('should calculate eci', () => {
    expect(groundObject.eci(mockExampleDate)).toMatchSnapshot();
  });

  it('should calculate llaRad', () => {
    expect(groundObject.llaRad()).toMatchSnapshot();
  });

  it('should create from geodetic', () => {
    expect(GroundObject.fromGeodetic(geodetic)).toMatchSnapshot();
  });

  it('should convert to geodetic', () => {
    expect(groundObject.toGeodetic()).toMatchSnapshot();
  });
});
