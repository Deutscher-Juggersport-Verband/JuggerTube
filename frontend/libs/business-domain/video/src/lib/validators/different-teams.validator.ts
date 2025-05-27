import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';

export function differentTeamsValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (!(formGroup instanceof FormGroup)) {
      return null;
    }

    const teamOneControl = formGroup.get('teamOneId');
    const teamTwoControl = formGroup.get('teamTwoId');

    if (!teamOneControl || !teamTwoControl) {
      return null;
    }

    const teamOneId = teamOneControl.value;
    const teamTwoId = teamTwoControl.value;

    // Only validate if both teams have non-zero values
    if (!teamOneId || !teamTwoId || teamOneId === 0 || teamTwoId === 0) {
      return null;
    }

    return teamOneId === teamTwoId ? {sameTeam: true} : null;
  };
}
