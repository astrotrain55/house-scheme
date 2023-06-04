<template>
  <div v-if="show" class="modal-window">
    <div class="modal-window__overlay" @click="$emit('close')"></div>
    <div class="modal-window__content">
      <header v-if="header" class="modal-window__header">
        {{ title }}
        <button class="modal-window__close" @click="$emit('close')">x</button>
      </header>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    header: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
  },
  name: 'modal-window',
};
</script>

<style lang="stylus">
.modal-window
  position relative
  z-index 999
  &__overlay
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    background-color rgba(black, .6)
  &__content
    position fixed
    top 50%
    left 50%
    transform translate(-50%, -50%)
    border 5px solid
    background-color beige
    box-sizing border-box
    min-width 400px
    max-height calc(100% - 20px)
    height 100%
    padding 10px
    overflow-y auto
  &__header
    display flex
    align-items center
    justify-content space-between
    font-weight bold
</style>
