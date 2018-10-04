<template>
  <div class="search-box">
    <input
      @input="query = $event.target.value"
      aria-label="Search"
      :value="query"
      autocomplete="off"
      spellcheck="false"
      @focus="focused = true"
      @blur="focused = false"
      @keyup.enter="go(focusIndex)"
      @keyup.up="onUp"
      @keyup.down="onDown">
    <ul class="suggestions"
      v-if="showSuggestions"
      :class="{ 'align-right': alignRight }"
      @mouseleave="unfocus">
      <li class="suggestion" v-for="(s, i) in suggestions"
        :key="i"
        :class="{ focused: i === focusIndex }"
        @mousedown="go(i)"
        @mouseenter="focus(i)">
        <a :href="s.path" @click.prevent>
          <span class="suggestion-title">{{ s.title || s.path }}</span>
          <span v-if="s.header" class="header">&gt; {{ s.header.title }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { pageNormalize } from "../lib/util";

export default {
  data() {
    return {
      query: "",
      focused: false,
      focusIndex: 0
    };
  },
  computed: {
    showSuggestions() {
      return this.focused && this.suggestions && this.suggestions.length;
    },
    suggestions() {
      const query = this.query.trim().toLowerCase();
      if (!query) {
        return;
      }

      const max = 5;
      const pages = this.$pagination.all;
      const localePath = this.$localePath;
      const matches = item => {
        const keywords = this.getKeywords(item);
        return (
          item.title && 
          item.title.toLowerCase().indexOf(query) > -1 ||
          keywords.some(keyword => keyword.indexOf(query) > -1)
        );
      };
      const res = [];
      for (let i = 0; i < pages.length; i++) {
        if (res.length >= max) break;
        const p = pages[i];
        // filter out results that do not match current locale
        if (this.getPageLocalePath(p) !== localePath) {
          continue;
        }
        if (matches(p)) {
          res.push(p);
        } else if (p.headers) {
          for (let j = 0; j < p.headers.length; j++) {
            if (res.length >= max) break;
            const h = p.headers[j];
            if (matches(h)) {
              res.push(
                Object.assign({}, p, {
                  path: p.path + "#" + h.slug,
                  header: h
                })
              );
            }
          }
        }
      }
      return res;
    },
    // make suggestions align right when there are not enough items
    alignRight() {
      const navCount = (this.$site.themeConfig.nav || []).length;
      return navCount <= 2;
    }
  },
  methods: {
    getKeywords(page) {
      const metaList = (page.frontmatter ? page.frontmatter.meta : []) || [];
      let keywords = metaList.filter(meta => meta.name === "keywords");
      keywords = keywords.length ? keywords[0].content.split(" ") : [];
      return keywords.map(keyword => keyword.toLowerCase())
    },
    getPageLocalePath(page) {
      for (const localePath in this.$site.locales || {}) {
        if (localePath !== "/" && page.path.indexOf(localePath) === 0) {
          return localePath;
        }
      }
      return "/";
    },
    onUp() {
      if (this.showSuggestions) {
        if (this.focusIndex > 0) {
          this.focusIndex--;
        } else {
          this.focusIndex = this.suggestions.length - 1;
        }
      }
    },
    onDown() {
      if (this.showSuggestions) {
        if (this.focusIndex < this.suggestions.length - 1) {
          this.focusIndex++;
        } else {
          this.focusIndex = 0;
        }
      }
    },
    go(i) {
      this.$router.push(this.suggestions[i].path);
      this.query = "";
      this.focusIndex = 0;
    },
    focus(i) {
      this.focusIndex = i;
    },
    unfocus() {
      this.focusIndex = -1;
    }
  }
};
</script>

<style lang="stylus">
@import '../styles/config.styl';

.search-box {
  display: inline-block;
  position: relative;
  margin-right: 0.5rem;

  input {
    cursor: pointer;
    width: 10rem;
    color: lighten($textColor, 25%);
    display: inline-block;
    border: 1px solid #e6ecf0;
    border-radius: 2rem;
    font-size: 0.9rem;
    line-height: 2rem;
    padding: 0 0.5rem 0 2rem;
    outline: none;
    transition: all 0.2s ease;
    background: #f5f8fa url('../assets/search.svg') 0.6rem 0.5rem no-repeat;
    background-size: 1rem;

    &:focus {
      cursor: auto;
      background-color #fff;
      border: 2px solid $focusColor;
    }
  }

  .suggestions {
    background: #fff;
    box-shadow: 0 1px 4px rgba(0,0,0,0.25);
    width: 20rem;
    position: absolute;
    top: 2rem;
    border-radius: 3px;
    padding: 0.4rem;
    list-style-type: none;

    &.align-right {
      right: 0;
    }
  }

  .suggestion {
    line-height: 1.4;
    padding: 0.4rem 0.6rem;
    border-radius: 3px;

    a {
      color: lighten($textColor, 35%);

      .suggestion-title {
        font-weight: 600;
      }

      .header {
        font-size: 0.9em;
        margin-left: 0.25em;
      }
    }

    &.focused {
      // background-color: #f3f4f5;
      background-color lighten(#ebf8f3, 20%);

      a {
        color: $accentColor;
      }
    }
  }
}

@media (max-width: $MQNarrow) {
  .search-box input {
    width: 0;
    border-color: transparent;
    position: relative;
    left: 1rem;

    &:focus {
      left: 0;
      width: 8rem;
    }
  }
}

@media (max-width: $MQMobile) {
  .search-box {
    margin-right: 0;

    .suggestions {
      right: 0;
    }
  }
}

@media (max-width: $MQMobileNarrow) {
  .search-box {
    .suggestions {
      width: calc(100vw - 4rem);
    }

    input:focus {
      width: 8rem;
    }
  }
}
</style>
