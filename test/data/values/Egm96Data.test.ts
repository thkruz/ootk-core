/* eslint-disable dot-notation */
// Generated by Qodo Gen

import { Egm96Data, Egm96Entry } from '../../../src/data/values/Egm96Data.js';

describe('Egm96Data', () => {

  // Creating an Egm96Data instance with valid coefficients
  it('should normalize coefficients when created with fromVals', () => {
    // Arrange
    const testCoeffs: Egm96Entry[] = [
      [2, 0, 1.0, 0.0],
      [2, 1, 0.5, 0.3],
    ];

    // Act
    const egm96Data = Egm96Data.fromVals(testCoeffs);

    // Assert
    const result1 = egm96Data.getCoeffs(2, 0);
    const result2 = egm96Data.getCoeffs(2, 1);

    expect(result1[0]).toBe(2);
    expect(result1[1]).toBe(0);
    expect(result1[2]).not.toBe(1.0); // Should be normalized
    expect(result1[3]).toBe(0.0);

    expect(result2[0]).toBe(2);
    expect(result2[1]).toBe(1);
    expect(result2[2]).not.toBe(0.5); // Should be normalized
    expect(result2[3]).not.toBe(0.3); // Should be normalized
  });
});
