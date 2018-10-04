<template>
  <nav class="pagation-nav">
    <router-link class="pagation-action pagation-prev" 
      :to="$pagination.prevLink"
      v-if="$pagination.hasPrev">← </router-link>
    <template>
      <router-link v-for="({ path }, index) in $pagination.pages"
        :key="index" 
        class="pagation-num"
        :to="path"
        :class="hightlightCurrentPage(index + 1)">
        {{ index + 1 }}
      </router-link>  
    </template> 
    <router-link class="pagation-action pagation-next" 
      :to="$pagination.nextLink"
      v-if="$pagination.hasNext"> →</router-link>
  </nav>
</template>

<script>
export default {
  methods: {
    hightlightCurrentPage(pageNum) {
      return {
        'pagation-current': pageNum === this.$pagination.currentIndex + 1
      }
    }
  }
}
</script>

<style lang="stylus">
.pagation-nav
  padding 1rem
  text-align center
  clear both
  line-height 2
  overflow hidden
  a:hover
    color #000

.pagation-action
  display block
  text-align center
  cursor pointer
  width 2rem
  height 2rem
  border-radius 50%
  background-color #fff

.pagation-num
  cursor pointer
  color #ccc
  padding 10px 20px
  line-height 1
  height 2ex

.pagation-prev
  float left

.pagation-next
  float right

.pagation-current
  font-weight 700
  color #000
</style>