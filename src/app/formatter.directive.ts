import { Directive, Renderer2, ElementRef, forwardRef, HostListener, Optional, Inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, DefaultValueAccessor, COMPOSITION_BUFFER_MODE } from '@angular/forms';

export const DEFAULT_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormatterDirective),
  multi: true
};

@Directive({
  selector: '[appFormatter]',
  providers: [DEFAULT_VALUE_ACCESSOR],
  host: {
    '(input)': '$any(this)._handleInput($event.target.value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': '$any(this)._compositionStart()',
    '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
  },
})
export class FormatterDirective implements ControlValueAccessor {
    /**
   * @description
   * The registered callback function called when an input event occurs on the input element.
   */
  onChange = (_: any) => {};

  /**
   * @description
   * The registered callback function called when a blur event occurs on the input element.
   */
  onTouched = () => {};

  /** Whether the user is creating a composition string (IME events). */
  private _composing = false;
  changeFn: any;
  touchFn: any;
  constructor(private dp: DecimalPipe, private dom: Renderer2, private elementRef: ElementRef, 
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) private _compositionMode: boolean) {
    console.log('elementRef', elementRef);

    this.format(this.elementRef.nativeElement.value);
  }

  writeValue(obj: any): void {
    console.log('new value', obj);
    this.format(obj.toString())
    //throw new Error("Method not implemented.");
  }
   /**
   * @description
   * Registers a function called when the control value changes.
   *
   * @param fn The callback function
   */
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }

  /**
   * @description
   * Registers a function called when the control is touched.
   *
   * @param fn The callback function
   */
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }


  /** @internal */
  _handleInput(value: any): void {
    if (!this._compositionMode || (this._compositionMode && !this._composing)) {
      this.onChange(value);
    }
  }

  /** @internal */
  _compositionStart(): void { this._composing = true; }

  /** @internal */
  _compositionEnd(value: any): void {
    this._composing = false;
    this._compositionMode && this.onChange(value);
  }
  setDisabledState?(isDisabled: boolean): void {
    if (isDisabled) {
      this.dom.setAttribute(this.elementRef.nativeElement, 'disabled', 'disabled');
    } else {
      this.dom.removeAttribute(this.elementRef.nativeElement, 'disabled');
    }
  }

  

  @HostListener('keyup', ['$event'])
  keyUpHandler(evt) {
    // console.log(evt.key, `run? ${!this.eventHasModifier(event) && !this.isModifierKey(evt.code)}`, !this.eventHasModifier(event), !this.isModifierKey(evt.code))
    if (!this.eventHasModifier(event) && !this.isModifierKey(evt.code)) {
      this.format(evt.target.value)
    }
  }

  private eventHasModifier(event) {
    const modifier = [
      'ControlRight',
      'ControlLeft',
      'AltLeft',
      'AltRight',
      'ShiftLeft',
      'ShiftRight',
      'Control',
      'Meta',
      'Shift',
      'AltGraph',
      'Alt',
      'CapsLock'
    ].find((keyName) => {
      return event.getModifierState(keyName)
    });

    console.log('modifier', modifier);

    return modifier !== void 0;
  }

  isModifierKey(keyCode) {
    return [
      'Control',
      'Meta',
      'Shift',
      'AltGraph',
      'Alt',
      'CapsLock'
    ].indexOf(keyCode) >= 0
  }

  private format(value: string) {

    if (!value) {
      return;
    }

    const curosrPos = this.elementRef.nativeElement.selectionStart;

    const regex = /[^0-9.]/g;
    const sanitizedValue = value.replace(regex, '');
    this.elementRef.nativeElement.value = this.dp.transform(sanitizedValue, '1.2-2');
    setTimeout(() => {
      // this.elementRef.nativeElement.selectionStart = curosrPos;
      // this.elementRef.nativeElement.selectionEnd = curosrPos;
      this.elementRef.nativeElement.setSelectionRange(curosrPos, curosrPos)
      
    }, 0);

  }

}
