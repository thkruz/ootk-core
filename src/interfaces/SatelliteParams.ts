import { EciVec3, SpaceObjectType, TleLine1, TleLine2 } from '../types/types';

/**
 * TODO: Reduce unnecessary calls to calculateTimeVariables using optional
 * parameters and caching.
 */
/**
 * Information about a space object.
 */

export interface SatelliteParams {
  name?: string;
  rcs?: number;
  tle1: TleLine1;
  tle2: TleLine2;
  type?: SpaceObjectType;
  vmag?: number;
  sccNum?: string;
  intlDes?: string;
  position?: EciVec3;
  time?: Date;
}
