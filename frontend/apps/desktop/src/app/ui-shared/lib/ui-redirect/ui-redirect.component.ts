
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-redirect',
  imports: [],
  standalone: true,
  templateUrl: './ui-redirect.component.html',
  styleUrl: './ui-redirect.component.less',
})
export class UiRedirectComponent {
  @Input() public text!: string;
}
