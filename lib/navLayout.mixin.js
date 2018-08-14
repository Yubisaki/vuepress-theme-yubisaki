import { pageWithCustomLayout, pageNormalize, navLayoutRE } from './util'

export default {
  computed: {
    // Handle whether the current route is nav layout, if yes, only show layoutTag for this layout page    
    isNavLayout() {
      const navsWithLayout = this.$site.themeConfig.nav.filter(nav => nav.layout)
      return navsWithLayout.some(nav => nav.link === this.$route.path)
    },
    // Handling leetcode layout
    isLeetCode() {
      const layout = currentLayout(this.$site.themeConfig.nav, this.$route.path)
      return this.isNavLayout && layout === 'leetcode'
    },
    pages() {
      const { nav } = this.$site.themeConfig
      if (this.isNavLayout) {
        // get layout from current $route.path
        const layout = currentLayout(nav, this.$route.path)
        return pageWithCustomLayout(this.$site.pages, nav, layout)
      }
      return pageNormalize(this.$site.pages, nav)
    },
    perPage() {
      return (this.$site.themeConfig['per_page'] || 5)
    }
  }
}

function currentLayout(navs, routePath) {
  const routes = navs.filter(nav => nav.link === routePath)
  return routes.length > 0 ? routes[0].layout : null
}
