import { Satellite } from '../objects';
import { Tle } from './Tle';

export type StringifiedNumber = `${number}.${number}`;

export type TleParams = {
  sat?: Satellite;
  inc: StringifiedNumber;
  meanmo: StringifiedNumber;
  rasc: StringifiedNumber;
  argPe: StringifiedNumber;
  meana: StringifiedNumber;
  ecen: string;
  epochyr: string;
  epochday: string;
  /** COSPAR International Designator */
  intl: string;
  /** alpha 5 satellite number */
  scc: string;
};

export abstract class FormatTle {
  static argumentOfPerigee(argPe: number | string): StringifiedNumber {
    if (typeof argPe === 'number') {
      argPe = argPe.toString();
    }

    const argPeNum = parseFloat(argPe).toFixed(4);
    const argPe0 = argPeNum.padStart(8, '0');

    if (argPe0.length !== 8) {
      throw new Error('argPe length is not 8');
    }

    return argPe0 as StringifiedNumber;
  }

  static createTle(tleParams: TleParams): { tle1: string; tle2: string } {
    const { inc, meanmo, rasc, argPe, meana, ecen, epochyr, epochday, intl } = tleParams;
    const scc = Tle.convert6DigitToA5(tleParams.scc);
    const epochYrStr = epochyr.padStart(2, '0');
    const epochdayStr = parseFloat(epochday).toFixed(8).padStart(12, '0');
    const incStr = FormatTle.inclination(inc);
    const meanmoStr = FormatTle.meanMotion(meanmo);
    const rascStr = FormatTle.rightAscension(rasc);
    const argPeStr = FormatTle.argumentOfPerigee(argPe);
    const meanaStr = FormatTle.meanAnomaly(meana);
    const ecenStr = FormatTle.eccentricity(ecen);

    // M' and M'' are both set to 0 to put the object in a perfect stable orbit
    let TLE1Ending = tleParams.sat ? tleParams.sat.tle1.substring(32, 71) : ' +.00000000 +00000+0 +00000-0 0  9990';

    // Add explicit positive/negative signs
    TLE1Ending = TLE1Ending[1] === ' ' ? FormatTle.setCharAt(TLE1Ending, 1, '+') : TLE1Ending;
    TLE1Ending = TLE1Ending[12] === ' ' ? FormatTle.setCharAt(TLE1Ending, 12, '+') : TLE1Ending;
    TLE1Ending = TLE1Ending[21] === ' ' ? FormatTle.setCharAt(TLE1Ending, 21, '+') : TLE1Ending;
    TLE1Ending = TLE1Ending[32] === ' ' ? FormatTle.setCharAt(TLE1Ending, 32, '0') : TLE1Ending;

    const tle1 = `1 ${scc}U ${intl} ${epochYrStr}${epochdayStr}${TLE1Ending}`;
    const tle2 = `2 ${scc} ${incStr} ${rascStr} ${ecenStr} ${argPeStr} ${meanaStr} ${meanmoStr} 00010`;

    return { tle1, tle2 };
  }

  static eccentricity(ecen: string): string {
    let ecen0 = ecen.padEnd(9, '0');

    if (ecen0[1] === '.') {
      ecen0 = ecen0.substring(2);
    } else {
      ecen0 = ecen0.substring(0, 7);
    }
    if (ecen0.length !== 7) {
      throw new Error('ecen length is not 7');
    }

    return ecen0;
  }

  static inclination(inc: number | string): StringifiedNumber {
    if (typeof inc === 'number') {
      inc = inc.toString();
    }

    const incNum = parseFloat(inc).toFixed(4);
    const inc0 = incNum.padStart(8, '0');

    if (inc0.length !== 8) {
      throw new Error('inc length is not 8');
    }

    return inc0 as StringifiedNumber;
  }

  static meanAnomaly(meana: number | string): StringifiedNumber {
    if (typeof meana === 'number') {
      meana = meana.toString();
    }

    const meanaNum = parseFloat(meana).toFixed(4);
    const meana0 = meanaNum.padStart(8, '0');

    if (meana0.length !== 8) {
      throw new Error('meana length is not 8');
    }

    return meana0 as StringifiedNumber;
  }

  static meanMotion(meanmo: number | string): StringifiedNumber {
    if (typeof meanmo === 'number') {
      meanmo = meanmo.toString();
    }

    const meanmoNum = parseFloat(meanmo).toFixed(8);
    const meanmo0 = meanmoNum.padStart(11, '0');

    if (meanmo0.length !== 11) {
      throw new Error('meanmo length is not 11');
    }

    return meanmo0 as StringifiedNumber;
  }

  static rightAscension(rasc: number | string): StringifiedNumber {
    if (typeof rasc === 'number') {
      rasc = rasc.toString();
    }

    const rascNum = parseFloat(rasc).toFixed(4);
    const rasc0 = rascNum.padStart(8, '0');

    if (rasc0.length !== 8) {
      throw new Error('rasc length is not 8');
    }

    return rasc0 as StringifiedNumber;
  }

  static setCharAt(str: string, index: number, chr: string) {
    if (index > str.length - 1) {
      return str;
    }

    return `${str.substring(0, index)}${chr}${str.substring(index + 1)}`;
  }
}
