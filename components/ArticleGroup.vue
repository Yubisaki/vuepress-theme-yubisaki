<template>
  <div class="article-group" >
    <div v-for="(info, index) in pageItems" :key="index">
        <ArticleCard :info="info"/>
    </div>
  </div>
</template>

<script>
    import ArticleCard from './ArticleCard'
    export default {
        name: 'article-group',
        props: ['pageItems'],
        components: { ArticleCard }
    }
</script>

<style lang="stylus">
    @require '../styles/config'

    .article-group
        margin-right 10px
        padding-bottom 10px

    @media (max-width ($MQNarrow + 1px))
      .article-group
        margin-right 0
</style>