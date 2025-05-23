import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { UiLabelRowComponent } from '../ui-label-row/ui-label-row.component';

export enum UiInputTypeEnum {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  EMAIL = 'email',
  PASSWORD = 'password',
  // eslint-disable-next-line @typescript-eslint/no-duplicate-enum-values
  DROPDOWN = 'dropdown',
}

export enum UiInputDirectionEnum {
  COLUMN = 'column',
  ROW = 'row',
}

@Component({
  selector: 'ui-input',
  imports: [CommonModule, ReactiveFormsModule, UiLabelRowComponent],
  standalone: true,
  templateUrl: './ui-input.component.html',
  styleUrl: './ui-input.component.less',
})
export class UiInputComponent {
  @Input() public labelText!: string;
  @Input() public type: UiInputTypeEnum = UiInputTypeEnum.TEXT;
  @Input() public placeholder: string = '';
  @Input() public direction: UiInputDirectionEnum = UiInputDirectionEnum.COLUMN;
  @Input() public formControlElement!: FormControl;
  @Input() public infoButtonHeadline?: string;
  @Input() public infoButtonContent?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input() public dropdownOptions?: any[];
  @Input() public flexibleLabel: boolean = false;

  @HostBinding('class')
  private get hostClass(): UiInputDirectionEnum {
    return this.direction;
  }

  protected readonly UiInputTypeEnum = UiInputTypeEnum;
}
