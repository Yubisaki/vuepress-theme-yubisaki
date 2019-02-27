<template>
  <div>
    <h2>TAGS</h2>
    <div>
      <Tag v-for="(tag, idx) in tags"
        :key="idx"
        :tag="tag"
      >
        <router-link :to="tag.path" class="tag-link">
          # {{tag.name}} {{tag.pages.length}}
        </router-link>
      </Tag>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tags'],
}
</script>

<style lang="stylus">
@import '../styles/config.styl';

.tag-link
  color #657786
  transition all .2s ease-in-out
  &:hover
    color $accentColor
</style>
