
import { Component, HostBinding, Input } from '@angular/core';

@Component({
  selector: 'ui-tag',
  imports: [],
  templateUrl: './ui-tag.component.html',
  styleUrl: './ui-tag.component.less',
  standalone: true,
})
export class UiTagComponent {
  @Input() public category!: string;

  @HostBinding('class')
  private get hostClass(): string {
    return this.category;
  }
}
