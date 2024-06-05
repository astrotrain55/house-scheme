<template>
  <div class="app-tabs">
    <div class="app-tabs__buttons">
      <button
        v-for="(name, key) in names"
        :key="key"
        class="app-tabs__button"
        :class="{ active: index === key }"
        @click="onChange(key)"
      >{{ name }}</button>
    </div>
    <div class="app-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    onChange(index) {
      this.index = index;
      this.$emit('update', index);
    },
  },
  mounted() {
    this.index = this.defaultValue;
  },
  data() {
    return {
      index: 0,
    };
  },
  props: {
    names: {
      type: Array,
      required: true,
    },
    defaultValue: {
      type: Number,
      default: 0,
    },
  },
  name: 'app-tabs',
};
</script>

<style lang="stylus">
.app-tabs
  &__buttons
    display flex
    flex-wrap wrap
    column-gap 5px
  &__button
    &.active
      background-color coral
  &__content
    margin-top 10px
    & > *:not(.active)
      display none
</style>
