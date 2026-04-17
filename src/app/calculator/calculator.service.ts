import { Injectable } from '@angular/core';

export type Operator = '+' | '-' | '×' | '÷';

export interface CalculationResult {
  value: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  calculate(a: number, operator: Operator, b: number): CalculationResult {
    if (isNaN(a) || isNaN(b)) {
      return { value: NaN, error: 'Invalid number input' };
    }

    if (!isFinite(a) || !isFinite(b)) {
      return { value: NaN, error: 'Number is too large' };
    }

    switch (operator) {
      case '+':
        return { value: a + b };
      case '-':
        return { value: a - b };
      case '×':
        return { value: a * b };
      case '÷':
        if (b === 0) {
          return { value: NaN, error: 'Cannot divide by zero' };
        }
        return { value: a / b };
      default:
        return { value: NaN, error: 'Unknown operator' };
    }
  }
}
