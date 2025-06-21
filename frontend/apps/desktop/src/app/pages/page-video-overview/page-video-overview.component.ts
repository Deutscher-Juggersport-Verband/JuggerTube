import { CommonModule } from '@angular/common';
import { Component, inject, Signal } from '@angular/core';
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
    CommonModule,
    VideoTileComponent,
    SearchVideoTileComponent,
    RouterLink,
    MatPaginatorModule,
    UiInputComponent,
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
  public currentFilters: VideoFilterOptions = {};
  public currentSort: SortOption = 'upload_date_desc';

  public readonly UiInputTypeEnum = UiInputTypeEnum;
  public readonly sortFormControl = new FormControl('Upload: Neueste zuerst');
  public readonly sortDropdownOptions: string[] = [
    'Name A-Z',
    'Name Z-A',
    'Aufnahme: Neueste zuerst',
    'Aufnahme: Älteste zuerst',
    'Upload: Neueste zuerst',
    'JuggerTube: Neueste zuerst',
  ];

  constructor() {
    this.videosDataService.loadPaginatedVideos(this.startIndex, this.pageSize, {
      sort: this.currentSort,
    });
    this.paginatedVideos = this.videosDataService.paginatedVideos;
    this.totalVideos = this.videosDataService.totalCountVideos;

    this.sortFormControl.valueChanges.subscribe((value) => {
      if (value) {
        const sortValue = this.getSortValueFromLabel(value);
        this.onSortChanged(sortValue);
      }
    });
  }

  public onFiltersChanged(filters: VideoFilterOptions): void {
    const filtersChanged =
      JSON.stringify(this.currentFilters) !== JSON.stringify(filters);

    if (filtersChanged) {
      this.videosDataService.clearVideoCache();
    }

    this.currentFilters = filters;
    if (filters.sort) {
      this.currentSort = filters.sort;
    }

    if (filtersChanged) {
      this.resetToFirstPage();
      this.loadVideosWithCurrentFilters();
    }
  }

  public onSortChanged(sort: SortOption): void {
    // Only clear cache and reload if sort actually changed
    if (this.currentSort !== sort) {
      this.videosDataService.clearVideoCache();

      this.currentSort = sort;
      this.currentFilters = { ...this.currentFilters, sort };
      this.resetToFirstPage();
      this.loadVideosWithCurrentFilters();
    }
  }

  public handlePageEvent(event: PageEvent): void {
    const newPageSize = event.pageSize;
    let targetPageIndex = event.pageIndex;

    if (newPageSize !== this.pageSize) {
      targetPageIndex = Math.floor(this.startIndex / newPageSize);
    }

    const targetStartIndex = targetPageIndex * newPageSize;
    const maxStartIndex =
      Math.max(0, Math.ceil(this.totalVideos() / newPageSize) - 1) *
      newPageSize;

    if (targetStartIndex >= this.totalVideos()) {
      this.navigateToPage(maxStartIndex, newPageSize);
      return;
    }

    this.navigateToPage(targetStartIndex, newPageSize);
  }

  private navigateToPage(startIndex: number, pageSize: number): void {
    this.pageIndex = startIndex / pageSize;
    this.startIndex = startIndex;
    this.pageSize = pageSize;

    if (
      !this.videosDataService.isRangeCached(
        startIndex,
        pageSize,
        this.currentFilters
      )
    ) {
      this.videosDataService.loadNextVideos(
        startIndex,
        pageSize,
        this.currentFilters
      );
    } else {
      this.videosDataService.updateCurrentView(startIndex, pageSize);
    }
  }

  private resetToFirstPage(): void {
    this.startIndex = 0;
    this.pageIndex = 0;
  }

  private loadVideosWithCurrentFilters(): void {
    this.videosDataService.loadPaginatedVideos(
      this.startIndex,
      this.pageSize,
      this.currentFilters
    );
  }

  // Hilfsmethoden für Sortierung
  public getSortValueFromLabel(label: string): SortOption {
    const mapping: Record<string, SortOption> = {
      'Name A-Z': 'name_asc',
      'Name Z-A': 'name_desc',
      'Aufnahme: Neueste zuerst': 'recording_date_desc',
      'Aufnahme: Älteste zuerst': 'recording_date_asc',
      'Upload: Neueste zuerst': 'upload_date_desc',
      'JuggerTube: Neueste zuerst': 'created_at_desc',
    };
    return mapping[label] || 'upload_date_desc';
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
    return mapping[value] || 'Upload: Neueste zuerst';
  }
}
