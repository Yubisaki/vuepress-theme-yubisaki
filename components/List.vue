<template>
  <div>
    <template v-for="(info, idx) in items">
      <PostCard :post="info" :key="idx" />
    </template>
  </div>
</template>

<script>
export default {
  props: ['items']
};
</script>

<style lang="stylus">
@import '../styles/config';

@media (max-width: ($MQNarrow + 1px)) {
  .post-list {
    margin-right: 0;
  }
}
</style>