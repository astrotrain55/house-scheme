<template>
  <g
    data-item="floor"
    :data-name="floorNumber"
    @mouseenter="visibleButtons = true"
    @mouseleave="visibleButtons = false"
  >
    <polygon
      v-if="!floor.visible"
      :points="pointsHiddenArea"
      fill="lightgray"
    />
    <polyline
      :points="floorCoords"
      stroke="black"
      stroke-width="2"
      stroke-dasharray="20,2,5,2"
      fill="transparent"
    ></polyline>
    <text
      v-if="floor.porch.visibleCaption && !floor.tower"
      :x="textCoords.x"
      :y="textCoords.y"
    >{{ floorNumber }}</text>

    <foreignObject
      v-if="floor.type === 'default' && !floor.entity"
      :x="coords.right - 290"
      :y="coords.top + 15"
      :width="25"
      :height="25"
    >
      <input
        type="text"
        title="Количество квартир на этаже"
        :value="floor.appt"
        @input="setApptFloor(floor, Number($event.target.value))"
        style="display: block;width: 25px;height: 25px;text-align: center;box-sizing: border-box;"
      >
    </foreignObject>

    <g data-item="boxes" data-name="Ящики">
      <scheme-house-box
        v-for="(item, index) in floor.boxes"
        :key="item.id"
        :box="item"
        :color="floor.porch.debug() ? floor.color : item.origin ? '#ff7f50' : colors.box.value"
        :points="pointsBoxes[index].points"
      ></scheme-house-box>
    </g>

    <g
      v-if="floor.type === 'default' && !floor.entity"
      data-item="risers"
      data-name="Стояки"
    >
      <g
        v-if="floor.porch.risers.list[0].visible"
        data-item="riser"
        data-name="Стояк 1"
      >
        <rect
          :x="coords.right - 250"
          :y="coords.top + 5"
          :width="40"
          :height="floor.sizes.height - 10"
          stroke="black"
          stroke-width="2"
          :fill="floor.porch.debug() ? floor.color : 'transparent'"
        ></rect>
      </g>
      <g
        v-if="floor.porch.risers.list[1].visible"
        data-item="riser"
        data-name="Стояк 2"
      >
        <rect
          :x="coords.right - 90"
          :y="coords.top + 5"
          :width="40"
          :height="floor.sizes.height - 10"
          stroke="black"
          stroke-width="2"
          :fill="floor.porch.debug() ? floor.color : 'transparent'"
        ></rect>
      </g>
      <g
        v-if="floor.porch.risers.list[2].visible"
        data-item="riser"
        data-name="Стояк 3"
      >
        <rect
          :x="coords.right - 45"
          :y="coords.top + 5"
          :width="40"
          :height="floor.sizes.height - 10"
          stroke="black"
          stroke-width="2"
          :fill="floor.porch.debug() ? floor.color : 'transparent'"
        ></rect>
      </g>
    </g>

    <template v-if="floor.moving && firstPorch">
      <foreignObject
        :x="coords.right - 340"
        :y="coords.top"
        :width="20"
        :height="20"
      >
        <button
          class="moving-button"
          v-html="'&#8593;'"
          @click="movingTechFloor(['up', floor])"
        ></button>
      </foreignObject>
      <foreignObject
        :x="coords.right - 340"
        :y="coords.top + floor.sizes.height - 20"
        :width="20"
        :height="20"
      >
        <button
          class="moving-button"
          v-html="'&#8595;'"
          @click="movingTechFloor(['down', floor])"
        ></button>
      </foreignObject>
    </template>
  </g>
</template>

<script>
import { mapState, mapActions } from 'pinia';
import { useRootStore } from '@/stores/RootStore';
import SchemeHouseBox from './SchemeHouseBox.vue';

export default {
  methods: {
    ...mapActions(useRootStore, ['updateCoords', 'movingTechFloor']),

    setApptFloor(floor, value) {
      const count = value > 0 ? value : 0;
      floor.setAppt(count);
      this.updateCoords();
    },
  },
  computed: {
    ...mapState(useRootStore, ['colors']),

    floorCoords() {
      return this.points.map((point) => point.join(',')).join(' ');
    },
    pointsHiddenArea() {
      const points = [
        [this.coords.left + 2, this.coords.top + 2],
        [this.coords.right - 2, this.coords.top + 2],
        [this.coords.right - 2, this.coords.bottom],
        [this.coords.left + 2, this.coords.bottom],
      ];
      return points.map((point) => point.join(',')).join(' ');
    },
    textCoords() {
      return {
        x: this.coords.left + 10,
        y: this.coords.top + 30,
      };
    },
  },
  data() {
    return {
      visibleButtons: false,
    };
  },
  props: {
    points: {
      type: Array,
      required: true,
    },
    coords: {
      type: Object,
      required: true,
    },
    floor: {
      type: Object,
      required: true,
    },
    pointsBoxes: {
      type: Array,
      required: true,
    },
    floorNumber: {
      type: String,
      required: true,
    },
    firstPorch: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    SchemeHouseBox,
  },
  name: 'scheme-house-floor',
};
</script>
