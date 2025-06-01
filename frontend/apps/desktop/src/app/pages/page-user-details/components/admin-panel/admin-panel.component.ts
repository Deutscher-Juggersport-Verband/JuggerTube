import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { User, UserDataClient, UserShort } from '@frontend/user-data';
import { UserRowComponent } from '../user-row/user-row.component';

@Component({
  selector: 'admin-panel',
  imports: [CommonModule, UserRowComponent],
  standalone: true,
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.less',
})
export class AdminPanelComponent {
  private readonly userDataClient: UserDataClient = inject(UserDataClient);

  @Input() public currentUser!: User;
  public openOverlayId: number | null = null;

  public get privilegedUsers$() {
    return this.userDataClient.getPrivilegedUserShortOverview$();
  }
}
