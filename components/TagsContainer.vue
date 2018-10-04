<template>
  <div>
    <h2>TAGS</h2>
    <div>
      <Tag v-for="(tag, idx) in tags" 
        :key="idx" 
      >
        <router-link :to="tag.path">
          # {{tag.name}} {{tag.pages.length}}     
        </router-link>
      </Tag>
    </div>
  </div>
</template>

<script>
export default {
  props: ['tags'],
}
</script>
