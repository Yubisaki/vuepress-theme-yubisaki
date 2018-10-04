<template>
  <footer class="footer">
    锁窗前月明色, 雕阑外夜气清
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
  background #f2f2f2
  height $footerHeight
  line-height 32px

@media (max-width: ($MQMobile + 1px)) {
  .footer {
    padding-left 0
    text-align center
  }
}
</style>
