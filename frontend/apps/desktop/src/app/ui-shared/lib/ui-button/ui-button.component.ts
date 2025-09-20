import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

export enum UiButtonColorEnum {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  SUCCESS = 'success',
  ERROR = 'error',
  NONE = 'none',
}

export enum UiButtonTypeEnum {
  SUBMIT = 'submit',
  BUTTON = 'button',
  ICON = 'icon',
}

@Component({
  selector: 'ui-button',
  imports: [CommonModule, MatTooltipModule],
  standalone: true,
  templateUrl: './ui-button.component.html',
  styleUrl: './ui-button.component.less',
})
export class UiButtonComponent {
  @Input() public text!: string;
  @Input() public color: UiButtonColorEnum = UiButtonColorEnum.PRIMARY;
  @Input() public type: UiButtonTypeEnum = UiButtonTypeEnum.SUBMIT;
  @Input() public tooltipText?: string;

  @HostBinding('class')
  private get hostClass(): UiButtonColorEnum {
    return this.color;
  }

  protected readonly UiButtonTypeEnum = UiButtonTypeEnum;
}
