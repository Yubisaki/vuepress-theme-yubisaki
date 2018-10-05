<template>
  <LayoutContainer>
    <List :items="$tag ? $tag.pages : []" />
  </LayoutContainer>
</template>
