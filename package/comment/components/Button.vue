<template>
    <button
        class='gt-btn'
        @click="click">
        <slot></slot>
        <span v-if="isLoading" class="gt-btn-loading gt-spinner"></span>
  </button>
</template>

<script>
export default {
    props: ['isLoading'],
    methods: {
        click() {
            this.$emit('click')
        }
    }
}
</script>