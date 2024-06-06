import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsCreateHouseComponent } from '../controls-create-house/controls-create-house.component';
import { ControlsPorchComponent } from '../controls-porch/controls-porch.component';
import { PopupComponent } from '../ui/popup/popup.component';
import { TabsComponent } from '../ui/tabs/tabs.component';
import { StoreService } from '../../services/store.service';
import type {
  HouseBoxesPosition,
  HouseDirection,
  HouseRoutingPosition,
} from '../../../types';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [
    FormsModule,
    ControlsCreateHouseComponent,
    ControlsPorchComponent,
    PopupComponent,
    TabsComponent,
  ],
  templateUrl: './controls.component.html',
})
export class ControlsComponent implements OnInit {
  public visibleAll: boolean = false;
  public debug: boolean = false;
  public routingPosition: HouseRoutingPosition = 'bottom';
  public directionCalculation: HouseDirection = 'left';
  public boxesPosition: HouseBoxesPosition = 'default';
  public modal = {
    show: false,
  };
  public tabs = {
    show: 0,
  };

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.debug = this.store.config.house.debug;
    this.visibleAll = this.store.config.house.visibleAll;
    this.routingPosition = this.store.config.house.routingPosition;
    this.directionCalculation = this.store.config.house.directionCalculation;
    this.boxesPosition = this.store.config.house.boxesPosition;
  }

  autoBoxes() {
    this.store.autoBoxes();
  }

  get porches() {
    return this.store.config.porches;
  }

  get names() {
    return this.porches.map((porch) => porch.name);
  }

  onVisibleAll() {
    this.store.config.house.toggle(this.visibleAll);
    this.store.updateCoords();
  }

  onDebug() {
    this.store.config.house.toggleDebug(this.debug);
    this.store.updateCoords();
  }

  onRoutingPosition() {
    this.store.config.house.toggleRoutingPosition(this.routingPosition);
    this.store.updateCoords();
  }

  onDirectionCalculation() {
    this.store.config.house.toggleDirection(this.directionCalculation);
    this.store.updateCoords();
  }

  onBoxesPosition() {
    this.store.config.house.toggleBoxesPosition(this.boxesPosition);
    this.store.updateCoords();
  }
}
