<template>
  <div class="page card">
    <h1 v-if="title" 
      class="page-title" 
      :style="overrideStyle">
      {{ title }}
    </h1>
    <span class="page-timestamp">{{ createTime }}</span>
    <Content :custom="false"/>
    <div class="content edit-link" v-if="editLink">
      <a :href="editLink" target="_blank" rel="noopener noreferrer">{{ editLinkText }}</a>
      <OutboundLink/>
    </div>
    <div class="content page-nav" v-if="prev || next">
      <p class="inner">
        <span v-if="prev" class="prev">
          ← <router-link v-if="prev" class="prev" :to="prev.path">
            {{ prev.title || prev.path }}
          </router-link>
        </span>
        <span v-if="next" class="next">
          <router-link v-if="next" :to="next.path">
            {{ next.title || next.path }}
          </router-link> →
        </span>
      </p>
    </div>
  </div>
</template>

<script>
import OutboundLink from './OutboundLink.vue'
import { resolvePage, normalize, outboundRE, endingSlashRE, pageNormalize } from './util'

export default {
  components: { OutboundLink },
  props: ['sidebarItems'],
  computed: {
    prev () {
      const prev = this.$page.frontmatter.prev
      if (prev === false) {
        return
      } else if (prev) {
        return resolvePage(this.pagesWithoutRoot, prev, this.$route.path)
      } else {
        return resolvePrev(this.$route.path, this.pagesWithoutRoot)        
      }
    },
    next () {
      const next = this.$page.frontmatter.next
      if (next === false) {
        return
      } else if (next) {
        return resolvePage(this.pagesWithoutRoot, next, this.$route.path)
      } else {
        return resolveNext(this.$route.path, this.pagesWithoutRoot)
      }
    },
    pagesWithoutRoot() {
      return pageNormalize(this.$site.pages, this.$site.themeConfig.nav)
    },
    title() {
      return this.$page.frontmatter.title
    },
    createTime() {
      const stamp = this.$page.frontmatter.date
      const format = this.$site.themeConfig['date_format']      
      if(!stamp || !format) return ''
      const date = new Date(stamp)
      return date.Format(format)
    },
    overrideStyle() {
      const { accentColor } = this.$site.themeConfig
      return accentColor ? { color: accentColor } : {}
    },
    editLink () {
      const {
        repo,
        editLinks,
        docsDir = '',
        docsBranch = 'master'
      } = this.$site.themeConfig

      let path = normalize(this.$page.path)
      if (endingSlashRE.test(path)) {
        path += 'README.md'
      } else {
        path += '.md'
      }

      if (repo && editLinks) {
        const base = outboundRE.test(repo)
          ? repo
          : `https://github.com/${repo}`
        return (
          base.replace(endingSlashRE, '') +
          `/edit/${docsBranch}/` +
          docsDir.replace(endingSlashRE, '') +
          path
        )
      }
    },
    editLinkText () {
      return (
        this.$themeLocaleConfig.editLinkText ||
        this.$site.themeConfig.editLinkText ||
        `Edit this page`
      )
    }
  },
}

function resolvePrev(path, pages) {
  return find(path, pages, -1)
}

function resolveNext(path, pages) {
  return find(path, pages, 1)
}

function find(path, pages, offset) {
  for(let i = 0; i < pages.length; i++) {
    if(pages[i].path === path) {
      if(i === 0 || i + 1 === pages.length) return false
      const page = pages[i + offset]
      return page.path === '/' ? false : page
    }
  }
}
</script>

<style lang="stylus" src="./styles/card.styl"></style>
<style lang="stylus">
@import './styles/config.styl'

.page
  padding-bottom 2rem

.page-title
  margin-bottom -2rem
  padding 0 2.5rem

.page-timestamp
  display block
  font-size 14px
  padding 0 2.5rem
  margin-top 2.5rem

.edit-link.content
  padding-top 0 !important
  a
    color lighten($textColor, 25%)
    margin-right 0.25rem

.page-nav.content
  padding-top 1rem !important
  padding-bottom 0 !important
  .inner
    min-height 2rem
    margin-top 0 !important
    border-top 1px solid $borderColor
    padding-top 1rem
  .next
    float right
</style>
