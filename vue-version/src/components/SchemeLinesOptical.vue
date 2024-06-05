<template>
  <g data-item="optical" data-name="Оптика">
    <polyline
      v-for="(polyline, index) in lines"
      :key="index"
      :points="polyline.points"
      :stroke="polyline.color"
      :stroke-dasharray="polyline.dash"
      stroke-width="2"
      fill="none"
    ></polyline>
  </g>
</template>

<script>
import { mapState } from 'pinia';
import { useRootStore } from '@/stores/RootStore';

export default {
  computed: {
    ...mapState(useRootStore, ['config', 'coords', 'colors']),

    lines() {
      const array = [];
      const left = [];
      const porchBoxes = [];
      let top = 0;
      let top3 = 0;
      let top8 = 0;
      let origin = null;
      const getLine = (points, color = this.colors.between.value, dash = '10,5') => ({ points, color, dash });

      this.coords.porches.forEach((porch, index) => {
        porchBoxes[index] = [];
        const floors = porch.floors.map((f) => f);
        if (this.config.house.routingPosition === 'bottom') {
          floors.reverse();
          if (index === 0) {
            top = porch.coords.bottom - 10;
            top3 = top - 10;
            top8 = top3 - 10;
          }
        } else if (index === 0) {
          top = porch.coords.top + 10;
          top3 = top + 10;
          top8 = top3 + 10;
        }

        floors.forEach((floor) => {
          floor.boxes.forEach((box) => {
            if (box.ess.type.includes('П')) return;
            if (box.ess.type === '3') left.push(porch.coords.right - 150);
            const newBox = {
              porch: index,
              type: box.ess.type,
              count: box.ess.receiverCount,
              origin: box.ess.origin,
              coords: {
                ...floor.coords,
                left: porch.coords.left,
                right: porch.coords.right,
              },
            };
            porchBoxes[index].push(newBox);
            if (newBox.origin) origin = newBox;
          });
        });
      });

      const resultLeft = origin ? origin.coords.right - 150 : Math.min(...left);
      const horizontal = getLine([
        [resultLeft, top],
        [this.coords.svg.width, top],
      ]);

      array.push(horizontal);

      porchBoxes.forEach((boxes) => {
        if (!boxes.length) return;
        const indexOrigin = boxes.findIndex((b) => b.origin);
        const searchBox = boxes[indexOrigin > -1 ? indexOrigin : 0];
        const points = [
          [searchBox.coords.right - 150, searchBox.coords.top + 20],
          [searchBox.coords.right - 150, searchBox.origin ? top : searchBox.type === '3' ? top3 : top8],
        ];
        if (!searchBox.origin) {
          const ind = searchBox.porch < origin.porch
            ? -10
            : searchBox.porch > origin.porch
              ? 10
              : 0;
          points.push([origin.coords.right - 150 + ind, searchBox.type === '3' ? top3 : top8]);
          if (searchBox.type === '8') {
            points.push([origin.coords.right - 150 + ind, origin.coords.top + 25]);
          }
        }
        if (searchBox.type === '8') {
          array.push(getLine(points, 'orange', false));
        } else {
          array.push(getLine(points));
        }

        boxes.forEach((box, indexBox) => {
          if (indexBox) {
            const boxOne = boxes[indexBox - 1];
            const boxTwo = boxes[indexBox];

            const pointsBetween = [
              [searchBox.coords.right - 120, boxOne.coords.top + 20],
              [searchBox.coords.right - 100, boxOne.coords.top + 20],
              [searchBox.coords.right - 100, boxTwo.coords.top + 20],
              [searchBox.coords.right - 120, boxTwo.coords.top + 20],
            ];

            if (boxOne.count && boxTwo.count) {
              array.push(getLine(pointsBetween));
            } else {
              array.push(getLine(pointsBetween, 'orange', false));
            }
          }
        });
      });

      return array;
    },
  },
  name: 'scheme-lines-optical',
};
</script>
