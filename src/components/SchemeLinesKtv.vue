<template>
  <g data-item="ktv" data-name="КТВ">
    <polyline
      v-for="(polyline, index) in ktvList.polyline"
      :key="index"
      :points="polyline"
      :stroke="color"
      fill="none"
    ></polyline>
    <rect
      v-for="(rect, index) in ktvList.rect"
      :key="index"
      :x="rect.x"
      :y="rect.y"
      :width="rect.size"
      :height="rect.size"
      :fill="color"
    ></rect>
  </g>
</template>

<script>
import { mapState } from 'pinia';
import { useRootStore } from '@/stores/RootStore';

export default {
  computed: {
    ...mapState(useRootStore, ['colors']),

    color() {
      return this.colors.ktv.value;
    },

    ktvList() {
      const width = [-35, -80, -240].reverse();
      const indexes = this.porch.risers.list.reduce((acc, item, i) => {
        if (item.ktv) acc.push(width[i]);
        return acc;
      }, []);
      const findFn = (point) => point.ess.type === 'default' && !point.ess.entity;
      const startFloor = this.pointsFloors.map((p) => p).find(findFn);
      const endFloor = this.pointsFloors.map((p) => p).reverse().find(findFn);
      const top = startFloor.coords.top;
      const bottom = endFloor.coords.bottom;
      const porchRight = this.coords.right;
      const coords = indexes.map((left) => {
        return [left, left + 6, left + 12, left + 18].map((offset) => {
          return [
            [porchRight + offset, top],
            [porchRight + offset, bottom],
          ];
        });
      });

      const rectangles = this.pointsFloors.filter(findFn).map((floor) => {
        return indexes.map((left) => {
          return [left, left + 6, left + 12, left + 18].map((offset, index) => {
            return {
                x: porchRight + offset - 3,
                y: (index % 2 === 0) ? floor.coords.top + 15 : floor.coords.top + 30,
                size: 6,
              };
          });
        });
      });

      return {
        polyline: coords.flat(),
        rect: rectangles.flat(2),
      };
    },
  },
  props: {
    coords: {
      type: Object,
      required: true,
    },
    pointsFloors: {
      type: Array,
      required: true,
    },
    porch: {
      type: Object,
      required: true,
    },
  },
  name: 'scheme-lines-ktv',
};
</script>
