<template>
  <span tabindex="0" class="tag-wrap">
    <span class="tag-inner">
      <slot></slot>
    </span>
  </span>
</template>

<script>
export default {
  props: ['tag', 'slug']
};
</script>

<style lang="stylus">
.tag-wrap {
  font-weight: 400;
  // background #e0e0e0
  // border 1px solid transparent
  border: 1px solid #e8eaec;
  background: #fff;
  color: rgba(0, 0, 0, 0.87);
  height: 24px;
  border-radius: 2px;
  align-items: center;
  display: inline-flex;
  vertical-align: middle;
  font-size: 13px;
  margin: 4px;
  outline: none;
  position: relative;
  transition: 0.3s cubic-bezier(0.25, 0.8, 0.5, 1);
  text-transform: capitalize;
}

.tag-inner {
  height: 24px;
  line-height: 24px;
  white-space: nowrap;
  padding: 0 12px;
}

.tag-active {
  background-color: #3f51b5;
  color: #fff;
}
</style>