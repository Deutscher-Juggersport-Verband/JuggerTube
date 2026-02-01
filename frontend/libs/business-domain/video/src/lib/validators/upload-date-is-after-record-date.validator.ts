import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';

import { VideoFormModelFieldsEnum } from '@frontend/video-data';

export function uploadDateIsAfterRecordDateValidator(): ValidatorFn {
  return (formGroup: AbstractControl): ValidationErrors | null => {
    if (!(formGroup instanceof FormGroup)) {
      return null;
    }

    const uploadDateControl = formGroup.get(VideoFormModelFieldsEnum.UPLOAD_DATE);
    const dateOfRecordingControl = formGroup.get(VideoFormModelFieldsEnum.DATE_OF_RECORDING);

    if (!uploadDateControl || !dateOfRecordingControl) {
      return null;
    }

    const uploadDate = uploadDateControl.value;
    const dateOfRecording = dateOfRecordingControl.value;

    // Only validate if both teams have non-zero values
    if (!uploadDate || !dateOfRecording) {
      return null;
    }

    return uploadDate < dateOfRecording ? { uploadDateIsBeforeRecordDate: true } : null;
  };
}