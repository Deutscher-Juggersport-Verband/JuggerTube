import {
  AbstractControl,
  FormControl,
  FormGroup,
  ValidationErrors,
} from '@angular/forms';

export function markAllFieldsAsTouched(form: FormGroup): void {
  Object.keys(form.controls).forEach((field) => {
    const control = form.get(field);
    if (control instanceof FormControl) {
      control.markAsTouched({ onlySelf: true });
    }
  });
}

let isUpdating = false;
export function updateAllControlsValidity(form: FormGroup): void {
  if (isUpdating) return;
  isUpdating = true;

  Object.keys(form.controls).forEach((key) => {
    const control = form.get(key);
    if (control) {
      control.updateValueAndValidity();
    }
  });

  isUpdating = false;
}

export function notZeroValidator(
  control: AbstractControl
): ValidationErrors | null {
  return control.value === 0 ? { notZero: true } : null;
}
