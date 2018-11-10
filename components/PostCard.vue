<template>
  <div class="card article-card">
    <!-- Article title -->
    <h2>
      <router-link class="art-header-link"
        :to="post.path">{{ title }}</router-link>
    </h2>
    <!-- Article overview -->
    <div v-html="post.excerpt"></div>
    <!-- Tag area -->
    <div v-if="post.tags">
      <div class="divider article-card-line"></div>
      <tag v-for="tag in post.tags" 
        :key="tag"
        :slug="tag">
        {{tag}}
      </tag>
    </div>
  </div>
</template>

<script>
import Tag from './Tag';

export default {
  name: 'post-card',
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  components: { Tag },
  computed: {
    title() {
      return this.post.frontmatter.title || this.post.title;
    }
  }
};
</script>

<style src="../styles/card.styl" lang="stylus"></style>
<style lang="stylus">
@import '../styles/config';

.article-card-line {
  margin-bottom: 16px;
}

.divider
  width 100%
  height 1px
  transform scaleY(0.5)
  transform-origin 50% 100%
  background #DCDCDC

.article-card {
  position: relative;
  padding: 16px 20px;

  h2 {
    border: 0;
    padding: 0;
  }

  .art-header-link {
    position: relative;
    color: $postColor;
    text-transform: capitalize;
    font-size: 24px;
    line-height: 36px;
    display: inline-block;

    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 2px;
      bottom: 0;
      left: 0;
      background-color: #ac3e40;
      visibility: hidden;
      transform: scaleX(0);
      transition: 0.3s ease-in-out;
    }

    &:hover {
      &:after {
        visibility: visible;
        transform: scaleX(1);
      }
    }
  }

  img { // article card img css hack
    display: block;
    max-width: 100%;
  }

  a[class*='header-anchor'] { // article card '#' css hack
    display: none;
  }

  pre[class*='language-'] { // article card language class css hack
    position: relative;

    &:before {
      position: absolute;
      top: 0.8em;
      right: 1em;
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.4);
    }
  }
}
</style>