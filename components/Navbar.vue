<template>
  <header class="navbar">
    <div class="nav-header">
      <SidebarButton @toggle-sidebar="$emit('toggle-sidebar')"/>
      <router-link :to="$localePath" class="home-link">
        <img class="logo"
          v-if="$site.themeConfig.logo"
          :src="$withBase($site.themeConfig.logo)">
        <span class="site-name"
          v-if="$site.title"
          :class="{ 'can-hide': $site.themeConfig.logo }">
          {{ $site.title }}
        </span>
      </router-link>
      <NavLinks class="can-hide"/>
      <div class="links">
        <SearchBox v-if="$site.themeConfig.search !== false"/>
      </div>
    </div>
  </header>
</template>

<style lang="stylus">
@import '../styles/config.styl';

.nav-header {
  position relative
  padding 0 1rem
  margin 0 auto
  width $appWidth
  height $navbarHeight
  line-height $navbarHeight
}

.home-link
  height $navbarHeight
  line-height $navbarHeight
  margin-right 0.75rem

.navbar {
  position fixed
  z-index 20
  top 0
  left 0
  right 0
  height $navbarHeight
  background-color #fff
  box-sizing border-box
  border-bottom 1px solid rgba(0,0,0,0.25)

  a, span, img {
    display: inline-block;
  }

  .logo {
    height: $navbarHeight - 1.4rem;
    min-width: $navbarHeight - 1.4rem;
    margin-top: 0.7rem;
    margin-right: 0.8rem;
    vertical-align: top;
  }

  .site-name {
    font-size: 1.3rem;
    font-weight: 600;
    color: $textColor;
    position: relative;
  }

  .links {
    font-size: 0.9rem;
    position: absolute;
    right: 2.5rem;
    top: 0;
  }
}

@media (max-width ($MQNarrow + 1px))
  .nav-header {
    position static
    width 100%
    padding 0
  }

@media (max-width: $MQMobile) {
  .navbar {
    padding-left: 4rem;
    
    .can-hide {
      display: none;
    }
  }
}
</style>
