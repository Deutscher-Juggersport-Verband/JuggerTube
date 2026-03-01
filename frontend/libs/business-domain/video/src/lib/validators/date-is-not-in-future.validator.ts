import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

export function dateIsNotInFutureValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dateString = control.value;
    const date = new Date(dateString);

    if (!date) {
      return null;
    }

    const currentDate = new Date();

    return date > currentDate ? { dateIsInFuture: true } : null;
  };
}