import { v4 as uuid } from 'uuid';
import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CounterComponent } from '../ui/counter/counter.component';
import { StoreService } from '../../services/store.service';

interface IScheme {
  porchesCount: number;
  floorsCount: number;
  apptCount: number;
  boxPorch: number;
  boxFloor: number;
}

@Component({
  selector: 'app-controls-create-house',
  standalone: true,
  imports: [CounterComponent],
  templateUrl: './controls-create-house.component.html',
  styleUrl: './controls-create-house.component.scss',
})
export class ControlsCreateHouseComponent implements OnChanges {
  public scheme: IScheme = {
    porchesCount: 6,
    floorsCount: 9,
    apptCount: 216,
    boxPorch: 2,
    boxFloor: 9,
  };

  constructor(private store: StoreService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // 'scheme.porchesCount': (value) => {
    //   if (this.scheme.boxPorch > value) this.scheme.boxPorch = value;
    // }
    //
    // 'scheme.floorsCount': (value) => {
    //   if (this.scheme.boxFloor > value) this.scheme.boxFloor = value;
    // }
  }

  createDefaultScheme() {
    this.store.createDefaultScheme();
  }

  submit() {
    const porches = [];

    for (let i = 0; i < this.scheme.porchesCount; i += 1) {
      porches.push({
        UF_XML_ID: uuid(),
        UF_NUMBER: String(i + 1),
        UF_UPPER: '1',
        UF_LOFT: '',
        UF_TECH: '1',
        UF_GROUND: '',
        UF_BASEMENT: '1',
      });
    }

    this.store.createScheme({
      house: {
        UF_XML_ID: uuid(),
        UF_APT_NUMBERS: [],
        UF_APPT_NUM: String(this.scheme.apptCount),
        UF_FLOORS: String(this.scheme.floorsCount),
        UF_PODJEZD_NUM: String(this.scheme.porchesCount),
      },
      box: {
        UF_XML_ID: uuid(),
        UF_PORCH_ID: porches[this.scheme.boxPorch - 1].UF_XML_ID,
        UF_BOX_PLACEMENT: String(this.scheme.boxFloor),
        UF_BOX_TYPE: 'Оптический ящик 3',
      },
      porches,
    });
  }
}
