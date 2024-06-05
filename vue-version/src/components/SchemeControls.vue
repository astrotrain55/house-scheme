<template>
  <div>
    <scheme-controls-create-house></scheme-controls-create-house>
    <div>
      <span>Расположение ящиков</span>
      <label>
        <input type="radio" v-model="boxesPosition" value="default">
        <span>Жилые этажи</span>
      </label>
      <label>
        <input type="radio" v-model="boxesPosition" value="tech">
        <span>Тех.этажи</span>
      </label>
    </div>
    <div>
      <span>Разводка</span>
      <label>
        <input type="radio" v-model="routingPosition" value="top">
        <span>Сверху</span>
      </label>
      <label>
        <input type="radio" v-model="routingPosition" value="bottom">
        <span>Снизу</span>
      </label>
    </div>
    <div>
      <span>Направление</span>
      <label>
        <input type="radio" v-model="directionCalculation" value="left">
        <span>Слева</span>
      </label>
      <label>
        <input type="radio" v-model="directionCalculation" value="right">
        <span>Справа</span>
      </label>
    </div>
    <div>
      <button @click="autoBoxes">Автозаполнение</button>
    </div>
    <div style="display: flex;flex-wrap: wrap;column-gap: 10px;justify-content: center;">
      <button
        v-for="(porch, key) in config.porches"
        :key="key"
        @click="tabs.show = key;modal.show = true;"
      >{{ porch.name }}</button>
    </div>
    <modal-window :show="modal.show" title="Подъезды" @close="modal.show = false;">
      <app-tabs
        :names="config.porches.map((porch) => porch.name)"
        :default-value="tabs.show"
        @update="tabs.show = $event"
      >
        <scheme-controls-porch
          v-for="(porch, key) in config.porches"
          :key="key"
          :porch="porch"
          :class="{ active: tabs.show === key }"
        ></scheme-controls-porch>
      </app-tabs>
    </modal-window>
    <div>
      <label>
        <input type="checkbox" v-model="debug">
        <span>Отладка</span>
      </label>
    </div>
    <div>
      <label>
        <input type="checkbox" v-model="visibleAll">
        <span>Показать всё</span>
      </label>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useRootStore } from '@/stores/RootStore';
import SchemeControlsCreateHouse from './SchemeControlsCreateHouse.vue';
import SchemeControlsPorch from './SchemeControlsPorch.vue';
import ModalWindow from './fragments/ModalWindow.vue';
import AppTabs from './fragments/AppTabs.vue';

export default {
  methods: {
    ...mapActions(useRootStore, ['updateCoords', 'autoBoxes']),
  },
  computed: {
    ...mapState(useRootStore, ['config']),
  },
  watch: {
    visibleAll() {
      this.config.house.toggle(this.visibleAll);
      this.updateCoords();
    },
    debug() {
      this.config.house.toggleDebug(this.debug);
      this.updateCoords();
    },
    routingPosition() {
      this.config.house.toggleRoutingPosition(this.routingPosition);
      this.updateCoords();
    },
    directionCalculation() {
      this.config.house.toggleDirection(this.directionCalculation);
      this.updateCoords();
    },
    boxesPosition() {
      this.config.house.toggleBoxesPosition(this.boxesPosition);
      this.updateCoords();
    },
  },
  mounted() {
    this.debug = this.config.house.debug;
    this.visibleAll = this.config.house.visibleAll;
    this.routingPosition = this.config.house.routingPosition;
    this.directionCalculation = this.config.house.directionCalculation;
    this.boxesPosition = this.config.house.boxesPosition;
  },
  data() {
    return {
      visibleAll: false,
      debug: false,
      routingPosition: 'bottom',
      directionCalculation: 'left',
      boxesPosition: 'default',
      modal: {
        show: false,
      },
      tabs: {
        show: 0,
      },
    };
  },
  components: {
    SchemeControlsCreateHouse,
    SchemeControlsPorch,
    ModalWindow,
    AppTabs,
  },
  name: 'scheme-controls',
};
</script>
