import { Injectable } from '@angular/core';

export type Operator = '+' | '-' | '×' | '÷';

export interface CalculationParams {
  leftOperand: number;
  operator: Operator;
  rightOperand: number;
}

export interface CalculationResult {
  value: number;
  error?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CalculatorService {
  calculate({ leftOperand, operator, rightOperand }: CalculationParams): CalculationResult {
    if (isNaN(leftOperand) || isNaN(rightOperand)) {
      return { value: NaN, error: 'Invalid number input' };
    }

    if (!isFinite(leftOperand) || !isFinite(rightOperand)) {
      return { value: NaN, error: 'Number is too large' };
    }

    switch (operator) {
      case '+':
        return { value: leftOperand + rightOperand };
      case '-':
        return { value: leftOperand - rightOperand };
      case '×':
        return { value: leftOperand * rightOperand };
      case '÷':
        if (rightOperand === 0) {
          return { value: NaN, error: 'Cannot divide by zero' };
        }
        return { value: leftOperand / rightOperand };
      default:
        return { value: NaN, error: 'Unknown operator' };
    }
  }
}
