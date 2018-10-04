import Gitalk from 'gitalk';

const commentMixin = {
  methods: {
    comment() {
      if (!this.$site.themeConfig.comment) return;
      return new Gitalk(this.$site.themeConfig.comment);
    }
  }
};

export default commentMixin;
