<template>
  <div class="sidebar">
    <NavLinks />
  </div>
</template>

<script>
import NavLinks from './NavLinks.vue'
import { isActive } from '../lib/util'

export default {
  components: { NavLinks },
  data () {
    return {
      openGroupIndex: 0
    }
  },
  methods: {
    isActive (page) {
      return isActive(this.$route, page.path)
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.sidebar
  font-size 15px
  background-color #fff
  position fixed
  z-index 10
  margin 0
  left 0
  bottom 0
  box-sizing border-box
  border-right 1px solid $borderColor
  overflow-y auto

  ul
    padding 0
    margin 0
    list-style-type none
    > li
      width 100%
  a
    display inline-block
  .nav-links
    display none
    padding 0.5rem 0 0.75rem 0
    a
      position relative
      font-weight 600
      height 2rem
      line-height 2rem
      border-bottom 0
      &:before
        position absolute
        content ''
        left 2px
        top 0.5rem
        height 1rem
        border-left 4px solid transparent
    .nav-item
      display block
      font-size 1.1em
      .router-link-active:before
        border-left-color $accentColor
  .sidebar-links
    padding 1.5rem 0

@media (max-width: $MQMobile)
  .sidebar
    .nav-links
      display block
</style>
