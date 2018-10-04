<template>
  <div class="tool-group">
    <GithubCard />
  </div>
</template>

<script>
import GithubCard from './GithubCard.vue';
export default {
  name: 'tool-group',
  components: { GithubCard }
};
</script>

<style src='../styles/tool-group.styl' lang=stylus></style>