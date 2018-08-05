<template>
    <div>
        <h2 :style="overrideStyle">TAGS</h2>
        <div>
            <Tag v-for="tag in Object.keys($tags)"
                :tag="$tags[tag]"
                :slug="tag"
                :key="tag">#{{tag}} {{$tags[tag].length}}</Tag>
        </div>
    </div>
</template>

<script>
import Tag from './Tag';

export default {
    components: { Tag },
    computed: {
        overrideStyle() {
            const accentColor = this.$site.themeConfig['accentColor'];
            return accentColor ? { color: accentColor } : {}
        },
        tagName() {
            return this.$route.params.tagName;
        }
    }
}
</script>

<style src="../styles/theme.styl" lang="stylus"></style>
