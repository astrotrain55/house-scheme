<template>
  <div>
    <div v-if="risers.length">
      <div>Количество квартир: {{ porch.appt }}</div>
      <div>
        <label>
          <input type="checkbox" v-model="visible">
          <span>Показать подъезд</span>
        </label>
      </div>
      <div>
        <label :title="`Сдвиг ${offset}`">
          <input type="range" min="-2" max="2" step="0.5" v-model.number="offset">
        </label>
      </div>
      <div style="display: flex;column-gap: 20px;">
        <div v-for="(rise, index) in risers" :key="index" style="display: flex;flex-direction: column;align-items: flex-start;">
          <span>Стояк {{ index + 1 }}</span>
          <label>
            <input
              type="checkbox"
              v-model="rise.internet"
              @change="changeRise(index)"
            >
            <span>Интернет</span>
          </label>
          <div>
            <label>
              <input
                type="checkbox"
                v-model="rise.ktv"
                @change="changeRise(index)"
              >
              <span>КТВ</span>
            </label>
            <input
              v-if="rise.ktv"
              type="text"
              v-model.number="rise.ktvCount"
              @change="changeRise(index)"
              style="width: 25px;"
            >
          </div>
        </div>
      </div>
      <table class="table-porch">
        <thead>
          <tr>
            <th>Этаж</th>
            <th>Видимость</th>
            <th>Нежилое</th>
            <th>Квартиры</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="floor in porch.floors" :key="floor.id">
            <td>{{ floor.name }}</td>
            <td :title="floor.boxes.length ? 'Этаж с ящиками' : ''">
              <input
                type="checkbox"
                :checked="floor.visible"
                :disabled="Boolean(floor.boxes.length)"
                @change="toggleVisibleFloor(floor)"
              >
            </td>
            <td>
              <input
                v-if="floor.type === 'default'"
                type="checkbox"
                :checked="floor.entity"
                @change="toggleEntityFloor(floor)"
              >
            </td>
            <td>
              <control-counter
                v-if="floor.type === 'default'"
                :default-value="floor.appt"
                @change="setApptFloor(floor, $event)"
              ></control-counter>
            </td>
          </tr>
        </tbody>
      </table>
      <div>
        <label>
          <input type="checkbox" v-model="changeAllPorches">
          <span>Применить на все подъезды</span>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useRootStore } from '@/stores/RootStore';
import ControlCounter from './fragments/ControlCounter.vue';

export default {
  methods: {
    ...mapActions(useRootStore, ['updateCoords']),

    toggleVisibleFloor(floor) {
      if (this.changeAllPorches) {
        const floors = this.getAllFloors(floor);
        floors.forEach((floor) => {
          floor.toggle();
        });
      } else floor.toggle();
      this.updateCoords();
    },
    toggleEntityFloor(floor) {
      if (this.changeAllPorches) {
        const floors = this.getAllFloors(floor);
        console.log(floors);
        floors.forEach((floor) => {
          floor.toggleEntity();
        });
      } else floor.toggleEntity();
      this.updateCoords();
    },
    setApptFloor(floor, count) {
      if (this.changeAllPorches) {
        const floors = this.getAllFloors(floor);
        floors.forEach((floor) => {
          floor.setAppt(count);
        });
      } else floor.setAppt(count);
      this.updateCoords();
    },
    changeRise(index) {
      const riser = this.risers[index];

      if (this.changeAllPorches) {
        this.porches.forEach((porch) => {
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
      this.updateCoords();
    },
    getAllFloors(floor) {
      const floorIndex = floor.porch.floors.findIndex((f) => f === floor);
      const floors = this.porches.map((porch) => porch.floors[floorIndex]);
      console.log(floors);
      return floors;
    },
  },
  computed: {
    ...mapState(useRootStore, ['porches']),
  },
  watch: {
    offset() {
      this.porch.changeOffset(this.offset);
      this.updateCoords();
    },
    visible() {
      this.porch.toggle();
      this.updateCoords();
    },
  },
  mounted() {
    this.offset = this.porch.offset;
    this.visible = this.porch.visible;
    this.porch.risers.list.forEach((riser) => {
      this.risers.push(riser);
    });
  },
  data() {
    return {
      offset: 0,
      visible: true,
      risers: [],
      changeAllPorches: true,
    };
  },
  props: {
    porch: {
      type: Object,
      required: true,
    },
  },
  components: {
    ControlCounter,
  },
  name: 'scheme-controls-porch',
};
</script>

<style lang="stylus">
.table-porch
  border-collapse collapse
  width 100%
  border 1px solid
  margin-top 20px
  th
    font-size 10px
  td
    border-top 1px solid
    &:first-child
      font-weight bold
      font-size 10px
</style>
