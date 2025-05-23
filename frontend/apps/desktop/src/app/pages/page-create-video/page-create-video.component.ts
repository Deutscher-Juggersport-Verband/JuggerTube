import { CommonModule } from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';
import { Router } from '@angular/router';

import {
  UiButtonColorEnum,
  UiButtonComponent,
} from '../../ui-button/ui-button.component';
import {
  UiInputComponent,
  UiInputDirectionEnum,
  UiInputTypeEnum,
} from '../../ui-input/ui-input.component';
import { UiAutocompleteInputComponent } from '../../ui-autocomplete-input/ui-autocomplete-input.component';
import {TeamsDataService} from '@frontend/team';
import {TeamApiResponseModel} from '@frontend/team-data';
import {TournamentsDataService} from '@frontend/tournament';
import {TournamentApiResponseModel} from '@frontend/tournament-data';
import {
  GameSystemTypesEnum,
  VideoCategoriesEnum,
  WeaponTypesEnum,
} from '@frontend/video-data';

function differentTeamsValidator(control: AbstractControl): ValidationErrors | null {
  const formGroup = control.parent;
  if (!formGroup) return null;

  const teamOneId = formGroup.get('teamOneId')?.value;
  const teamTwoId = formGroup.get('teamTwoId')?.value;

  if (teamOneId && teamTwoId && teamOneId === teamTwoId) {
    return { sameTeam: true };
  }

  return null;
}

export const createVideoForm = new FormGroup<{
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
}>({
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
});

export enum AdditionalFieldsEnum {
  GAME_SYSTEM = 'gameSystem',
  WEAPON_TYPE = 'weaponType',
  TOPIC = 'topic',
  GUESTS = 'guests',
  TEAMS = 'teams',
  TOURNAMENT = 'tournament',
}

@Component({
  imports: [
    CommonModule,
    FormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiAutocompleteInputComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './page-create-video.component.html',
  styleUrl: './page-create-video.component.less',
})
export class PageCreateVideoComponent implements OnInit {
  public teams: Signal<TeamApiResponseModel[]  | undefined>;
  public tournaments: Signal<TournamentApiResponseModel[]  | undefined>;

  protected readonly form = createVideoForm;
  protected additionalFields: AdditionalFieldsEnum[] = [];

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;
  protected readonly UiInputDirectionEnum = UiInputDirectionEnum;
  protected readonly AdditionalFieldsEnum = AdditionalFieldsEnum;
  protected readonly Object = Object;
  protected readonly VideoCategoriesEnum = VideoCategoriesEnum;
  protected readonly WeaponTypesEnum = WeaponTypesEnum;
  protected readonly GameSystemTypesEnum = GameSystemTypesEnum;

  constructor(
    private router: Router,
    private tournamentService: TournamentsDataService,
    private teamService: TeamsDataService
  ) {
    this.teams = this.teamService.getTeams()
    this.tournaments = this.tournamentService.getTournaments()
  }

  public ngOnInit() {
    this.form.controls.category.valueChanges.subscribe(
      (value: VideoCategoriesEnum | null) => {
        if (!value) {
          this.additionalFields = [];
          return;
        }

        switch (value) {
          case VideoCategoriesEnum.REPORTS:
            this.additionalFields = [AdditionalFieldsEnum.TOPIC];
            break;
          case VideoCategoriesEnum.HIGHLIGHTS:
            this.additionalFields = [
              AdditionalFieldsEnum.TOPIC,
              AdditionalFieldsEnum.GUESTS,
              AdditionalFieldsEnum.TOURNAMENT,
            ];
            break;
          case VideoCategoriesEnum.SPARBUILDING:
            this.additionalFields = [
              AdditionalFieldsEnum.WEAPON_TYPE,
              AdditionalFieldsEnum.TOPIC,
              AdditionalFieldsEnum.GUESTS,
            ];
            break;
          case VideoCategoriesEnum.MATCH:
            this.additionalFields = [
              AdditionalFieldsEnum.TOURNAMENT,
              AdditionalFieldsEnum.GAME_SYSTEM,
              AdditionalFieldsEnum.TEAMS,
            ];
            break;
          case VideoCategoriesEnum.OTHER:
          case VideoCategoriesEnum.PODCAST:
            this.additionalFields = [
              AdditionalFieldsEnum.TOPIC,
              AdditionalFieldsEnum.GUESTS,
            ];
            break;
          case VideoCategoriesEnum.TRAINING:
            this.additionalFields = [
              AdditionalFieldsEnum.GAME_SYSTEM,
              AdditionalFieldsEnum.WEAPON_TYPE,
              AdditionalFieldsEnum.TOPIC,
            ];
            break;
          case VideoCategoriesEnum.AWARDS:
            this.additionalFields = [AdditionalFieldsEnum.TOURNAMENT];
            break;
          default:
            this.additionalFields = [];
        }
      }
    );
  }

  public onSubmit(): void {
    if (!this.form.valid) {
      this.markAllFieldsAsTouched();
      return;
    }

    //this.videoService.create(this.form.value);

    this.form.reset();

    this.router.navigate(['/']);
  }

  private markAllFieldsAsTouched(): void {
    Object.keys(this.form.controls).forEach((field) => {
      const control = this.form.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });
      }
    });
  }

  public onNewTournament(name: string): void {
    // Hier können wir später die Logik für neue Turniere implementieren
    console.log('Neues Turnier:', name);
  }

  public onNewTeam(name: string): void {
    // Prüfe, ob das Team bereits in einem der beiden Felder existiert
    const existingTeam = this.teams()?.find(team => team.name.toLowerCase() === name.toLowerCase());
    if (existingTeam) {
      const teamOneId = this.form.controls.teamOneId.value;
      const teamTwoId = this.form.controls.teamTwoId.value;

      if (teamOneId === existingTeam.id || teamTwoId === existingTeam.id) {
        console.warn('Dieses Team wurde bereits ausgewählt');
        return;
      }
    }

    // Hier können wir später die Logik für neue Teams implementieren
    console.log('Neues Team:', name);
  }
}
