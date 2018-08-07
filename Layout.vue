<template>
  <div>
    <div class="wrap">
      <div class="theme-container container"
        :class="pageClasses"
        @touchstart="onTouchStart"
        @touchend="onTouchEnd">
        <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar"/>
        <div class="sidebar-mask" @click="toggleSidebar(false)"></div>
        <Sidebar :items="sidebarItems" @toggle-sidebar="toggleSidebar"/>
        <div class="page-container" :style="pageContainerClasses">
          <!-- custom layout -->
          <div class="custom-layout" v-if="$page.frontmatter.layout">
            <component :is="$page.frontmatter.layout"/>
          </div>
          <!-- Activity layout -->
          <Activity v-else-if="$page.frontmatter.activity"/>
          <!-- article list -->
          <ArticleGroup v-else-if="isRoot" :page-items="pageItems" />
          <!-- nav with layout list -->
          <ArticleGroup v-else-if="isNavLayout" :page-items="pageItems" />
          <!-- tags -->
          <Tags v-else-if="isTag" />
          <!-- article page -->
          <Page v-else :sidebar-items="sidebarItems"/>
          <!-- pagation selector -->
          <Pagation v-if="isRoot || isNavLayout" 
            :page-items="pages" 
            @change="page => currentPage = page" />
        </div>
        <ToolGroup v-if="!isNoToolGroup" />
      </div>
      <SWUpdatePopup :updateEvent="swUpdateEvent" />
    </div>
    <div class="background-mask" :style="wrapClasses"></div>
  </div>
</template>

<script>
import Vue from "vue";
import nprogress from "nprogress";
import Activity from "./layout/Activity.vue";
import Navbar from "./components/Navbar.vue";
import Page from "./Page.vue";
import Sidebar from "./components/Sidebar.vue";
import ToolGroup from "./components/ToolGroup.vue";
import ArticleGroup from './components/ArticleGroup.vue'
import LeetCodeGroup from './components/LeetCodeGroup.vue'
import Pagation from './components/Pagation.vue'
import SWUpdatePopup from './components/SWUpdatePopup.vue'
import Tags from './components/Tags.vue'
import navLayoutMixin from './lib/navLayout.mixin'
import { resolveSidebarItems, getTitle } from "./lib/util";

export default {
  mixins: [navLayoutMixin],
  components: { 
    Activity, 
    Page, 
    Sidebar,
    Navbar, 
    ToolGroup, 
    ArticleGroup, 
    LeetCodeGroup, 
    Pagation,
    Tags,
    SWUpdatePopup
  },
  data() {
    return {
      isSidebarOpen: false,
      currentPage: 1,
      swUpdateEvent: null
    };
  },
  computed: {
    isRoot() {
      return this.$route.meta.root || this.$route.path === this.$rootOptions.path;
    },
    isTag() {
      return this.$route.meta.tag;
    },
    isNoToolGroup() {
      return this.$page.frontmatter.layout || this.$page.frontmatter.activity
    },
    pageItems() {
      const start = (this.currentPage - 1) * this.perPage
      const end = this.currentPage * this.perPage
      return this.pages.filter((page, i) => (i >= start && i < end))
    },
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      return (
        this.$site.title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav
      );
    },
    shouldShowSidebar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      return (
        !frontmatter.layout &&
        !frontmatter.activity &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },
    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$route,
        this.$site,
        this.$localePath
      );
    },
    // when Activity Component, dont show tool group and expand the page container's width to 100%
    pageContainerClasses() {
      return !this.isNoToolGroup ? {} : { width: '100%' }
    },
    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar,
        },
        userPageClass
      ];
    },
    wrapClasses() {
      const { themeConfig } = this.$site;
      return themeConfig.background
        ? {
            background:
              'url("' +
              `${this.$withBase(themeConfig.background)}` +
              '") no-repeat fixed'
          }
        : { background: "#f6f6f6" };
    }
  },
  created() {
    if (this.$ssrContext) {
      this.$ssrContext.title = getTitle(this.$title, this.$page);
      this.$ssrContext.lang = this.$lang;
      this.$ssrContext.description =
        this.$page.description || this.$description;
    }
  },
  mounted() {
    // when swtich tab, change the current page
    const updateCurPage = () => {
      this.currentPage = 1
    }
    this.$watch('pages', updateCurPage)

    // configure progress bar
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

    this.$on('sw-updated', this.onSWUpdated);
  },
  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
    },
    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
    },
    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
    onSWUpdated(e) {
      this.swUpdateEvent = e;
    }
  }
};
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="./styles/theme.styl" lang="stylus"></style>