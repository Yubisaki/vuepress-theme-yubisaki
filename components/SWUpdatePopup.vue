<template>
  <transition name="sw-update-popup">
    <div
      v-if="enabled"
      class="sw-update-popup"
    >
      {{message}}<br>
      <button @click="reload">{{buttonText}}</button>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    updateEvent: {
      type: Object,
      default: null
    }
  },
  computed: {
    popupConfig () {
      for (const config of [this.$themeLocaleConfig, this.$site.themeConfig]) {
        const sw = config.serviceWorker
        if (sw && sw.updatePopup) {
          return typeof sw.updatePopup === 'object' ? sw.updatePopup : {}
        }
      }
      return null
    },
    enabled () {
      return Boolean(this.popupConfig && this.updateEvent)
    },
    message () {
      const c = this.popupConfig
      return (c && c.message) || 'Get new content';
    },
    buttonText () {
      const c = this.popupConfig
      return (c && c.buttonText) || 'Refresh'
    }
  },
  methods: {
    reload () {
      if (this.updateEvent) {
        this.updateEvent.skipWaiting().then(() => {
          console.log('PWA 正在开启新的 serviceWorker');
          location.reload(true)
        })
        this.updateEvent = null
      }
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl'
.sw-update-popup
  position fixed
  right 1em
  bottom 1em
  padding 1em
  border 1px solid $accentColor
  border-radius 3px
  background #fff
  box-shadow 0 4px 16px rgba(0, 0, 0, 0.5)
  text-align center
  button
    cursor pointer
    border 1px solid $accentColor
    border-radius 2px
    margin-top 0.5em
    padding 0.25em 2em
    transition .3s
    &:focus
      outline 0
    &:active, &:hover
      outline 0
      background-color $accentColor
      color #fff
.sw-update-popup-enter-active, .sw-update-popup-leave-active
  transition opacity 0.3s, transform 0.3s
.sw-update-popup-enter, .sw-update-popup-leave-to
  opacity 0
  transform translate(0, 50%) scale(0.5)
</style>