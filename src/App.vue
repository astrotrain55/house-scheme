<template>
  <scheme-controls></scheme-controls>
  <scheme-svg></scheme-svg>
</template>

<script>
import { mapActions } from 'pinia';
import { useRootStore } from './stores/RootStore';
import SchemeControls from './components/SchemeControls.vue';
import SchemeSvg from './components/SchemeSvg.vue';

export default {
  methods: {
    ...mapActions(useRootStore, ['initLogScheme']),
  },
  mounted() {
    this.initLogScheme();
  },
  components: {
    SchemeControls,
    SchemeSvg,
  },
  name: 'app',
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
</style>
