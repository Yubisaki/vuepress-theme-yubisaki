<template>
  <div :class="containerClass" class="theme">
    <!-- emit event for toggle sidebar in mobile mode -->
    <Navbar @toggle-sidebar="toggleSidebar" />
    <div class="sidebar-mask" @click="toggleSidebar(false)"></div>
    <Sidebar v-if="isSidebarOpen" @toggle-sidebar="toggleSidebar"/>
    <div class="layout-container">
      <div class="main">
        <div class="layout-inner">
          <slot />
        </div>
        <ToolGroup />
      </div>
    </div>
    <Footer />
  </div>
</template>

<script>
import Vue from 'vue';
import Footer from '@theme/components/Footer';
import nprogress from "nprogress";

export default {
  components: { Footer },
  mounted() {
    nprogress.configure({ showSpinner: false });
    this.$router.beforeEach((to, from, next) => {
      if (to.path !== from.path && !Vue.component(to.name)) {
        nprogress.start();
      }
      next();
    });
    this.$router.afterEach(() => {
      nprogress.done();
      this.isSidebarOpen = false;
    });
  },
  data () {
    return {
      isSidebarOpen: false
    }
  },
  methods: {
    toggleSidebar (to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    }
  },
  computed: {
    containerClass () {
      return [{
        "sidebar-open": this.isSidebarOpen
      }]
    }
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../styles/theme.styl" lang="stylus"></style>
<style src="../styles/mobile.styl" lang="stylus"></style>
<style lang="stylus">
@import '../styles/config.styl';

.theme
  &.sidebar-open
    .sidebar-mask
      display: block

.sidebar-mask
  position fixed
  z-index 9
  top 0
  left 0
  width 100vw
  height 100vh
  display none

.main
  width $appWidth
  padding 1rem
  margin 0 auto

.layout-container
  margin-top $navbarHeight
  margin-bottom $footerHeight

.layout-inner
  width 43rem

@media (max-width: ($MQNarrow + 1px)) {
  .main {
    width 100%
    padding 0.5rem 0
  }

  .layout-inner {
    width 100%
  }
}
</style>

