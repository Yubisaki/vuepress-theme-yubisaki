<template>
  <div class="card article-card">
    <h2 :class="headerOverviewClasses">
      <router-link 
        :to="info.path" :style="overrideStyle">{{ title }}</router-link>
    </h2>
    <div v-html="info.excerpt">
    </div>
    <img :src="isBanner" alt="overview" v-if="isBanner" class="article-banner" />
  </div>
</template>

<script>
  export default {
    name: 'article-card',
    props: {
      info: {
        type: Object,
        required: true
      }
    },
    computed: {
      title() {
        return this.info.frontmatter.title || this.info.title
      },
      headerOverviewClasses() {
        return {
          'overview': this.info.excerpt
        }
      },
      overrideStyle() {
        const { accentColor } = this.$site.themeConfig
        return accentColor ? { color: accentColor } : {}
      },
      isBanner() {
        return this.info.frontmatter.banner
      }
    }
  }
</script>

<style src="../styles/card.styl" lang="stylus"></style>
<style lang="stylus">
  @require '../styles/config'

  .article-card
    position relative
    padding 16px 20px
    h2:not(.overview)
      border: 0
    img // article card img css hack
      display block
      max-width 100%
    a[class*="header-anchor"] // article card '#' css hack
      display none
    pre[class*="language-"] // article card language class css hack
      position relative
      &:before
        position absolute
        top 0.8em
        right 1em
        font-size 0.75rem;
        color: rgba(255, 255, 255, 0.4)

  .article-banner
    width 80%
</style>