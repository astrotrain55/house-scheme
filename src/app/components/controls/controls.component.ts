import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ControlsCreateHouseComponent } from '../controls-create-house/controls-create-house.component';
import { ControlsPorchComponent } from '../controls-porch/controls-porch.component';
import { PopupComponent } from '../ui/popup/popup.component';
import { TabsComponent } from '../ui/tabs/tabs.component';
import { StoreService } from '../../services/store.service';

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
export class ControlsComponent implements OnInit, OnChanges {
  visibleAll: boolean = false;
  debug: boolean = false;
  routingPosition: string = 'bottom';
  directionCalculation: string = 'left';
  boxesPosition: string = 'default';
  modal = {
    show: false,
  };
  tabs = {
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

  ngOnChanges(changes: SimpleChanges): void {
    // visibleAll() {
    //   this.config.house.toggle(this.visibleAll);
    //   this.updateCoords();
    // },
    // debug() {
    //   this.config.house.toggleDebug(this.debug);
    //   this.updateCoords();
    // },
    // routingPosition() {
    //   this.config.house.toggleRoutingPosition(this.routingPosition);
    //   this.updateCoords();
    // },
    // directionCalculation() {
    //   this.config.house.toggleDirection(this.directionCalculation);
    //   this.updateCoords();
    // },
    // boxesPosition() {
    //   this.config.house.toggleBoxesPosition(this.boxesPosition);
    //   this.updateCoords();
    // },
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
}
