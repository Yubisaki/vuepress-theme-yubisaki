<template>
    <span class="gt-ico">
        <span class="gt-svg" v-html="svgHtml()"></span>
        <span v-if="text" class="gt-ico-text">{{text}}</span>
    </span>
</template>

<script>
export default {
    props: ['text', 'name'],
    methods: {
        svgHtml() {
            return require(`!!raw-loader!../assets/icon/${this.name}.svg`)
        }
    }
}
</script>