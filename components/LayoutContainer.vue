<template>
  <div>
    <Navbar />
    <div class="sidebar-mask" @click="togglesidebar(false)"></div>
    <!-- <sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar"/> -->
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
import Footer from '@theme/components/Footer';

export default {
  components: { Footer }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="../styles/theme.styl"></style>
<style lang="stylus">
@import '../styles/config.styl';
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
    padding 0 
  }

  .layout-inner {
    width 100%
  }
}
</style>

