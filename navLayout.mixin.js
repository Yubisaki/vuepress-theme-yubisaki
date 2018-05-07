import { pageWithCustomLayout, pageNormalize, navLayoutRE } from './util'

export default {
  computed: {
    // 处理当前路由是否为 nav layout, yes -> 只展示 layoutTag 为此 layout 的页面    
    isNavLayout() {
      const navsWithLayout = this.$site.themeConfig.nav.filter(nav => nav.layout)
      return navsWithLayout.some(nav => nav.link === this.$route.path)
    },
    // 处理 leetcode 布局
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
