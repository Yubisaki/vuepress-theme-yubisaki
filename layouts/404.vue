<template>
  <NoToolContainer>
    <div class="not-found-container">
      <div class="not-found-img"></div>
      <div class="not-found-action">
        <h1>404</h1>
        <blockquote>{{ getMsg() }}</blockquote>
        <router-link to="/" class="not-found-link">back to home</router-link>
      </div>
    </div>
  </NoToolContainer>
</template>

<script>
const msgs = [
  `The page went on flight 404.`,
  `How did you come here?`,
  `It seems that there is a problem, it is being repaired.`,
  `Hmmm, the page was hit by a two-way foil.`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>

<style lang="stylus">
@import '../styles/config.styl';

.not-found-container
  width $appWidth
  margin 0 auto
  display flex
  flex-direction row
  justify-content center

.not-found-link
  color #1890ff
  &:hover
    color #40a9ff

.not-found-img
  height 360px
  width 300px
  max-width 300px
  margin-right 90px
  background-image url('../assets/404.svg')
  background-repeat no-repeat
  background-position 50% 50%
  background-size contain

.not-found-action
  margin-top 100px

@media (max-width: ($MQNarrow + 1px)) {
  .not-found-container {
    width 100%
    padding 0 
    flex-direction column
    align-items center 
  }

  .not-found-img {
    margin-right 0
  }

  .not-found-action {
    margin-top 20px
  }
}
</style>
