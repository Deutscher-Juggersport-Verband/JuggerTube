import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'details-toggle',
  templateUrl: './details-toggle.component.html',
  styleUrl: './details-toggle.component.less',
})
export class DetailsToggleComponent {
  public readonly heading = input.required<string>();

  public readonly showDetails = signal<boolean>(false);

  public toggle(): void {
    this.showDetails.update((current) => !current);
  }
}
