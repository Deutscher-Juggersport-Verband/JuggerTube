
import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UiInfoButtonComponent } from '../ui-info-button/ui-info-button.component';
import {
  UiInputComponent,
  UiInputDirectionEnum,
} from '../ui-input/ui-input.component';
import { NewOptionConfig, NewOptionFieldConfig } from './new-option-config';
import { ChannelApiResponseModel } from '@frontend/channel-data';
import { TeamApiResponseModel } from '@frontend/team-data';
import { TournamentApiResponseModel } from '@frontend/tournament-data';

type OptionType =
  | TournamentApiResponseModel
  | TeamApiResponseModel
  | ChannelApiResponseModel;
type DisplayFieldType = keyof Pick<OptionType, 'name'>;
type ValueFieldType = keyof Pick<OptionType, 'id'>;

@Component({
  selector: 'ui-autocomplete-input',
  imports: [
    ReactiveFormsModule,
    UiInfoButtonComponent,
    UiInputComponent
],
  standalone: true,
  templateUrl: './ui-autocomplete-input.component.html',
  styleUrl: './ui-autocomplete-input.component.less',
})
export class UiAutocompleteInputComponent implements OnInit {
  private readonly cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
  private readonly destroyRef$: DestroyRef = inject(DestroyRef);

  @Input() public formControlElement!: FormControl;
  @Input() public options: OptionType[] = [];
  @Input() public displayField: DisplayFieldType = 'name';
  @Input() public valueField: ValueFieldType = 'id';
  @Input() public placeholder: string = 'Suchen...';

  @Input() public labelText?: string;
  @Input() public direction: UiInputDirectionEnum = UiInputDirectionEnum.COLUMN;

  @Input() public infoButtonHeadline?: string;
  @Input() public infoButtonContent?: string;

  @Input() public newOptionConfig?: NewOptionConfig;
  public showNewFields: boolean = false;

  public filteredOptions: OptionType[] = [];
  public showDropdown = false;
  public searchControl = new FormControl('');
  public hasExactMatch = false;

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef$)
      )
      .subscribe((value) => {
        this.filterOptions(value);
      });
  }

  private filterOptions(searchTerm: string | null): void {
    if (!searchTerm) {
      this.filteredOptions = this.options;
      this.hasExactMatch = false;
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const exactMatchCaseInsensitive = this.options.find(
      (option) => option[this.displayField].toLowerCase() === searchTermLower
    );
    const exactMatchCaseSensitive = this.options.find(
      (option) => option[this.displayField] === searchTerm
    );

    if (exactMatchCaseInsensitive) {
      this.filteredOptions = [exactMatchCaseInsensitive];
      this.hasExactMatch = true;
    } else {
      this.filteredOptions = this.options.filter((option) =>
        option[this.displayField].toLowerCase().includes(searchTermLower)
      );
      this.hasExactMatch = false;
    }

    // Wenn es einen case-sensitiven Match gibt, aber keinen case-insensitiven,
    // dann haben wir einen exakten Match mit unterschiedlicher Groß-/Kleinschreibung
    if (exactMatchCaseSensitive && !exactMatchCaseInsensitive) {
      this.hasExactMatch = true;
    }
  }

  public onOptionSelect(option: OptionType): void {
    this.formControlElement.setValue(option[this.valueField]);
    this.searchControl.setValue(option[this.displayField]);
    this.showDropdown = false;
    this.showNewFields = false;
    this.newOptionConfig?.fields.map((field: NewOptionFieldConfig) =>
      field.formControlElement.reset()
    );
  }

  public onInputFocus(): void {
    this.showDropdown = true;
    this.filteredOptions = this.options;
  }

  public onInputBlur(): void {
    setTimeout(() => {
      this.showDropdown = false;
    }, 200);
  }

  public onAddNewOption(): void {
    this.formControlElement.setErrors([]);
    this.formControlElement.markAsPristine();
    this.formControlElement.markAsUntouched();
    this.showNewFields = true;
    this.newOptionConfig?.fields.map((field: NewOptionFieldConfig) =>
      field.formControlElement.reset()
    );
    this.newOptionConfig?.prefillField?.setValue(this.searchControl.value);
    this.cdr.detectChanges();
  }
}
