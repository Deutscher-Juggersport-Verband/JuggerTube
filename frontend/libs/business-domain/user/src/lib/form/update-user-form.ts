import { FormControl, FormGroup, Validators } from '@angular/forms';

export const updateUserForm = new FormGroup<{
  email: FormControl<string>;
  password: FormControl<string>;
}>({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  }),
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
