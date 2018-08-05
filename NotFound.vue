<template>
  <div class="theme-container">
    <div class="content">
      <h1>404</h1>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">回到首页</router-link>
    </div>
  </div>
</template>

<script>
const msgs = [
  `网页乘坐 404 航班去了.`,
  `你是怎么来到这的?`,
  `似乎出现了一点问题, 正在修复中`,
  `emmm, 网页受到了二向箔打击.`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>
