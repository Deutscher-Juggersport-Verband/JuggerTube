
import { Component, inject, Signal, signal, WritableSignal } from '@angular/core';
import { FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { UiInputComponent, UiInputTypeEnum } from '../../ui-shared';
import { SearchVideoTileComponent } from './components/search-video-tile/search-video-tile.component';
import { VideoTileComponent } from './components/video-tile/video-tile.component';
import { VideosDataService } from '@frontend/video';
import {
  SortOption,
  VideoApiResponseModel,
  VideoFilterOptions,
} from '@frontend/video-data';

@Component({
  imports: [
    VideoTileComponent,
    SearchVideoTileComponent,
    RouterLink,
    MatPaginatorModule,
    UiInputComponent
],
  standalone: true,
  templateUrl: './page-video-overview.component.html',
  styleUrl: './page-video-overview.component.less',
})
export class PageVideoOverviewComponent {
  private readonly videosDataService: VideosDataService =
    inject(VideosDataService);

  public readonly paginatedVideos: Signal<VideoApiResponseModel[]>;
  public readonly totalVideos: Signal<number>;
  public readonly pageSizeOptions = [5, 10, 25, 50];
  public pageSize = 20;
  public startIndex = 0;
  public pageIndex = 0;
  public currentFilters: WritableSignal<VideoFilterOptions> = signal({
    sort: 'upload_date_desc',
  });

  public readonly UiInputTypeEnum = UiInputTypeEnum;
  public readonly sortFormControl = new FormControl('Upload: Neueste zuerst');
  public readonly sortDropdownOptions = [
    { value: 'Name A-Z', name: 'Name A-Z' },
    { value: 'Name Z-A', name: 'Name Z-A' },
    { value: 'Aufnahme: Neueste zuerst', name: 'Aufnahme: Neueste zuerst' },
    { value: 'Aufnahme: Älteste zuerst', name: 'Aufnahme: Älteste zuerst' },
    { value: 'Upload: Neueste zuerst', name: 'Upload: Neueste zuerst' },
    { value: 'JuggerTube: Neueste zuerst', name: 'JuggerTube: Neueste zuerst' },
  ];

  private readonly STORAGE_KEY_SORT = 'jt.videoOverview.sort';

  constructor() {
    const persistedSort = this.loadSortFromSession();
    if (persistedSort) {
      this.currentFilters.set({ ...this.currentFilters(), sort: persistedSort });
      this.sortFormControl.setValue(
        this.getSortLabelFromValue(persistedSort),
        { emitEvent: false },
      );
    }

    this.onLoadNewVideos();
    this.paginatedVideos = this.videosDataService.paginatedVideos;
    this.totalVideos = this.videosDataService.totalCountVideos;

    this.sortFormControl.valueChanges.subscribe((value) => {
      if (value) {
        const sortValue = this.getSortValueFromLabel(value);
        this.onSortChanged(sortValue);
      }
    });
  }

  public onLoadNewVideos(
    start: number = this.startIndex,
    limit: number = this.pageSize,
  ): void {
    this.videosDataService.loadPaginatedVideos(start, limit, this.currentFilters());;
  }

  private resetToFirstPage(): void {
    this.startIndex = 0;
    this.pageIndex = 0;
  }

  public onSortChanged(sort: SortOption): void {
    if (this.currentFilters().sort !== sort) {
      this.videosDataService.clearVideoCache();

      this.currentFilters.set({ ...this.currentFilters(), sort });
      this.saveSortToSession(sort);
      this.resetToFirstPage();
      this.onLoadNewVideos(this.startIndex, this.pageSize);
    }
  }

  public onFiltersChanged(filters: VideoFilterOptions): void {
    const filtersChanged =
      JSON.stringify(this.currentFilters) !== JSON.stringify(filters);

    const currentSort = this.currentFilters().sort;

    this.currentFilters.set({ ...filters, sort: currentSort });

    if (filtersChanged) {
      this.videosDataService.clearVideoCache();
      this.resetToFirstPage();
      this.onLoadNewVideos(this.startIndex, this.pageSize);
    }
  }

  public handlePageEvent(event: PageEvent): void {
    const newPageSize = event.pageSize;
    let targetPageIndex = event.pageIndex;

    if (newPageSize !== this.pageSize) {
      targetPageIndex = Math.floor(this.startIndex / newPageSize);
    }

    const targetStartIndex = targetPageIndex * newPageSize;

    this.pageSize = newPageSize;
    this.pageIndex = targetPageIndex;
    
    this.startIndex = targetStartIndex;
    this.onLoadNewVideos(targetStartIndex, newPageSize);
  }

  public getSortValueFromLabel(label: string): SortOption {
    const mapping: Record<string, SortOption> = {
      'Name A-Z': 'name_asc',
      'Name Z-A': 'name_desc',
      'Aufnahme: Neueste zuerst': 'recording_date_desc',
      'Aufnahme: Älteste zuerst': 'recording_date_asc',
      'Upload: Neueste zuerst': 'upload_date_desc',
      'JuggerTube: Neueste zuerst': 'created_at_desc',
    };
    return mapping[label] ?? 'upload_date_desc';
  }

  public getSortLabelFromValue(value: SortOption): string {
    const mapping: Record<SortOption, string> = {
      name_asc: 'Name A-Z',
      name_desc: 'Name Z-A',
      recording_date_desc: 'Aufnahme: Neueste zuerst',
      recording_date_asc: 'Aufnahme: Älteste zuerst',
      upload_date_desc: 'Upload: Neueste zuerst',
      created_at_desc: 'JuggerTube: Neueste zuerst',
    };
    return mapping[value] ?? 'Upload: Neueste zuerst';
  }

  private saveSortToSession(sort: SortOption): void {
    try {
      sessionStorage.setItem(this.STORAGE_KEY_SORT, sort);
    } catch (err) {
      console.debug('sessionStorage unavailable', err);
    }
  }

  private loadSortFromSession(): SortOption | null {
    try {
      const raw = sessionStorage.getItem(this.STORAGE_KEY_SORT);
      return (raw as SortOption) || null;
    } catch {
      return null;
    }
  }
}
