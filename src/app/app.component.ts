import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StoreService } from './services/store.service';
import { ControlsComponent } from './components/controls/controls.component';
import { SvgComponent } from './components/svg/svg.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ControlsComponent, SvgComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(private store: StoreService) {
    this.store.initLogScheme();
  }
}
