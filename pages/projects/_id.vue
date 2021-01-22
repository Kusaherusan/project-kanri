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
    UpdateSubmit: async function() {
         await setProject(this.$route.params.id,this.project)
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "更新できたよ";
    },
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
async function setProject(id,project) {
  await db.collection("projects").doc(id).set({
        Amoney: project.Amoney,
        name: project.name,
        team: project.team,
  });
}
</script>

<style scoped>
.container {
  text-align: center;
  margin-top: 100px;
  font-family: sans-serif;
}
</style>
