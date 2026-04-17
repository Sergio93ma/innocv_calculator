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
    expect(component.displayValue).toBe('0');
  });

  it('should input digits', () => {
    component.onDigit('5');
    expect(component.displayValue).toBe('5');
    component.onDigit('3');
    expect(component.displayValue).toBe('53');
  });

  it('should replace 0 with first digit', () => {
    component.onDigit('7');
    expect(component.displayValue).toBe('7');
  });

  it('should handle decimal point', () => {
    component.onDigit('3');
    component.onDecimal();
    component.onDigit('5');
    expect(component.displayValue).toBe('3.5');
  });

  it('should not allow multiple decimal points', () => {
    component.onDigit('3');
    component.onDecimal();
    component.onDecimal();
    component.onDigit('5');
    expect(component.displayValue).toBe('3.5');
  });

  it('should perform addition', () => {
    component.onDigit('5');
    component.onOperator('+');
    component.onDigit('3');
    component.onEquals();
    expect(component.displayValue).toBe('8');
  });

  it('should perform subtraction', () => {
    component.onDigit('9');
    component.onOperator('-');
    component.onDigit('4');
    component.onEquals();
    expect(component.displayValue).toBe('5');
  });

  it('should perform multiplication', () => {
    component.onDigit('6');
    component.onOperator('×');
    component.onDigit('7');
    component.onEquals();
    expect(component.displayValue).toBe('42');
  });

  it('should perform division', () => {
    component.onDigit('8');
    component.onOperator('÷');
    component.onDigit('2');
    component.onEquals();
    expect(component.displayValue).toBe('4');
  });

  it('should show error for division by zero', () => {
    component.onDigit('5');
    component.onOperator('÷');
    component.onDigit('0');
    component.onEquals();
    expect(component.error).toBe('Cannot divide by zero');
  });

  it('should clear the calculator', () => {
    component.onDigit('5');
    component.onOperator('+');
    component.onDigit('3');
    component.clear();
    expect(component.displayValue).toBe('0');
    expect(component.error).toBe('');
  });

  it('should toggle sign', () => {
    component.onDigit('5');
    component.onToggleSign();
    expect(component.displayValue).toBe('-5');
    component.onToggleSign();
    expect(component.displayValue).toBe('5');
  });

  it('should calculate percent', () => {
    component.onDigit('5');
    component.onDigit('0');
    component.onPercent();
    expect(component.displayValue).toBe('0.5');
  });

  it('should chain operations', () => {
    component.onDigit('5');
    component.onOperator('+');
    component.onDigit('3');
    component.onOperator('+');
    // At this point 5+3=8 should be shown
    expect(component.displayValue).toBe('8');
    component.onDigit('2');
    component.onEquals();
    expect(component.displayValue).toBe('10');
  });

  it('should start new calculation after equals', () => {
    component.onDigit('5');
    component.onOperator('+');
    component.onDigit('3');
    component.onEquals();
    expect(component.displayValue).toBe('8');
    component.onDigit('2');
    expect(component.displayValue).toBe('2');
  });

  it('should render calculator buttons in template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const buttons = compiled.querySelectorAll('button');
    expect(buttons.length).toBe(19);
  });

  it('should display error message in template', () => {
    component.onDigit('5');
    component.onOperator('÷');
    component.onDigit('0');
    component.onEquals();
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const errorEl = compiled.querySelector('.error');
    expect(errorEl?.textContent?.trim()).toBe('Cannot divide by zero');
  });
});
