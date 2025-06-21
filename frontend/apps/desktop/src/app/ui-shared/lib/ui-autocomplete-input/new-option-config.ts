import { FormControl } from '@angular/forms';

import {
  UiInputDirectionEnum,
  UiInputTypeEnum,
} from '../ui-input/ui-input.component';

export interface NewOptionFieldConfig {
  labelText: string;
  type: UiInputTypeEnum;
  formControlElement: FormControl;
  direction: UiInputDirectionEnum;
}

export interface NewOptionConfig {
  labelText: string;
  fields: NewOptionFieldConfig[];
  prefillField?: FormControl;
}

export interface NewOptionRawFieldConfig
  extends Omit<NewOptionFieldConfig, 'formControlElement'> {
  formControlElement: string;
}

export interface NewOptionRawConfig
  extends Omit<NewOptionConfig, 'fields' | 'prefillField'> {
  fields: NewOptionRawFieldConfig[];
  prefillField?: string;
}

export function initConfig(
  config: NewOptionRawConfig,
  formControls: { [key: string]: FormControl }
): NewOptionConfig {
  return {
    labelText: config.labelText,
    fields: config.fields.map((field) => ({
      ...field,
      formControlElement: formControls[field.formControlElement],
    })),
    prefillField: config.prefillField
      ? formControls[config.prefillField]
      : undefined,
  };
}
