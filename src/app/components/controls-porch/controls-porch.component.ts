import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CounterComponent } from '../ui/counter/counter.component';
import { StoreService } from '../../services/store.service';
import type { IFloor, IPorch } from '../../../types';

@Component({
  selector: 'app-controls-porch',
  standalone: true,
  imports: [CounterComponent, FormsModule],
  templateUrl: './controls-porch.component.html',
  styleUrl: './controls-porch.component.scss',
})
export class ControlsPorchComponent implements OnInit, OnChanges {
  @Input({ required: true }) public porch: IPorch;
  public offset: number = 0;
  public visible: boolean = true;
  public risers: any[] = [];
  public changeAllPorches: boolean = true;

  constructor(private store: StoreService) {}

  ngOnInit(): void {
    this.offset = this.porch.offset;
    this.visible = this.porch.visible;
    this.porch.risers.list.forEach((riser) => {
      this.risers.push(riser);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // offset() {
    //   this.porch.changeOffset(this.offset);
    //   this.updateCoords();
    // },
    // visible() {
    //   this.porch.toggle();
    //   this.updateCoords();
    // },
  }

  toggleVisibleFloor(floor: IFloor) {
    if (this.changeAllPorches) {
      const floors = this.getAllFloors(floor);
      floors.forEach((floor) => {
        floor.toggle();
      });
    } else floor.toggle();
    this.store.updateCoords();
  }

  toggleEntityFloor(floor: IFloor) {
    if (this.changeAllPorches) {
      const floors = this.getAllFloors(floor);
      console.log(floors);
      floors.forEach((floor) => {
        floor.toggleEntity();
      });
    } else floor.toggleEntity();
    this.store.updateCoords();
  }

  setApptFloor(floor: IFloor, count: number) {
    if (this.changeAllPorches) {
      const floors = this.getAllFloors(floor);
      floors.forEach((floor) => {
        floor.setAppt(count);
      });
    } else floor.setAppt(count);
    this.store.updateCoords();
  }

  changeRise(index: number) {
    const riser = this.risers[index];

    if (this.changeAllPorches) {
      this.store.porches.forEach((porch) => {
        porch.risers.changeRise(index, {
          internet: riser.internet,
          ktv: riser.ktv,
          ktvCount: riser.ktvCount,
        });
      });
    } else {
      this.porch.risers.changeRise(index, {
        internet: riser.internet,
        ktv: riser.ktv,
        ktvCount: riser.ktvCount,
      });
    }
    this.store.updateCoords();
  }

  getAllFloors(floor: IFloor) {
    const floorIndex = floor.porch.floors.findIndex((f) => f === floor);
    const floors = this.store.porches.map((porch) => porch.floors[floorIndex]);
    console.log(floors);
    return floors;
  }
}
