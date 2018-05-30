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
          <!-- article page -->
          <Page v-else :sidebar-items="sidebarItems"/>
          <!-- pagation selector -->
          <Pagation v-if="isRoot || isNavLayout" 
            :page-items="pages" 
            @change="page => currentPage = page" />
        </div>
        <ToolGroup v-if="!isNoToolGroup" />
      </div>
    </div>
    <div class="background-mask" :style="wrapClasses"></div>
  </div>
</template>

<script>
import Vue from "vue";
import nprogress from "nprogress";
import Activity from "./Activity.vue";
import Navbar from "./Navbar.vue";
import Page from "./Page.vue";
import Sidebar from "./Sidebar.vue";
import ToolGroup from "./ToolGroup.vue";
import ArticleGroup from './ArticleGroup.vue'
import LeetCodeGroup from './LeetCodeGroup.vue'
import Pagation from './Pagation.vue'
import navLayoutMixin from './navLayout.mixin'
import { pathToComponentName } from "@app/util";
import { resolveSidebarItems, getTitle } from "./util";

export default {
  mixins: [navLayoutMixin],
  components: { Activity, Page, Sidebar, Navbar, ToolGroup, ArticleGroup, LeetCodeGroup, Pagation },
  data() {
    return {
      isSidebarOpen: false,
      currentPage: 1
    };
  },
  computed: {
    isRoot() {
      return this.$route.path === '/'
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
    // update title / meta tags
    this.currentMetaTags = [];
    const updateMeta = () => {
      document.title = getTitle(this.$title, this.$page);
      document.documentElement.lang = this.$lang;
      const meta = [
        {
          name: "description",
          content: this.$description
        },
        ...(this.$page.frontmatter.meta || [])
      ];
      this.currentMetaTags = updateMetaTags(meta, this.currentMetaTags);
    };
    this.$watch("$page", updateMeta);
    updateMeta();

    // when swtich tab, change the current page
    const updateCurPage = () => {
      this.currentPage = 1
    }
    this.$watch('pages', updateCurPage)

    // configure progress bar
    nprogress.configure({ showSpinner: false });

    this.$router.beforeEach((to, from, next) => {
      if (
        to.path !== from.path &&
        !Vue.component(pathToComponentName(to.path))
      ) {
        nprogress.start();
      }
      next();
    });

    this.$router.afterEach(() => {
      nprogress.done();
      this.isSidebarOpen = false;
    });
  },

  beforeDestroy() {
    updateMetaTags(null, this.currentMetaTags);
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
    }
  }
};

function updateMetaTags(meta, current) {
  if (current) {
    current.forEach(c => {
      document.head.removeChild(c);
    });
  }
  if (meta) {
    return meta.map(m => {
      const tag = document.createElement("meta");
      Object.keys(m).forEach(key => {
        tag.setAttribute(key, m[key]);
      });
      document.head.appendChild(tag);
      return tag;
    });
  }
}
</script>

<style src="prismjs/themes/prism-tomorrow.css"></style>
<style src="./styles/theme.styl" lang="stylus"></style>