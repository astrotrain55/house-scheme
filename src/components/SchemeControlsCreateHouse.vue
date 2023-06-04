<template>
  <div class="scheme-controls-create-house">
    <div>
      Количество подъездов
      <control-counter
        :default-number="scheme.porchesCount"
        :min="1"
        @update="scheme.porchesCount = $event"
      ></control-counter>
    </div>
    <div>
      Количество этажей
      <control-counter
        :default-number="scheme.floorsCount"
        :min="1"
        @update="scheme.floorsCount = $event"
      ></control-counter>
    </div>
    <div>
      Количество квартир
      <control-counter
        :default-number="scheme.apptCount"
        @update="scheme.apptCount = $event"
      ></control-counter>
    </div>
    <div>
      Подъезд ящика
      <control-counter
        :default-number="scheme.boxPorch"
        :min="1"
        :max="scheme.porchesCount"
        @update="scheme.boxPorch = $event"
      ></control-counter>
    </div>
    <div>
      Этаж ящика
      <control-counter
        :default-number="scheme.boxFloor"
        :min="1"
        :max="scheme.floorsCount"
        @update="scheme.boxFloor = $event"
      ></control-counter>
    </div>
    <button @click="submit">Нарисовать</button>
    <button @click="createDefaultScheme">По умолчанию</button>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';
import { mapActions } from 'pinia';
import { useRootStore } from '@/stores/RootStore';
import ControlCounter from './fragments/ControlCounter.vue';

export default {
  methods: {
    ...mapActions(useRootStore, ['createScheme', 'createDefaultScheme']),

    submit() {
      const porches = [];

      for (let i = 0; i < this.scheme.porchesCount; i++) {
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

      this.createScheme({
        house: {
          UF_XML_ID: uuid(),
          UF_APT_NUMBERS: false,
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
    },
  },
  watch: {
    'scheme.porchesCount'(value) {
      if (this.scheme.boxPorch > value) this.scheme.boxPorch = value;
    },

    'scheme.floorsCount'(value) {
      if (this.scheme.boxFloor > value) this.scheme.boxFloor = value;
    },
  },
  data() {
    return {
      scheme: {
        porchesCount: 6,
        floorsCount: 9,
        apptCount: 216,
        boxPorch: 2,
        boxFloor: 9,
      },
    };
  },
  components: {
    ControlCounter,
  },
  name: 'scheme-controls-create-house',
};
</script>

<style lang="stylus">
.scheme-controls-create-house
  border 1px solid
  padding 20px
  display flex
  justify-content center
  column-gap 20px
</style>
