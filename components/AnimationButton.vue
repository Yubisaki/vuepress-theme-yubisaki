<template>
  <div
    @click="go"
    class="nav-link"
    v-if="!isExternal(link)"
  >{{ item.text }}</div>
  <a
    v-else
    :href="link"
    class="nav-link"
    :target="isMailto(link) ? null : '_blank'"
    :rel="isMailto(link) ? null : 'noopener noreferrer'"
  >{{ item.text }}</a>
</template>

<script>
import { isExternal, isMailto, ensureExt } from '../lib/util';

export default {
  props: {
    item: {
      required: true
    }
  },
  data() {
    return {
      timeout: null
    };
  },
  computed: {
    link() {
      return ensureExt(this.item.link);
    }
  },
  methods: {
    isExternal,
    isMailto,
    go() {
      this.timeout = setTimeout(() => {
        this.$router.push(this.link);
      }, 1000);
    }
  },
  destroyed() {
    clearTimeout(this.timeout);
  }
};
</script>
