<template>
  <div class="card leetcode-card">
    <h2 :class="headerOverviewClasses">
      <router-link 
        :to="this.info.path" :style="overrideStyle">{{ title }}</router-link>
    </h2>
    <div v-if="isOverview">
      {{ overview }}
    </div>
    <img :src="isBanner" alt="overview" v-if="isBanner" class="leetcode-banner" />
  </div>
</template>

<script>
  export default {
    name: 'leetcode-card',
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

  .leetcode-card
    position relative
    padding 16px 10px
    margin-right 10px
    width calc(33% - 10px)
    height 210px
    float left
    h2:not(.overview)
      border: 0

  .leetcode-banner
    width 80%

  @media (max-width ($MQNarrow + 1px))
    .leetcode-card
      margin-right 0
      width 100%
      height auto
</style>