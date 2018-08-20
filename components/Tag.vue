<template>
    <router-link :to="to" exact>
        <span tabindex="0" 
            :class="tagClasses">
            <span class="tag-inner">
                <slot></slot>
            </span>
        </span>
    </router-link>
</template>

<script>
export default {
    props: ['tag', 'slug', 'highlight'],
    computed: {
        tagName() {
            return this.$route.params.tagName;
        },
        to() {
            return `${this.$tagOptions.path}${this.slug || ''}`
        },
        tagClasses() {
            return {
                'tag-wrap': true,
                'tag-active': this.highlight && this.slug === this.tagName
            }
        }
    }
}
</script>

<style lang="stylus">
.tag-wrap
    cursor pointer
    font-weight 400
    // background #e0e0e0
    // border 1px solid transparent
    border: 1px solid #e8eaec;
    background: #fff;
    color rgba(0,0,0,.87)
    height 24px
    border-radius 2px
    align-items center
    display inline-flex
    vertical-align middle
    font-size 13px
    margin 4px
    outline none
    position relative
    transition .3s cubic-bezier(.25,.8,.5,1)
    text-transform capitalize
.tag-inner
    height 24px
    line-height 24px
    white-space nowrap
    padding 0 12px
.tag-active
    background-color #3f51b5
    color #fff
</style>