import { FormControl, FormGroup, Validators } from '@angular/forms';

export const updateMailForm = new FormGroup<{
  email: FormControl<string>;
}>({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  })
});

export const updatePasswordForm = new FormGroup<{
  password: FormControl<string>;
}>({
  password: new FormControl(
    {
      value: '',
      disabled: true,
    },
    {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }
  ),
});
