<template>
    <div class="card tag-card">
        <span v-for="tag in Object.keys(tags)" class="tag">
            {{tag}}
        </span>
    </div>
</template>

<script>
    import navLayoutMixin from '../lib/navLayout.mixin'
    export default {
        mixins: [navLayoutMixin]
    }
</script>

<style src="../styles/transition.styl" lang="stylus"></style>
<style src="../styles/card.styl" lang="stylus"></style>

<style lang="stylus">
@import '../styles/config.styl';

.tag-card
  max-width $toolWidth;
  padding 12px;

.tag
  color: #707070;
  margin 4px;
  line-height 24px;
  word-break keep-all;
  cursor pointer;
  transition .3s

  &:hover
    color: #2c3e50;
</style>