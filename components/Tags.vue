<template>
    <div>
        <h2 :style="overrideStyle">TAGS</h2>
        <div class="tag-group">
            <Tag v-for="tag in Object.keys($tags)"
                :tag="$tags[tag]"
                :highlight="true"
                :slug="tag"
                :key="tag">
                #{{tag}} {{$tags[tag].length}}
            </Tag>
        </div>
        <ArticleGroup :page-items="pageItems" />
        <Pagation 
            :page-items="pageWithSpecTag"
            @change="page => currentPage = page" />
    </div>
</template>

<script>
import Tag from './Tag';
import ArticleGroup from './ArticleGroup.vue';
import Pagation from './Pagation.vue'
import navLayoutMixin from '../lib/navLayout.mixin'

export default {
    mixins: [navLayoutMixin],
    data() {
        return {
            currentPage: 1
        }
    },
    mounted() {
        const updateCurPage = () => {
            this.currentPage = 1
        }
        this.$watch('pageWithSpecTag', updateCurPage)
    },
    components: { Tag, ArticleGroup, Pagation },
    computed: {
        overrideStyle() {
            const accentColor = this.$site.themeConfig['accentColor'];
            return accentColor ? { color: accentColor } : {}
        },
        tagName() {
            return this.$route.params.tagName;
        },
        pageItems() {
            const start = (this.currentPage - 1) * this.perPage;
            const end = this.currentPage * this.perPage;
            return this.pageWithSpecTag.filter((page, i) => (i >= start && i < end));
        },
        pageWithSpecTag() {
            if (!this.tagName) return [];
            const tagKeys = this.$tags[this.tagName.toLowerCase()];
            return this.pages.filter(page => page.key && !!~tagKeys.indexOf(page.key));
        },
    }
}
</script>

<style src="../styles/theme.styl" lang="stylus"></style>
<style lang="stylus">
.tag-group {
    margin-bottom 1rem
}
</style>
