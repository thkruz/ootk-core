import { Radians } from '../main';

/**
 * Represents the nutation angles.
 */
export type NutationAngles = {
  /**
   * The nutation in longitude (Δψ) in radians.
   */
  dPsi: Radians;
  /**
   * The nutation in obliquity (Δε) in radians.
   */
  dEps: Radians;
  /**
   * The mean obliquity of the ecliptic (ε₀) in radians.
   */
  mEps: Radians;
  /**
   * The true obliquity of the ecliptic (ε) in radians.
   */
  eps: Radians;
  /**
   * The equation of the equinoxes (ΔΔt) in radians.
   */
  eqEq: Radians;
  /**
   * The Greenwich Apparent Sidereal Time (GAST) in radians.
   */
  gast: Radians;
};
