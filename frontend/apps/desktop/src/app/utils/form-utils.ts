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

export function notZeroValidator(
  control: AbstractControl
): ValidationErrors | null {
  return control.value === 0 ? { notZero: true } : null;
}
