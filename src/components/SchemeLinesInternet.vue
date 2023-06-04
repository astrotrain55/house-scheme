<template>
  <g data-item="internet" data-name="Интернет">
    {{ lines }}
  </g>
</template>

<script>
import { mapState } from 'pinia';
import { useRootStore } from '@/stores/RootStore';

export default {
  computed: {
    ...mapState(useRootStore, ['config', 'coords', 'colors']),

    lines() {
      const porchBoxes = [];
      this.coords.porches.forEach((porch, index) => {
        porchBoxes[index] = [];
        const floors = porch.floors.map((f) => f);

        floors.forEach((floor) => {
          floor.boxes.forEach((box) => {
            if (box.ess.floors && box.ess.floors.length) console.log(box.ess.floors);
          });
        });
      });
      return porchBoxes;
    },
  },
  name: 'scheme-lines-internet',
};
</script>
