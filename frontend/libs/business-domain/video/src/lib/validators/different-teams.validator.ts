import {AbstractControl, ValidationErrors} from '@angular/forms';

export function differentTeamsValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control.parent;
  if (!formGroup) return null;

  const teamOneId = formGroup.get('teamOneId')?.value;
  const teamTwoId = formGroup.get('teamTwoId')?.value;

  if (teamOneId && teamTwoId && teamOneId === teamTwoId) {
    return {sameTeam: true};
  }

  return null;
}
