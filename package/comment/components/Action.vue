<template>
    <a class='gt-action' @click="click">
        <span class="gt-action-text">{{text}}</span>
    </a>
</template>

<script>
export default {
    props: ['text'],
    methods: {
        click() {
            this.$emit('click')
        }
    }
}
</script>