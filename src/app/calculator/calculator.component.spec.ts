import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalculatorComponent } from './calculator.component';

describe('CalculatorComponent', () => {
  let component: CalculatorComponent;
  let fixture: ComponentFixture<CalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalculatorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display 0 initially', () => {
    expect(component.displayValue()).toBe('0');
  });

  it('should input digits', () => {
    component.appendDigit('5');
    expect(component.displayValue()).toBe('5');
    component.appendDigit('3');
    expect(component.displayValue()).toBe('53');
  });

  it('should replace 0 with first digit', () => {
    component.appendDigit('7');
    expect(component.displayValue()).toBe('7');
  });

  it('should handle decimal point', () => {
    component.appendDigit('3');
    component.appendDecimal();
    component.appendDigit('5');
    expect(component.displayValue()).toBe('3.5');
  });

  it('should not allow multiple decimal points', () => {
    component.appendDigit('3');
    component.appendDecimal();
    component.appendDecimal();
    component.appendDigit('5');
    expect(component.displayValue()).toBe('3.5');
  });

  it('should perform addition', () => {
    component.appendDigit('5');
    component.setOperator('+');
    component.appendDigit('3');
    component.evaluate();
    expect(component.displayValue()).toBe('8');
  });

  it('should perform subtraction', () => {
    component.appendDigit('9');
    component.setOperator('-');
    component.appendDigit('4');
    component.evaluate();
    expect(component.displayValue()).toBe('5');
  });

  it('should perform multiplication', () => {
    component.appendDigit('6');
    component.setOperator('×');
    component.appendDigit('7');
    component.evaluate();
    expect(component.displayValue()).toBe('42');
  });

  it('should perform division', () => {
    component.appendDigit('8');
    component.setOperator('÷');
    component.appendDigit('2');
    component.evaluate();
    expect(component.displayValue()).toBe('4');
  });

  it('should show error for division by zero', () => {
    component.appendDigit('5');
    component.setOperator('÷');
    component.appendDigit('0');
    component.evaluate();
    expect(component.errorMessage()).toBe('Cannot divide by zero');
  });

  it('should clear the calculator', () => {
    component.appendDigit('5');
    component.setOperator('+');
    component.appendDigit('3');
    component.clearAll();
    expect(component.displayValue()).toBe('0');
    expect(component.errorMessage()).toBe('');
  });

  it('should toggle sign', () => {
    component.appendDigit('5');
    component.toggleSign();
    expect(component.displayValue()).toBe('-5');
    component.toggleSign();
    expect(component.displayValue()).toBe('5');
  });

  it('should calculate percent', () => {
    component.appendDigit('5');
    component.appendDigit('0');
    component.applyPercent();
    expect(component.displayValue()).toBe('0.5');
  });

  it('should chain operations', () => {
    component.appendDigit('5');
    component.setOperator('+');
    component.appendDigit('3');
    component.setOperator('+');
    expect(component.displayValue()).toBe('8');
    component.appendDigit('2');
    component.evaluate();
    expect(component.displayValue()).toBe('10');
  });

  it('should start new calculation after equals', () => {
    component.appendDigit('5');
    component.setOperator('+');
    component.appendDigit('3');
    component.evaluate();
    expect(component.displayValue()).toBe('8');
    component.appendDigit('2');
    expect(component.displayValue()).toBe('2');
  });

  it('should render calculator buttons in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(19);
  });

  it('should display error message in template', () => {
    component.appendDigit('5');
    component.setOperator('÷');
    component.appendDigit('0');
    component.evaluate();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.error');
    expect(errorEl?.textContent?.trim()).toBe('Cannot divide by zero');
  });
});
