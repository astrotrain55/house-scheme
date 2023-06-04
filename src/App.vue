<template>
  <div class="home">
    <div class="scheme">
      <div class="create-house">
        <div>
          Количество подъездов
          <control-counter
            :default-value="scheme.porchesCount"
            :min="1"
            @change="scheme.porchesCount = $event"
          ></control-counter>
        </div>
        <div>
          Количество этажей
          <control-counter
            :default-value="scheme.floorsCount"
            :min="1"
            @change="scheme.floorsCount = $event"
          ></control-counter>
        </div>
        <div>
          Количество квартир
          <control-counter
            :default-value="scheme.apptCount"
            @change="scheme.apptCount = $event"
          ></control-counter>
        </div>
        <div>
          Подъезд ящика
          <control-counter
            :default-value="scheme.boxPorch"
            :min="1"
            :max="scheme.porchesCount"
            @change="scheme.boxPorch = $event"
          ></control-counter>
        </div>
        <div>
          Этаж ящика
          <control-counter
            :default-value="scheme.boxFloor"
            :min="1"
            :max="scheme.floorsCount"
            @change="scheme.boxFloor = $event"
          ></control-counter>
        </div>
        <button @click="submit">Нарисовать</button>
        <button @click="createDefaultScheme">По умолчанию</button>
      </div>
      <scheme-controls></scheme-controls>
      <scheme-svg></scheme-svg>
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';
import { mapActions } from 'pinia';
import { useRootStore } from './stores/RootStore';
import SchemeControls from './components/SchemeControls.vue';
import SchemeSvg from './components/SchemeSvg.vue';
import ControlCounter from './components/fragments/ControlCounter.vue';

export default {
  methods: {
    ...mapActions(useRootStore, ['initLogScheme', 'createScheme', 'createDefaultScheme']),

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
  mounted() {
    this.initLogScheme();
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
    SchemeControls,
    SchemeSvg,
    ControlCounter,
  },
  name: 'App',
};
</script>

<style lang="stylus">
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
  color #2c3e50

.moving-button
  cursor pointer
  border none
  background-color transparent
  padding 0
  display block
  width 100%
  height 100%

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

.create-house
  border 1px solid
  padding 20px
  display flex
  justify-content center
  column-gap 20px
</style>
