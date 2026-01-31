
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiInfoButtonComponent } from '../ui-info-button/ui-info-button.component';

export enum UiInputTypeEnum {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email',
  PASSWORD = 'password',
  DROPDOWN = 'dropdown',
  TOGGLE = 'toggle',
}

export enum UiInputDirectionEnum {
  COLUMN = 'column',
  ROW = 'row',
}

@Component({
  selector: 'ui-input',
  imports: [ReactiveFormsModule, UiInfoButtonComponent],
  standalone: true,
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.less',
})
export class UiInputComponent {
  @Input() public formControlElement!: FormControl;
  @Input() public type: UiInputTypeEnum = UiInputTypeEnum.TEXT;
  @Input() public placeholder: string = '';

  @Input() public labelText!: string;
  @Input() public direction: UiInputDirectionEnum = UiInputDirectionEnum.COLUMN;

  @Input() public infoButtonHeadline?: string;
  @Input() public infoButtonContent?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public dropdownOptions?: any[];
  @Input() public flexibleLabel: boolean = false;
  @Output() public valueChange = new EventEmitter<boolean>();

  protected readonly UiInputTypeEnum = UiInputTypeEnum;

  constructor() {
    if (this.formControlElement && this.formControlElement.touched !== undefined) {
      console.log(this.formControlElement.touched)
    }
  }

  public onToggleChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.checked);
  }
}
