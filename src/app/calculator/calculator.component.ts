import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalculatorService, Operator } from './calculator.service';

@Component({
  selector: 'app-calculator',
  imports: [CommonModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  display = '0';
  error = '';

  private firstOperand: number | null = null;
  private currentOperator: Operator | null = null;
  private waitingForSecondOperand = false;
  private justEvaluated = false;

  constructor(private calculatorService: CalculatorService) {}

  get displayValue(): string {
    return this.display;
  }

  onDigit(digit: string): void {
    this.error = '';

    if (this.justEvaluated) {
      this.display = digit;
      this.justEvaluated = false;
      return;
    }

    if (this.waitingForSecondOperand) {
      this.display = digit;
      this.waitingForSecondOperand = false;
    } else {
      this.display = this.display === '0' ? digit : this.display + digit;
    }

    if (this.display.length > 15) {
      this.display = this.display.slice(0, 15);
    }
  }

  onDecimal(): void {
    this.error = '';

    if (this.justEvaluated) {
      this.display = '0.';
      this.justEvaluated = false;
      return;
    }

    if (this.waitingForSecondOperand) {
      this.display = '0.';
      this.waitingForSecondOperand = false;
      return;
    }

    if (!this.display.includes('.')) {
      this.display += '.';
    }
  }

  onOperator(operator: Operator): void {
    this.error = '';
    this.justEvaluated = false;

    const currentValue = parseFloat(this.display);

    if (this.firstOperand !== null && !this.waitingForSecondOperand) {
      const result = this.calculatorService.calculate(
        this.firstOperand,
        this.currentOperator!,
        currentValue
      );
      if (result.error) {
        this.error = result.error;
        this.clear();
        return;
      }
      this.display = this.formatResult(result.value);
      this.firstOperand = result.value;
    } else {
      this.firstOperand = currentValue;
    }

    this.currentOperator = operator;
    this.waitingForSecondOperand = true;
  }

  onEquals(): void {
    this.error = '';

    if (this.firstOperand === null || this.currentOperator === null) {
      return;
    }

    const secondOperand = parseFloat(this.display);
    const result = this.calculatorService.calculate(
      this.firstOperand,
      this.currentOperator,
      secondOperand
    );

    if (result.error) {
      this.error = result.error;
      this.clear();
      return;
    }

    this.display = this.formatResult(result.value);
    this.firstOperand = null;
    this.currentOperator = null;
    this.waitingForSecondOperand = false;
    this.justEvaluated = true;
  }

  clear(): void {
    this.display = '0';
    this.firstOperand = null;
    this.currentOperator = null;
    this.waitingForSecondOperand = false;
    this.justEvaluated = false;
  }

  onToggleSign(): void {
    this.error = '';
    if (this.display !== '0') {
      this.display = this.display.startsWith('-')
        ? this.display.slice(1)
        : '-' + this.display;
    }
  }

  onPercent(): void {
    this.error = '';
    const value = parseFloat(this.display);
    this.display = this.formatResult(value / 100);
  }

  private formatResult(value: number): string {
    if (!isFinite(value)) {
      this.error = 'Result is too large';
      return '0';
    }
    const str = String(value);
    if (str.length > 15) {
      return parseFloat(value.toPrecision(10)).toString();
    }
    return str;
  }
}
