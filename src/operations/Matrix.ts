import { Vector } from './Vector';
import { Vector3D } from './Vector3D';

export class Matrix {
  public elements: number[][];
  public readonly rows: number;
  public readonly columns: number;

  constructor(elements: number[][]) {
    this.elements = elements;
    this.rows = elements.length;
    this.columns = elements[0].length;
  }

  static allZeros(rows: number, columns: number): Matrix {
    return this.fill(rows, columns, 0.0);
  }

  static fill(rows: number, columns: number, value = 0.0): Matrix {
    const elements: number[][] = [];

    for (let i = 0; i < rows; i++) {
      elements[i] = [];
      for (let j = 0; j < columns; j++) {
        elements[i][j] = value;
      }
    }

    return new Matrix(elements);
  }

  public static rotX(theta: number): Matrix {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const result = Matrix.zero(3, 3);

    result.elements[0][0] = 1.0;
    result.elements[1][1] = cosT;
    result.elements[1][2] = sinT;
    result.elements[2][1] = -sinT;
    result.elements[2][2] = cosT;

    return result;
  }

  public static rotY(theta: number): Matrix {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const result = Matrix.zero(3, 3);

    result.elements[0][0] = cosT;
    result.elements[0][2] = -sinT;
    result.elements[1][1] = 1.0;
    result.elements[2][0] = sinT;
    result.elements[2][2] = cosT;

    return result;
  }

  public static rotZ(theta: number): Matrix {
    const cosT = Math.cos(theta);
    const sinT = Math.sin(theta);
    const result = Matrix.zero(3, 3);

    result.elements[0][0] = cosT;
    result.elements[0][1] = sinT;
    result.elements[1][0] = -sinT;
    result.elements[1][1] = cosT;
    result.elements[2][2] = 1.0;

    return result;
  }

  public static zero(rows: number, columns: number): Matrix {
    const elements: number[][] = [];

    for (let i = 0; i < rows; i++) {
      elements[i] = [];
      for (let j = 0; j < columns; j++) {
        elements[i][j] = 0.0;
      }
    }

    return new Matrix(elements);
  }

  public static identity(dimension: number): Matrix {
    const elements: number[][] = [];

    for (let i = 0; i < dimension; i++) {
      elements[i] = [];
      for (let j = 0; j < dimension; j++) {
        elements[i][j] = i === j ? 1.0 : 0.0;
      }
    }

    return new Matrix(elements);
  }

  public static diagonal(d: number[]): Matrix {
    const dimension = d.length;
    const elements: number[][] = [];

    for (let i = 0; i < dimension; i++) {
      elements[i] = [];
      for (let j = 0; j < dimension; j++) {
        elements[i][j] = i === j ? d[i] : 0.0;
      }
    }

    return new Matrix(elements);
  }

  public add(m: Matrix): Matrix {
    const result = Matrix.zero(this.rows, this.columns);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.elements[i][j] = this.elements[i][j] + m.elements[i][j];
      }
    }

    return result;
  }

  public subtract(m: Matrix): Matrix {
    const result = Matrix.zero(this.rows, this.columns);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.elements[i][j] = this.elements[i][j] - m.elements[i][j];
      }
    }

    return result;
  }

  public scale(n: number): Matrix {
    const result = Matrix.zero(this.rows, this.columns);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.elements[i][j] = this.elements[i][j] * n;
      }
    }

    return result;
  }

  public negate(): Matrix {
    return this.scale(-1);
  }

  public multiply(m: Matrix): Matrix {
    const result = Matrix.zero(this.rows, m.columns);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < m.columns; j++) {
        for (let k = 0; k < this.columns; k++) {
          result.elements[i][j] += this.elements[i][k] * m.elements[k][j];
        }
      }
    }

    return result;
  }

  public outerProduct(m: Matrix): Matrix {
    const result = Matrix.zero(this.rows, this.columns);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.elements[i][j] = this.elements[i][j] * m.elements[i][j];
      }
    }

    return result;
  }

  public multiplyVector(v: Vector): Vector {
    const result: number[] = [];

    for (let i = 0; i < this.rows; i++) {
      let total = 0.0;

      for (let j = 0; j < this.columns; j++) {
        total += this.elements[i][j] * v.elements[j];
      }
      result[i] = total;
    }

    return new Vector(result);
  }

  public multiplyVector3D(v: Vector3D): Vector3D {
    const result: number[] = [];

    for (let i = 0; i < this.rows; i++) {
      let total = 0.0;

      for (let j = 0; j < this.columns; j++) {
        switch (j) {
          case 0:
            total += this.elements[i][j] * v.x;
            break;
          case 1:
            total += this.elements[i][j] * v.y;
            break;
          case 2:
            total += this.elements[i][j] * v.z;
            break;
          default:
            break;
        }
      }
      result[i] = total;
    }

    return new Vector3D(result[0], result[1], result[2]);
  }

  public reciprocal(): Matrix {
    const output = Matrix.zero(this.rows, this.columns);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.elements[i][j] !== 0) {
          output.elements[i][j] = 1 / this.elements[i][j];
        }
      }
    }

    return output;
  }

  public transpose(): Matrix {
    const result = Matrix.zero(this.columns, this.rows);

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        result.elements[j][i] = this.elements[i][j];
      }
    }

    return result;
  }

  public cholesky(): Matrix {
    const result = Matrix.zero(this.rows, this.rows);

    for (let i = 0; i < this.rows; i++) {
      for (let k = 0; k < i + 1; k++) {
        let total = 0.0;

        for (let j = 0; j < k; j++) {
          total += result.elements[i][j] * result.elements[k][j];
        }
        result.elements[i][k] =
          i === k
            ? Math.sqrt(this.elements[i][i] - total)
            : (1 / result.elements[k][k]) * (this.elements[i][k] - total);
      }
    }

    return result;
  }

  private _swapRows(i: number, j: number): void {
    if (i === j) {
      return;
    }
    const tmp = this.elements[i];

    this.elements[i] = this.elements[j];
    this.elements[j] = tmp;
  }

  private _toReducedRowEchelonForm(): void {
    for (let lead = 0, row = 0; row < this.rows && lead < this.columns; ++row, ++lead) {
      let i = row;

      while (this.elements[i][lead] === 0) {
        if (++i === this.rows) {
          i = row;
          if (++lead === this.columns) {
            return;
          }
        }
      }
      this._swapRows(i, row);
      if (this.elements[row][lead] !== 0) {
        const f = this.elements[row][lead];

        for (let column = 0; column < this.columns; ++column) {
          this.elements[row][column] /= f;
        }
      }
      for (let j = 0; j < this.rows; ++j) {
        if (j === row) {
          continue;
        }
        const f = this.elements[j][lead];

        for (let column = 0; column < this.columns; ++column) {
          this.elements[j][column] -= f * this.elements[row][column];
        }
      }
    }
  }

  public inverse(): Matrix {
    const tmp = Matrix.zero(this.rows, this.columns * 2);

    for (let row = 0; row < this.rows; ++row) {
      for (let column = 0; column < this.columns; ++column) {
        tmp.elements[row][column] = this.elements[row][column];
      }
      tmp.elements[row][row + this.columns] = 1.0;
    }
    tmp._toReducedRowEchelonForm();
    const inv = Matrix.zero(this.rows, this.columns);

    for (let row = 0; row < this.rows; ++row) {
      for (let column = 0; column < this.columns; ++column) {
        inv.elements[row][column] = tmp.elements[row][column + this.columns];
      }
    }

    return inv;
  }
}
