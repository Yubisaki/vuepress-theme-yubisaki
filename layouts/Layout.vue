<template>
  <LayoutContainer>
    <List :items="$pagination.posts"/>
    <Pagination />
  </LayoutContainer>
</template>

<style lang="stylus" src="../styles/theme.styl"></style>
<style lang='stylus'>
@import '../styles/config.styl';

.main
  width $appWidth
  padding 1rem
  margin 0 auto

.post-list-wrap
  width 43rem
</style>