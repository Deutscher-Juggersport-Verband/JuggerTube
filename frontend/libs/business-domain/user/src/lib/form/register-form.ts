import { FormControl, FormGroup, Validators } from '@angular/forms';

import { passwordsMatchValidator } from './passworts-match.validator';

export const registerForm = new FormGroup<{
  confirmPassword: FormControl<string>;
  email: FormControl<string>;
  name: FormControl<string>;
  password: FormControl<string>;
  username: FormControl<string>;
}>(
  {
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    name: new FormControl('', { nonNullable: true }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(8)],
    }),
    username: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2)],
    }),
  },
  { validators: passwordsMatchValidator }
);
