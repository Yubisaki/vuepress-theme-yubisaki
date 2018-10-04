<template>
  <nav class="nav-links" v-if="userLinks.length">
    <ul class="nav-ul">
      <li class="nav-item" v-for="item in userLinks" :key="item.link">
        <NavLink :item="item"/>
      </li>
    </ul>
  </nav>
</template>

<script>
import { isActive, resolveNavLinkItem } from '../lib/util'
import NavLink from './NavLink.vue'

export default {
  components: { NavLink },
  computed: {
    nav () {
      return this.$site.themeConfig.nav || []
    },
    userLinks () {
      return (this.nav || []).map((link => {
        return Object.assign(resolveNavLinkItem(link), {
          items: (link.items || []).map(resolveNavLinkItem)
        })
      }))
    },
  },
  methods: {
    isActive
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'

.nav-ul
  line-height inherit
  height 100%
  padding 0
  margin 0
  list-style none
  & > li
    color #66757f
    padding 0
    margin 0
    float left
    height inherit
    line-height inherit

.nav-links
  display inline-block
  vertical-align top
  height $navbarHeight
  line-height $navbarHeight
  a
    display block
    color inherit
    padding 0 0.75rem
    transition all .15s ease-in-out
    border-bottom 2px solid transparent
    height "calc(%s - 2px)" % $navbarHeight
    &:hover, &.router-link-active
      border-bottom-color lighten($accentColor, 5%)
      color $accentColor
  .nav-item
    cursor pointer
    position relative
    font-weight 500

@media (max-width: $MQMobile)
  .nav-links
    .nav-item 
      margin-left 0

@media (min-width: $MQMobile)
  .nav-links
    a
      &:hover, &.router-link-active
        color $accentColor
</style>
