import { Sensor } from '.';
import { Radians } from '../types/types';

// TODO: #3 This should be a class.

export interface RadarSensor extends Sensor {
  coneHalfAngle: Radians;
  boresight: {
    az: Radians;
    el: Radians;
  };
}
