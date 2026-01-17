
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';

import { UiTagComponent } from '../../../../ui-shared';
import { UserDataClient, UserRoleEnum, UserShort } from '@frontend/user-data';

@Component({
  selector: 'user-row',
  imports: [UiTagComponent],
  standalone: true,
  templateUrl: './user-row.component.html',
  styleUrl: './user-row.component.less',
})
export class UserRowComponent {
  private readonly userDataClient: UserDataClient = inject(UserDataClient);

  @Input() public user!: UserShort;
  @Input() public isCurrent: boolean = false;

  @Input() public isOverlayVisible: boolean = false;
  @Output() public overlayToggle = new EventEmitter<void>();

  protected readonly UserRoleEnum = UserRoleEnum;

  public toggleOverlay(): void {
    if (this.isCurrent) {
      return;
    }

    this.overlayToggle.emit();
  }

  public async changeRole(role: UserRoleEnum): Promise<void> {
    await this.userDataClient.updateUserRole$(this.user.id, role);

    this.isOverlayVisible = false;
    this.userDataClient.invalidatePrivilegedUserShortOverviewCache();
  }
}
