<template>
  <footer class="footer">
    <span v-if="$themeConfig.footer">{{$themeConfig.footer}}</span>
    <span v-else>powered by vuepress theme Yubisaki</span>
  </footer>
</template>

<style lang="stylus">
@import '../styles/config.styl';
.footer
  width 100%
  color #93a1a1
  font-size 14px
  padding-left 4rem
  position fixed
  bottom 0
  background #eff5f3
  height $footerHeight
  line-height 32px

@media (max-width: ($MQMobile + 1px)) {
  .footer {
    padding-left 0
    text-align center
  }
}
</style>
