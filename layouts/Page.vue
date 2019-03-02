<template>
  <LayoutContainer>
    <div class="card">
      <div class="content-header">
        <h1 v-if="title" class="page-title">{{ title }}</h1>
        <span class="page-timestamp">{{ createTime }}</span>
      </div>
      <Content :custom="false"/>
      <div class="content page-nav" v-if="prev || next">
        <p class="inner">
          <span v-if="prev" class="prev">←
            <router-link v-if="prev" class="prev" :to="prev.path">{{ prev.title || prev.path }}</router-link>
          </span>
          <span v-if="next" class="next">
            <router-link v-if="next" :to="next.path">{{ next.title || next.path }}</router-link>→
          </span>
        </p>
      </div>
    </div>
    <div id="comment-container" v-if="isComment">
      <Vssue :title="title" :options="$site.themeConfig.comment" />
    </div>
  </LayoutContainer>
</template>

<script>
import {
  resolvePage,
  normalize,
  endingSlashRE,
  pageNormalize
} from "../lib/util";

export default {
  props: ["sidebarItems"],
  computed: {
    prev() {
      const prev = this.$page.frontmatter.prev;
      if (prev === false) {
        return;
      } else if (prev) {
        return resolvePage(this.$pagination.all, prev, this.$route.name);
      } else {
        return resolvePrev(this.$route.name, this.$pagination.all);
      }
    },
    next() {
      const next = this.$page.frontmatter.next;
      if (next === false) {
        return;
      } else if (next) {
        return resolvePage(this.$pagination.all, next, this.$route.name);
      } else {
        return resolveNext(this.$route.name, this.$pagination.all);
      }
    },
    title() {
      return this.$page.frontmatter.title;
    },
    isComment() {
      return this.$site.themeConfig.comment && this.$page.type === "post";
    },
    createTime() {
      const stamp = this.$page.frontmatter.date;
      const format = this.$site.themeConfig["date_format"];
      if (!stamp || !format) return "";
      const date = new Date(stamp);
      return date.Format(format);
    },
    overrideStyle() {
      const accentColor = this.$site.themeConfig["accentColor"];
      return accentColor ? { color: accentColor } : {};
    }
  }
};

function resolvePrev(name, pages) {
  return find(name, pages, -1);
}

function resolveNext(name, pages) {
  return find(name, pages, 1);
}

function find(name, pages, offset) {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].key === name) {
      if (offset < 0 && i === 0) return false;
      if (offset > 0 && i === pages.length - 1) return false;
      const page = pages[i + offset];
      return page.path === "/" ? false : page;
    }
  }
}
</script>

<style lang="stylus" src="../styles/theme.styl"></style>
<style lang="stylus" src="../styles/card.styl"></style>
<style lang="stylus">
@import '../styles/config.styl';
@import '../styles/vssue.styl';

#comment-container {
  color: #6190E8;
}

.page {
  padding-bottom: 2rem;
}

.page-title {
  margin-bottom: -2rem;
  color: $postColor;
}

.page-timestamp {
  display: block;
  font-size: 14px;
  margin-top: 2.5rem;
}

.edit-link.content {
  padding-top: 0 !important;

  a {
    color: lighten($textColor, 25%);
    margin-right: 0.25rem;
  }
}

.page-nav.content {
  padding-top: 1rem !important;
  padding-bottom: 0 !important;

  .inner {
    min-height: 2rem;
    margin-top: 0 !important;
    border-top: 1px solid $borderColor;
    padding-top: 1rem;
  }

  .next {
    float: right;
  }
}
</style>
