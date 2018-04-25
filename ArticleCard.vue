<template>
  <div class="card article-card">
    <h2 :class="headerOverviewClasses">
      <router-link 
        :to="this.info.path" :style="overrideStyle">{{ title }}</router-link>
    </h2>
    <div v-if="isOverview">
      {{ overview }}
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
      isOverview() {
        return this.info.frontmatter.description
      },
      overview() {
        return this.info.frontmatter.description
      },
      headerOverviewClasses() {
        return (this.isOverview || this.isBanner) ? 'overview' : ''
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

<style src="./styles/card.styl" lang="stylus"></style>
<style lang="stylus">
  @require './styles/config'

  .article-card
    position relative
    padding 16px 20px
    h2:not(.overview)
      border: 0

  .article-banner
    width 80%
</style>