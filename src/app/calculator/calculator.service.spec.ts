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
    const result = service.calculate(2, '+', 3);
    expect(result.value).toBe(5);
    expect(result.error).toBeUndefined();
  });

  it('should subtract two numbers', () => {
    const result = service.calculate(10, '-', 4);
    expect(result.value).toBe(6);
  });

  it('should multiply two numbers', () => {
    const result = service.calculate(3, '×', 7);
    expect(result.value).toBe(21);
  });

  it('should divide two numbers', () => {
    const result = service.calculate(15, '÷', 3);
    expect(result.value).toBe(5);
  });

  it('should return error for division by zero', () => {
    const result = service.calculate(5, '÷', 0);
    expect(result.error).toBe('Cannot divide by zero');
    expect(result.value).toBeNaN();
  });

  it('should return error for NaN input', () => {
    const result = service.calculate(NaN, '+', 3);
    expect(result.error).toBe('Invalid number input');
  });

  it('should return error for Infinity input', () => {
    const result = service.calculate(Infinity, '+', 3);
    expect(result.error).toBe('Number is too large');
  });

  it('should handle negative numbers', () => {
    const result = service.calculate(-5, '+', 3);
    expect(result.value).toBe(-2);
  });

  it('should handle decimal numbers', () => {
    const result = service.calculate(0.1, '+', 0.2);
    expect(result.value).toBeCloseTo(0.3);
  });

  it('should return error for unknown operator', () => {
    const result = service.calculate(1, '^' as Operator, 2);
    expect(result.error).toBe('Unknown operator');
  });
});
