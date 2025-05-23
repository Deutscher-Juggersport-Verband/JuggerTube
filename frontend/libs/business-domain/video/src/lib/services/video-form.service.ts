import {Injectable} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

import {differentTeamsValidator} from '../validators/different-teams.validator';
import {GameSystemTypesEnum, VideoCategoriesEnum, WeaponTypesEnum} from '@frontend/video-data';

export enum AdditionalFieldsEnum {
  GAME_SYSTEM = 'gameSystem',
  WEAPON_TYPE = 'weaponType',
  TOPIC = 'topic',
  GUESTS = 'guests',
  TEAMS = 'teams',
  TOURNAMENT = 'tournament',
}

export type VideoFormModel = {
  name: FormControl<string>;
  videoLink: FormControl<string>;
  channelLink: FormControl<string>;
  category: FormControl<VideoCategoriesEnum | null>;
  uploadDate: FormControl<string>;
  dateOfRecording: FormControl<string>;
  topic: FormControl<string>;
  guests: FormControl<string>;
  weaponType: FormControl<WeaponTypesEnum | null>;
  gameSystem: FormControl<GameSystemTypesEnum | null>;
  tournamentId: FormControl<number>;
  teamOneId: FormControl<number>;
  teamTwoId: FormControl<number>;
  comment: FormControl<string>;
  tournamentCity: FormControl<string>;
  tournamentStartDate: FormControl<string>;
  tournamentEndDate: FormControl<string>;
  tournamentAddress: FormControl<string>;
}

@Injectable({ providedIn: 'root' })
export class VideoFormService {
  public create(): FormGroup {
    return new FormGroup<VideoFormModel>({
      name: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required, Validators.email],
      }),
      videoLink: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      channelLink: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      category: new FormControl({ value: null, disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      uploadDate: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      dateOfRecording: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      topic: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      guests: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      weaponType: new FormControl({ value: null, disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      gameSystem: new FormControl({ value: null, disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tournamentId: new FormControl({ value: 0, disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      teamOneId: new FormControl({ value: 0, disabled: false }, {
        nonNullable: true,
        validators: [Validators.required, differentTeamsValidator],
      }),
      teamTwoId: new FormControl({ value: 0, disabled: false }, {
        nonNullable: true,
        validators: [Validators.required, differentTeamsValidator],
      }),
      comment: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tournamentCity: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tournamentStartDate: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tournamentEndDate: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
      tournamentAddress: new FormControl({ value: '', disabled: false }, {
        nonNullable: true,
        validators: [Validators.required],
      }),
    });
  }
}
