import { Vector3D } from '../operations/Vector3D';

export const radecToPosition = (ra: number, dec: number, r: number): Vector3D => {
  const ca = Math.cos(ra);
  const sa = Math.sin(ra);
  const cd = Math.cos(dec);
  const sd = Math.sin(dec);

  return new Vector3D(r * cd * ca, r * cd * sa, r * sd);
};

export const radecToVelocity = (
  ra: number,
  dec: number,
  r: number,
  raDot: number,
  decDot: number,
  rDot: number,
): Vector3D => {
  const ca = Math.cos(ra);
  const sa = Math.sin(ra);
  const cd = Math.cos(dec);
  const sd = Math.sin(dec);

  return new Vector3D(
    rDot * cd * ca - r * sd * ca * decDot - r * cd * sa * raDot,
    rDot * cd * sa - r * sd * sa * decDot + r * cd * ca * raDot,
    rDot * sd + r * cd * decDot,
  );
};
