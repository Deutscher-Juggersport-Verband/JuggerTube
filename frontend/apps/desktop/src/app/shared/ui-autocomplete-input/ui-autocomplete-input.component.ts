import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {ChannelApiResponseModel} from '@frontend/channel-data';
import { TeamApiResponseModel } from '@frontend/team-data';
import { TournamentApiResponseModel } from '@frontend/tournament-data';

type OptionType = TournamentApiResponseModel | TeamApiResponseModel | ChannelApiResponseModel;
type DisplayFieldType = keyof Pick<OptionType, 'name'>;
type ValueFieldType = keyof Pick<OptionType, 'id'>;

@Component({
  selector: 'ui-autocomplete-input',
  imports: [CommonModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './ui-autocomplete-input.component.html',
  styleUrl: './ui-autocomplete-input.component.less',
})
export class UiAutocompleteInputComponent {
  @Input() public labelText!: string;
  @Input() public formControlElement!: FormControl;
  @Input() public options: OptionType[] = [];
  @Input() public displayField: DisplayFieldType = 'name';
  @Input() public valueField: ValueFieldType = 'id';
  @Input() public placeholder: string = 'Suchen...';
  @Input() public infoButtonHeadline?: string;
  @Input() public infoButtonContent?: string;
  @Output() public newOption = new EventEmitter<string>();

  public filteredOptions: OptionType[] = [];
  public showDropdown = false;
  public searchControl = new FormControl('');
  public hasExactMatch = false;

  constructor() {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
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
    const newValue = this.searchControl.value;
    if (newValue) {
      this.newOption.emit(newValue);
    }
  }
}
