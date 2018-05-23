<template>
  <div class="leetcode-group" >
    <template v-for="info in pageItems">
        <LeetCodeCard :info="info"/>
    </template>
  </div>
</template>

<script>
    import LeetCodeCard from './LeetCodeCard.vue'
    export default {
        name: 'leetcode-group',
        props: ['pageItems'],
        components: { LeetCodeCard }
    }
</script>

<style lang="stylus">
    @require './styles/config'

    .leetcode-group
        margin-right 10px
        padding-bottom 10px

    @media (max-width ($MQNarrow + 1px))
      .leetcode-group
        margin-right 0
</style>