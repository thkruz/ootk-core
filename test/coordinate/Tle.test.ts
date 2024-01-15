import { ClassicalElements, EpochUTC, Kilometers, Radians, Tle, TleLine1, TleLine2 } from '../../src/main';

describe('Tle', () => {
  let tle: Tle;
  let exampleDate: Date;

  beforeEach(() => {
    // Sample TLE
    const tle1 = '1 56006U 23042W   24012.45049317  .00000296  00000-0  36967-4 0  9992' as TleLine1;
    const tle2 = '2 56006 143.0043  13.3620 0001137 267.5965  92.4747 15.02542972 44491' as TleLine2;
    const mockExampleDate = new Date(1705109326817);

    exampleDate = new Date(mockExampleDate.getTime());
    tle = new Tle(tle1, tle2);
  });

  // toString
  it('should return the TLE as a string', () => {
    expect(tle.toString()).toMatchSnapshot();
  });

  // semiMajorAxis
  it('should return the semi-major axis', () => {
    expect(tle.semimajorAxis).toMatchSnapshot();
  });

  // eccentricity
  it('should return the eccentricity', () => {
    expect(tle.eccentricity).toMatchSnapshot();
  });

  // inclination
  it('should return the inclination', () => {
    expect(tle.inclination).toMatchSnapshot();
  });

  // inclinationDeg
  it('should return the inclination in degrees', () => {
    expect(tle.inclinationDegrees).toMatchSnapshot();
  });

  // apogee
  it('should return the apogee', () => {
    expect(tle.apogee).toMatchSnapshot();
  });

  // perigee
  it('should return the perigee', () => {
    expect(tle.perigee).toMatchSnapshot();
  });

  // period
  it('should return the period', () => {
    expect(tle.period).toMatchSnapshot();
  });

  // propagate
  it('should propagate the TLE', () => {
    const epoch = EpochUTC.fromDateTime(exampleDate);
    const propagated = tle.propagate(epoch);

    expect(propagated).toMatchSnapshot();
  });

  // state
  it('should return the state vector', () => {
    expect(tle.state).toMatchSnapshot();
  });

  // fromClassicalElements
  it('should create a TLE from classical orbital elements', () => {
    const epoch = EpochUTC.fromDateTime(exampleDate);
    const elements = new ClassicalElements({
      epoch,
      semimajorAxis: 6943.547853722985 as Kilometers,
      eccentricity: 0.0011235968124658146,
      inclination: 0.7509087232045765 as Radians,
      rightAscension: 0.028239555738616327 as Radians,
      argPerigee: 2.5386411901807353 as Radians,
      trueAnomaly: 0.5931399364974058 as Radians,
    });
    const tle = Tle.fromClassicalElements(elements);

    expect(tle).toMatchSnapshot();
  });
});
