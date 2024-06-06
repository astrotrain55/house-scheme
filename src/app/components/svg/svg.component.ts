import { Component } from '@angular/core';
import { SvgHousePorchComponent } from '../svg-house-porch/svg-house-porch.component';
import { SvgLinesOpticalComponent } from '../svg-lines-optical/svg-lines-optical.component';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-svg',
  standalone: true,
  imports: [SvgHousePorchComponent, SvgLinesOpticalComponent],
  templateUrl: './svg.component.svg',
})
export class SvgComponent {
  constructor(private store: StoreService) {}

  get coords() {
    return this.store.coords;
  }
}
