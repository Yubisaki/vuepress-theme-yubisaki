<template>
  <div class="theme-container">
    <div class="content">
      <h1>404</h1>
      <blockquote>{{ getMsg() }}</blockquote>
      <router-link to="/">back to the homepage</router-link>
    </div>
  </div>
</template>

<script>
const msgs = [
  `The page went on flight 404.`,
  `How did you come here?`,
  `It seems that there is a problem, it is being repaired.`,
  `Emmm, the page was hit by a two-way foil.`
]

export default {
  methods: {
    getMsg () {
      return msgs[Math.floor(Math.random() * msgs.length)]
    }
  }
}
</script>
