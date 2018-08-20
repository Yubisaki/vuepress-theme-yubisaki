<template>
  <div class="leetcode-group" >
    <div v-for="(info, index) in pageItems" :key="index">
        <LeetCodeCard :info="info"/>
    </div>
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
    @require '../styles/config'

    .leetcode-group
        margin-right 10px
        padding-bottom 10px

    @media (max-width ($MQNarrow + 1px))
      .leetcode-group
        margin-right 0
</style>