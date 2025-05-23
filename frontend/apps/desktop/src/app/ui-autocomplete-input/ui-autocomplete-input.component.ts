import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import { UiLabelRowComponent } from '../ui-label-row/ui-label-row.component';
import { TeamApiResponseModel } from '@frontend/team-data';
import { TournamentApiResponseModel } from '@frontend/tournament-data';

type OptionType = TournamentApiResponseModel | TeamApiResponseModel;
type DisplayFieldType = keyof Pick<OptionType, 'name'>;
type ValueFieldType = keyof Pick<OptionType, 'id'>;

@Component({
  selector: 'ui-autocomplete-input',
  imports: [CommonModule, ReactiveFormsModule, UiLabelRowComponent],
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
  @Output() public onNewOption = new EventEmitter<string>();

  public filteredOptions: OptionType[] = [];
  public showDropdown = false;
  public searchControl = new FormControl('');

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
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    this.filteredOptions = this.options.filter((option) =>
      option[this.displayField].toLowerCase().includes(searchTermLower)
    );
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
      this.onNewOption.emit(newValue);
    }
  }
}
