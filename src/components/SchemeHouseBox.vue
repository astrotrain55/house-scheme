<template>
  <g
    v-if="isVisible"
    data-item="box"
    :data-name="box.name"
    :data-id="box.id"
    @mouseenter="visibleButtons = true"
    @mouseleave="visibleButtons = false"
  >
    <rect
      :x="points.x"
      :y="points.y"
      :width="points.width"
      :height="points.height"
      :fill="color"
      stroke="black"
      stroke-width="2"
    ></rect>
    <text
      :x="points.x + 5"
      :y="points.y + 15"
    >{{ box.type }}</text>

    <foreignObject
      v-if="isReceiver"
      :x="points.x + 25"
      :y="points.y + 7"
      :width="25"
      :height="25"
    >
      <input
        type="text"
        title="Количество приёмников в ящике"
        :value="box.receiverCount"
        @input="setReceiverCount(box, Number($event.target.value))"
        style="display: block;width: 25px;height: 25px;text-align: center;box-sizing: border-box;"
      >
    </foreignObject>

    <template v-if="visibleButtons">
      <foreignObject
        :x="points.x + points.width - 20"
        :y="points.y"
        :width="20"
        :height="20"
      >
        <button class="moving-button" v-html="'&#8593;'" @click="movingBox(['up', box.id])"></button>
      </foreignObject>
      <foreignObject
        :x="points.x + points.width - 20"
        :y="points.y + points.height - 20"
        :width="20"
        :height="20"
      >
        <button class="moving-button" v-html="'&#8595;'" @click="movingBox(['down', box.id])"></button>
      </foreignObject>
    </template>
  </g>
</template>

<script>
import { mapActions } from 'pinia';
import { useRootStore } from '@/stores/RootStore';

export default {
  methods: {
    ...mapActions(useRootStore, ['updateCoords', 'movingBox']),

    setReceiverCount(box, value) {
      const count = value > 0 ? value : 0;
      box.setReceiverCount(count);
      this.updateCoords();
    },
  },
  computed: {
    isReceiver() {
      return this.box.type === '3';
    },
    isVisible() {
      return !this.box.type.includes('П');
    },
  },
  data() {
    return {
      visibleButtons: false,
    };
  },
  props: {
    box: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    points: {
      type: Object,
      required: true,
    },
  },
  name: 'scheme-house-box',
};
</script>
