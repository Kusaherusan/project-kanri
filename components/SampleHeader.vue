<template>
  <v-app dark>
    <v-app-bar color="teal lighten-3" dark app>
      <v-toolbar-title @click="$router.push('/')" class="toolbar-title">
        プロジェクト管理したい
      </v-toolbar-title>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<style>
</style>
<script>
</script>