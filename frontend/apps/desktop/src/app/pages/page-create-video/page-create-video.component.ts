import { CommonModule } from '@angular/common';
import {Component, OnInit, Signal} from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router } from '@angular/router';

import { UiAutocompleteInputComponent } from '../../ui-autocomplete-input/ui-autocomplete-input.component';
import {
  UiButtonColorEnum,
  UiButtonComponent,
} from '../../ui-button/ui-button.component';
import {
  UiInputComponent,
  UiInputDirectionEnum,
  UiInputTypeEnum,
} from '../../ui-input/ui-input.component';
import { UiLabelRowComponent } from '../../ui-label-row/ui-label-row.component';
import {TeamsDataService} from '@frontend/team';
import {TeamApiResponseModel} from '@frontend/team-data';
import {TournamentsDataService} from '@frontend/tournament';
import {TournamentApiResponseModel} from '@frontend/tournament-data';
import {
  AdditionalFieldsEnum, VideoFormModel,
  VideoFormService
} from '@frontend/video';
import {
  GameSystemTypesEnum,
  VideoCategoriesEnum,
  WeaponTypesEnum,
} from '@frontend/video-data';

@Component({
  imports: [
    CommonModule,
    FormsModule,
    UiButtonComponent,
    UiInputComponent,
    UiAutocompleteInputComponent,
    UiLabelRowComponent,
    ReactiveFormsModule,
  ],
  standalone: true,
  templateUrl: './page-create-video.component.html',
  styleUrl: './page-create-video.component.less',
})
export class PageCreateVideoComponent implements OnInit {
  public teams: Signal<TeamApiResponseModel[]  | undefined>;
  public tournaments: Signal<TournamentApiResponseModel[]  | undefined>;

  protected readonly form: FormGroup<VideoFormModel>;
  protected additionalFields: AdditionalFieldsEnum[] = [];
  protected showNewTournamentFields = false;

  protected readonly UiButtonColorEnum = UiButtonColorEnum;
  protected readonly UiInputTypeEnum = UiInputTypeEnum;
  protected readonly UiInputDirectionEnum = UiInputDirectionEnum;
  protected readonly Object = Object;
  protected readonly VideoCategoriesEnum = VideoCategoriesEnum;
  protected readonly WeaponTypesEnum = WeaponTypesEnum;
  protected readonly GameSystemTypesEnum = GameSystemTypesEnum;

  constructor(
    private router: Router,
    private tournamentService: TournamentsDataService,
    private teamService: TeamsDataService,
    private readonly videoFormService: VideoFormService,
  ) {
    this.teams = this.teamService.getTeams();
    this.tournaments = this.tournamentService.getTournaments();
    this.form = this.videoFormService.create();
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
    this.showNewTournamentFields = true;
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

  protected readonly AdditionalFieldsEnum = AdditionalFieldsEnum;
}
