<template>
<v-form>
  <h2>追加するぜ～～～～</h2>
<v-text-field label="プロジェクト名" v-model="project.name"></v-text-field>
 <v-autocomplete
            label="担当チーム"
            v-model="project.team"
            :items="teams"
          ></v-autocomplete>
<v-text-field 
  label="受注金額" 
  v-model="project.Amoney"
  suffix="円"
  ></v-text-field>
  <v-btn
  elevation="2" 
  @click="InsertSubmit(project)"
>新規作成</v-btn>
</v-form>

</template>

<script>
import db from "~/plugins/firebase";


export default {
  data: () => ({
  teams: ['ひまわり', 'たんぽぽ', 'あさがお', 'どんぐり'],
  project: [],}),
  methods: {
  InsertSubmit: function (project) {
  db.collection('projects').add({
    Amoney: this.project.Amoney,
    name: this.project.name,
    team: this.project.team,
}).then(function() {
    console.log("Document successfully written!");
    
    
})
this.$router.push("/projects")
    }
    }  
}  

</script>
<style>
</style>
