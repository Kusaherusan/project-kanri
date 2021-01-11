<template>
  <div class="container">
     <h3>{{ project.id }}</h3>
    <h3>{{ project.name }}</h3>
    <h4>ちーむ：{{ project.team }}</h4>
    <div>
    <!--
    受注金額：
    <div class="ui input">   
    <input v-model="project.Amoney" placeholder="edit me">
    </div>
    円
</div> -->


    <v-text-field label="受注金額" v-model="project.Amoney"></v-text-field>
  </div>
<br>
      <!-- <NuxtLink to="/projects">
        List of Projects
      </NuxtLink> -->

  <!-- <button class="ui primary button" @click="UpdateSubmit(project)">
          Update
             </button>
   -->
<v-btn
  elevation="2" 
  @click="UpdateSubmit(project)"
>Update</v-btn>


  <!-- <button v-on:click="UpdateSubmit">Update</button> -->

  </div>
  
</template>

<script>
import db from "~/plugins/firebase";

export default {
  async asyncData({params}) {    
     const  colproject  = await getOneDocs(params.id)
    return { project : colproject }
  },
  head () {
    return {
      // title: this.post.title
    }
  },
//   methods: {
//     UpdateSubmit: function (project) {
//       // メソッド内の `this` は、 Vue インスタンスを参照します
// db.collection('projects').doc(this.project.id).set({
//     Amoney: this.project.Amoney,

// })
  methods: {
    UpdateSubmit: function (project) {
      // メソッド内の `this` は、 Vue インスタンスを参照します
// db.collection('projects').doc(this.project.id).set({
  db.collection('projects').doc(this.$route.params.id).set({
  
    Amoney: this.project.Amoney,
    name: this.project.name,
    team: this.project.team,
}).then(function() {
    console.log("Document successfully written!");
})
// .then(function() {
//     console.log("Document successfully written!");
// })
// .catch(function(error) {
//     console.error("Error writing document: ", error);
// });
    }}  
}  
// get all documents
async function getOneDocs(params) {
    let pjID = String(params)
    let oneProject = {};
    let OnepjRef = db.collection('projects').doc(pjID);
    const allSnapShot = await OnepjRef.get()
      .then(doc => { oneProject = doc.data()})
    return oneProject
}



   


</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
</style>
