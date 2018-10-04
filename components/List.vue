<template>
  <div class="post-list">
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

.post-list {
  margin-right: 10px;
}

@media (max-width: ($MQNarrow + 1px)) {
  .post-list {
    margin-right: 0;
  }
}
</style>