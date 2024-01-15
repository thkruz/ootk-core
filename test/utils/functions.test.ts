import { Radians, acoth, acsch, asech, concat, copySign, csch, log10, sech, wrapAngle } from '../../src/main';

describe('functions', () => {
  it('should be calculate log10', () => {
    expect(log10(100)).toMatchSnapshot();
  });

  // sech
  it('should be calculate sech', () => {
    expect(sech(1)).toMatchSnapshot();
  });

  // csch
  it('should be calculate csch', () => {
    expect(csch(1)).toMatchSnapshot();
  });

  // acsch
  it('should be calculate acsch', () => {
    expect(acsch(1)).toMatchSnapshot();
  });

  // asech
  it('should be calculate asech', () => {
    expect(asech(1)).toMatchSnapshot();
  });

  // acotch
  it('should be calculate acotch', () => {
    expect(acoth(1)).toMatchSnapshot();
  });

  // copySign
  it('should be calculate copySign', () => {
    expect(copySign(1, 1)).toMatchSnapshot();
    expect(copySign(-1, 1)).toMatchSnapshot();
    expect(copySign(1, -1)).toMatchSnapshot();
    expect(copySign(-1, -1)).toMatchSnapshot();
  });

  // concat
  it('should be calculate concat', () => {
    expect(concat(new Float64Array([1, 2, 3]), new Float64Array([4, 5, 6]))).toMatchSnapshot();
  });

  // wrapAngle
  it('should be calculate wrapAngle', () => {
    expect(wrapAngle(1 as Radians)).toMatchSnapshot();
    expect(wrapAngle(5 as Radians)).toMatchSnapshot();
    expect(wrapAngle(-5 as Radians)).toMatchSnapshot();
  });

});
