<template>
  <svg
    v-if="coords.porches.length"
    :viewBox="coords.svg.viewBox.join(' ')"
    :width="coords.svg.width"
    :height="coords.svg.height"
  >
    <scheme-lines-optical></scheme-lines-optical>
    <g data-item="porches" data-name="Подъезды">
      <scheme-house-porch
        v-for="(porch, index) in coords.porches"
        :key="porch.ess.id"
        :porch-id="porch.ess.id"
        :porch-number="porch.ess.name"
        :porch="porch.ess"
        :coords="porch.coords"
        :points="porch.points"
        :points-floors="porch.floors"
        :floors="porch.ess.floors"
        :first="index === 0"
      ></scheme-house-porch>
    </g>
  </svg>
</template>

<script>
import { mapState } from 'pinia';
import { useRootStore } from '@/stores/RootStore';
import SchemeHousePorch from './SchemeHousePorch.vue';
import SchemeLinesOptical from './SchemeLinesOptical.vue';

export default {
  computed: {
    ...mapState(useRootStore, ['coords']),
  },
  components: {
    SchemeHousePorch,
    SchemeLinesOptical,
  },
  name: 'scheme-svg',
};
</script>
