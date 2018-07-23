<template>
  <div class="tool-group">
      <GithubCard />
      <!-- <TagGroup /> -->
  </div>
</template>

<script>
    import GithubCard from './GithubCard.vue'
    import TagGroup from './TagGroup'
    export default {
        name: 'tool-group',
        components: { GithubCard, TagGroup }
    }
</script>

<style src='./styles/tool-group.styl' lang=stylus></style>