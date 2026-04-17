import { Component, computed, inject, signal } from '@angular/core';
import { CalculatorService, Operator } from './calculator.service';

export interface CalculatorButton {
  label: string;
  cssClass: string;
  handler: () => void;
}

const MAX_DISPLAY_LENGTH = 15;
const PRECISION_DIGITS = 10;

@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss',
})
export class CalculatorComponent {
  private readonly calculatorService = inject(CalculatorService);

  readonly displayValue = signal('0');
  readonly errorMessage = signal('');
  readonly hasError = computed(() => this.errorMessage() !== '');

  private readonly firstOperand = signal<number | null>(null);
  private readonly currentOperator = signal<Operator | null>(null);
  private readonly isWaitingForSecondOperand = signal(false);
  private readonly hasJustEvaluated = signal(false);

  readonly buttons: CalculatorButton[] = [
    { label: 'AC', cssClass: 'btn fn', handler: () => this.clearAll() },
    { label: '+/−', cssClass: 'btn fn', handler: () => this.toggleSign() },
    { label: '%', cssClass: 'btn fn', handler: () => this.applyPercent() },
    { label: '÷', cssClass: 'btn op', handler: () => this.setOperator('÷') },

    { label: '7', cssClass: 'btn', handler: () => this.appendDigit('7') },
    { label: '8', cssClass: 'btn', handler: () => this.appendDigit('8') },
    { label: '9', cssClass: 'btn', handler: () => this.appendDigit('9') },
    { label: '×', cssClass: 'btn op', handler: () => this.setOperator('×') },

    { label: '4', cssClass: 'btn', handler: () => this.appendDigit('4') },
    { label: '5', cssClass: 'btn', handler: () => this.appendDigit('5') },
    { label: '6', cssClass: 'btn', handler: () => this.appendDigit('6') },
    { label: '−', cssClass: 'btn op', handler: () => this.setOperator('-') },

    { label: '1', cssClass: 'btn', handler: () => this.appendDigit('1') },
    { label: '2', cssClass: 'btn', handler: () => this.appendDigit('2') },
    { label: '3', cssClass: 'btn', handler: () => this.appendDigit('3') },
    { label: '+', cssClass: 'btn op', handler: () => this.setOperator('+') },

    { label: '0', cssClass: 'btn zero', handler: () => this.appendDigit('0') },
    { label: '.', cssClass: 'btn', handler: () => this.appendDecimal() },
    { label: '=', cssClass: 'btn op', handler: () => this.evaluate() },
  ];

  appendDigit(digit: string): void {
    this.errorMessage.set('');

    if (this.hasJustEvaluated()) {
      this.displayValue.set(digit);
      this.hasJustEvaluated.set(false);
      return;
    }

    if (this.isWaitingForSecondOperand()) {
      this.displayValue.set(digit);
      this.isWaitingForSecondOperand.set(false);
    } else {
      const current = this.displayValue();
      this.displayValue.set(current === '0' ? digit : current + digit);
    }

    this.truncateDisplay();
  }

  appendDecimal(): void {
    this.errorMessage.set('');

    if (this.hasJustEvaluated()) {
      this.displayValue.set('0.');
      this.hasJustEvaluated.set(false);
      return;
    }

    if (this.isWaitingForSecondOperand()) {
      this.displayValue.set('0.');
      this.isWaitingForSecondOperand.set(false);
      return;
    }

    if (!this.displayValue().includes('.')) {
      this.displayValue.update(current => current + '.');
    }
  }

  setOperator(operator: Operator): void {
    this.errorMessage.set('');
    this.hasJustEvaluated.set(false);

    const currentValue = parseFloat(this.displayValue());

    if (this.firstOperand() !== null && !this.isWaitingForSecondOperand()) {
      const result = this.calculatorService.calculate({
        leftOperand: this.firstOperand()!,
        operator: this.currentOperator()!,
        rightOperand: currentValue,
      });

      if (result.error) {
        this.errorMessage.set(result.error);
        this.clearAll();
        return;
      }

      this.displayValue.set(this.formatResult(result.value));
      this.firstOperand.set(result.value);
    } else {
      this.firstOperand.set(currentValue);
    }

    this.currentOperator.set(operator);
    this.isWaitingForSecondOperand.set(true);
  }

  evaluate(): void {
    this.errorMessage.set('');

    if (this.firstOperand() === null || this.currentOperator() === null) {
      return;
    }

    const result = this.calculatorService.calculate({
      leftOperand: this.firstOperand()!,
      operator: this.currentOperator()!,
      rightOperand: parseFloat(this.displayValue()),
    });

    if (result.error) {
      this.errorMessage.set(result.error);
      this.clearAll();
      return;
    }

    this.displayValue.set(this.formatResult(result.value));
    this.firstOperand.set(null);
    this.currentOperator.set(null);
    this.isWaitingForSecondOperand.set(false);
    this.hasJustEvaluated.set(true);
  }

  clearAll(): void {
    this.displayValue.set('0');
    this.firstOperand.set(null);
    this.currentOperator.set(null);
    this.isWaitingForSecondOperand.set(false);
    this.hasJustEvaluated.set(false);
  }

  toggleSign(): void {
    this.errorMessage.set('');
    const current = this.displayValue();
    if (current !== '0') {
      this.displayValue.set(current.startsWith('-') ? current.slice(1) : '-' + current);
    }
  }

  applyPercent(): void {
    this.errorMessage.set('');
    const value = parseFloat(this.displayValue());
    this.displayValue.set(this.formatResult(value / 100));
  }

  private truncateDisplay(): void {
    if (this.displayValue().length > MAX_DISPLAY_LENGTH) {
      this.displayValue.update(current => current.slice(0, MAX_DISPLAY_LENGTH));
    }
  }

  private formatResult(value: number): string {
    if (!isFinite(value)) {
      this.errorMessage.set('Result is too large');
      return '0';
    }
    const formatted = String(value);
    if (formatted.length > MAX_DISPLAY_LENGTH) {
      return parseFloat(value.toPrecision(PRECISION_DIGITS)).toString();
    }
    return formatted;
  }
}
