import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormControl,FormGroup, ReactiveFormsModule } from '@angular/forms';

import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

import {
  UiButtonComponent,
  UiInputComponent,
  UiButtonTypeEnum,
  UiButtonColorEnum,
  UiInputTypeEnum
} from '../../../../ui-shared';
import { VideoCategoriesEnum,VideoFilterOptions } from '@frontend/video-data';

@Component({
  selector: 'search-video-tile',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiInputComponent,
    UiButtonComponent,
  ],
  standalone: true,
  templateUrl: './search-video-tile.component.html',
  styleUrl: './search-video-tile.component.less',
})
export class SearchVideoTileComponent {
  @Output() public filtersChanged = new EventEmitter<VideoFilterOptions>();

  public readonly filterForm: FormGroup;
  public readonly UiInputTypeEnum = UiInputTypeEnum;
  protected readonly UiButtonTypeEnum = UiButtonTypeEnum;
  protected readonly UiButtonColorEnum = UiButtonColorEnum;

  public isExpandedFiltersVisible = false;

  public readonly categoryDropdownOptions: string[] = [
    'Alle Kategorien',
    'Match',
    'Highlights',
    'Reports',
    'Podcast',
    'Training',
    'Awards',
    'Song',
    'Sparbuilding',
    'Andere',
  ];

  public getCategoryValueFromLabel(label: string): VideoCategoriesEnum | '' {
    if (label === 'Alle Kategorien') return '';
    const mapping: Record<string, VideoCategoriesEnum> = {
      Match: VideoCategoriesEnum.MATCH,
      Highlights: VideoCategoriesEnum.HIGHLIGHTS,
      Reports: VideoCategoriesEnum.REPORTS,
      Podcast: VideoCategoriesEnum.PODCAST,
      Training: VideoCategoriesEnum.TRAINING,
      Awards: VideoCategoriesEnum.AWARDS,
      Song: VideoCategoriesEnum.SONG,
      Sparbuilding: VideoCategoriesEnum.SPARBUILDING,
      Andere: VideoCategoriesEnum.OTHER,
    };
    return mapping[label] || '';
  }

  constructor(private readonly fb: FormBuilder) {
    this.filterForm = this.fb.group({
      nameFilter: new FormControl(''),
      category: new FormControl('Alle Kategorien'),
      channelName: new FormControl(''),
      teamName: new FormControl(''),
      tournamentName: new FormControl(''),
      recordingDateFrom: new FormControl(''),
      recordingDateTo: new FormControl(''),
      uploadDateFrom: new FormControl(''),
      uploadDateTo: new FormControl(''),
    });

    this.filterForm.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(() => {
        this.onFiltersChange();
      });
  }

  public getFormControl(controlName: string): FormControl {
    return this.filterForm.get(controlName) as FormControl;
  }

  public onFiltersChange(): void {
    const formValue = this.filterForm.value;
    const filters: VideoFilterOptions = {};

    if (formValue.nameFilter) filters.nameFilter = formValue.nameFilter;

    const categoryValue = this.getCategoryValueFromLabel(formValue.category);
    if (categoryValue) filters.category = categoryValue;

    if (formValue.channelName) filters.channelName = formValue.channelName;
    if (formValue.teamName) filters.teamName = formValue.teamName;
    if (formValue.tournamentName)
      filters.tournamentName = formValue.tournamentName;
    if (formValue.recordingDateFrom) {
      filters.recordingDateFrom = formValue.recordingDateFrom;
    }
    if (formValue.recordingDateTo) {
      filters.recordingDateTo = formValue.recordingDateTo;
    }
    if (formValue.uploadDateFrom) {
      filters.uploadDateFrom = formValue.uploadDateFrom;
    }
    if (formValue.uploadDateTo) {
      filters.uploadDateTo = formValue.uploadDateTo;
    }

    this.filtersChanged.emit(filters);
  }

  public clearFilters(): void {
    this.filterForm.reset({
      category: 'Alle Kategorien',
    });
  }

  public toggleExpandedFilters(): void {
    this.isExpandedFiltersVisible = !this.isExpandedFiltersVisible;
  }
}
