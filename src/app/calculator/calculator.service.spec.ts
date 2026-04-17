import { TestBed } from '@angular/core/testing';
import { CalculatorService, Operator } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add two numbers', () => {
    const result = service.calculate({ leftOperand: 2, operator: '+', rightOperand: 3 });
    expect(result.value).toBe(5);
    expect(result.error).toBeUndefined();
  });

  it('should subtract two numbers', () => {
    const result = service.calculate({ leftOperand: 10, operator: '-', rightOperand: 4 });
    expect(result.value).toBe(6);
  });

  it('should multiply two numbers', () => {
    const result = service.calculate({ leftOperand: 3, operator: '×', rightOperand: 7 });
    expect(result.value).toBe(21);
  });

  it('should divide two numbers', () => {
    const result = service.calculate({ leftOperand: 15, operator: '÷', rightOperand: 3 });
    expect(result.value).toBe(5);
  });

  it('should return error for division by zero', () => {
    const result = service.calculate({ leftOperand: 5, operator: '÷', rightOperand: 0 });
    expect(result.error).toBe('Cannot divide by zero');
    expect(result.value).toBeNaN();
  });

  it('should return error for NaN input', () => {
    const result = service.calculate({ leftOperand: NaN, operator: '+', rightOperand: 3 });
    expect(result.error).toBe('Invalid number input');
  });

  it('should return error for Infinity input', () => {
    const result = service.calculate({ leftOperand: Infinity, operator: '+', rightOperand: 3 });
    expect(result.error).toBe('Number is too large');
  });

  it('should handle negative numbers', () => {
    const result = service.calculate({ leftOperand: -5, operator: '+', rightOperand: 3 });
    expect(result.value).toBe(-2);
  });

  it('should handle decimal numbers', () => {
    const result = service.calculate({ leftOperand: 0.1, operator: '+', rightOperand: 0.2 });
    expect(result.value).toBeCloseTo(0.3);
  });

  it('should return error for unknown operator', () => {
    const result = service.calculate({ leftOperand: 1, operator: '^' as Operator, rightOperand: 2 });
    expect(result.error).toBe('Unknown operator');
  });
});
