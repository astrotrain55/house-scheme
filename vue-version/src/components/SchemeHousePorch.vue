<template>
  <g data-item="porch" :data-name="porchNumber" :data-id="porchId">
    <polyline
      :points="porchCoords"
      stroke="black"
      stroke-width="2"
      stroke-dasharray="20,2,5,2"
      fill="transparent"
    ></polyline>
    <g data-item="floors" data-name="Этажи">
      <scheme-house-floor
        v-for="floor in pointsFloors"
        :key="floor.ess.id"
        :floor-number="floor.ess.name"
        :floor="floor.ess"
        :points="floor.points"
        :coords="floor.coords"
        :points-boxes="floor.boxes"
        :first-porch="first"
      ></scheme-house-floor>
    </g>
    <scheme-lines-ktv
      :coords="coords"
      :points-floors="pointsFloors"
      :porch="porch"
    ></scheme-lines-ktv>
  </g>
</template>

<script>
import SchemeHouseFloor from './SchemeHouseFloor.vue';
import SchemeLinesKtv from './SchemeLinesKtv.vue';

export default {
  computed: {
    porchCoords() {
      return this.points.map((point) => point.join(',')).join(' ');
    },
  },
  props: {
    porchId: {
      type: String,
      required: true,
    },
    porchNumber: {
      type: String,
      required: true,
    },
    porch: {
      type: Object,
      required: true,
    },
    points: {
      type: Array,
      required: true,
    },
    coords: {
      type: Object,
      required: true,
    },
    pointsFloors: {
      type: Array,
      required: true,
    },
    floors: {
      type: Array,
      required: true,
    },
    first: {
      type: Boolean,
      required: true,
    },
  },
  components: {
    SchemeHouseFloor,
    SchemeLinesKtv,
  },
  name: 'scheme-house-porch',
};
</script>
