import { EciVec3, SpaceObjectType, TleLine1, TleLine2 } from '../types/types.js';
import { OmmDataFormat } from './OmmFormat.js';

/**
 * Information about a space object.
 */

export interface SatelliteParams {
  name?: string;
  rcs?: number | null;
  omm?: OmmDataFormat;
  tle1?: TleLine1;
  tle2?: TleLine2;
  type?: SpaceObjectType;
  vmag?: number | null;
  sccNum?: string;
  intlDes?: string;
  position?: EciVec3;
  time?: Date;
}
