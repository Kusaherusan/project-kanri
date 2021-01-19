<template>
  <div class="container">
    <h3>{{ project.id }}</h3>
    <h3>{{ project.name }}</h3>
    <h4>ちーむ：{{ project.team }}</h4>
    <div>
      <v-text-field label="受注金額" v-model="project.Amoney"></v-text-field>
    </div>
    <br />
    <v-btn elevation="2" @click="UpdateSubmit(project)">Update</v-btn>
    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script>
import db from "~/plugins/firebase";

export default {
  async asyncData({ params }) {
    const colproject = await getOneDocs(params.id);
    return { project: colproject };
  },
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
    };
  },

  methods: {
    UpdateSubmit: function (project) {
      // メソッド内の `this` は、 Vue インスタンスを参照します
      // db.collection('projects').doc(this.project.id).set({
      db.collection("projects").doc(this.$route.params.id).set({
        Amoney: this.project.Amoney,
        name: this.project.name,
        team: this.project.team,
      });
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "更新できたよ（多分ね）";
      // .then(function () {
      // this.snack = true
      // this.snackColor = 'success'
      // this.snackText = 'Data saved'
      // console.log("Document successfully written!");
      // });
    },
    // save: function () {
    //     this.snack = true
    //     this.snackColor = 'success'
    //     this.snackText = 'Data saved'
    //   }
  },
};
// get all documents
async function getOneDocs(params) {
  let pjID = String(params);
  let oneProject = {};
  let OnepjRef = db.collection("projects").doc(pjID);
  const allSnapShot = await OnepjRef.get().then((doc) => {
    oneProject = doc.data();
  });
  return oneProject;
}
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
</style>
