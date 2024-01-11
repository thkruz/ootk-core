import { EciVec3, SpaceObjectType } from '../types/types';

export interface BaseObjectParams {
  id?: number;
  name?: string;
  type?: SpaceObjectType;
  position?: EciVec3;
  velocity?: EciVec3;
  time?: Date;
  active?: boolean;
}
