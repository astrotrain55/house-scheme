<template>
  <div class="control-counter">
    <button @click="onInput(defaultValue - 1)">-</button>
    <input
      type="text"
      ref="input"
      :value="defaultValue"
      @input="onInput(Number($event.target.value))"
    >
    <button @click="onInput(defaultValue + 1)">+</button>
  </div>
</template>

<script>
export default {
  methods: {
    onInput(value) {
      const count = value < this.min ? this.min : value > this.max ? this.max : value;
      this.$refs.input.value = count;
      this.$emit('change', count);
    },
  },
  props: {
    defaultValue: {
      type: Number,
      required: true,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: Infinity,
    },
  },
  name: 'control-counter',
};
</script>

<style lang="stylus">
.control-counter
  display flex
  justify-content center
  column-gap 5px
  button
    cursor pointer
  input
    text-align center
    max-width 30px
</style>
