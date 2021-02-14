<template>
  <v-content>
    <v-row class="py-5">
      <v-btn elevation="4" to="/projects" nuxt> 一覧へ戻る </v-btn>
      <v-spacer></v-spacer>
      <v-btn elevation="4" dark color="blue" @click="UpdateSubmit(project)"
        >Update</v-btn
      >
    </v-row>
    <br />
    <v-row>
      <v-col sm="6" md="1">
        <v-text-field
          label="プロジェクトID"
          v-model="editProject.bango"
        ></v-text-field>
      </v-col>
      <v-col sm="4" md="4">
        <v-text-field
          label="プロジェクト名"
          v-model="editProject.name"
        ></v-text-field>
      </v-col>
      <v-col sm="4" md="1">
        <v-text-field
          label="担当チーム"
          v-model="editProject.team"
        ></v-text-field>
      </v-col>
      <v-col sm="6" md="4">
        <v-text-field
          label="受注金額"
          v-model="editProject.Amoney"
        ></v-text-field>
      </v-col>
    </v-row>

    <v-snackbar v-model="snack" :timeout="3000" :color="snackColor">
      {{ snackText }}

      <template v-slot:action="{ attrs }">
        <v-btn v-bind="attrs" text @click="snack = false"> Close </v-btn>
      </template>
    </v-snackbar>
    <!-- <pre>{{ editProject }}</pre> -->
  </v-content>
</template>

<script>
import db from "~/plugins/firebase";

export default {
  async asyncData({ params }) {
    const colproject = await getOneDocs(params.id);
    return { editProject: colproject };
  },
  data() {
    return {
      snack: false,
      snackColor: "",
      snackText: "",
      editProject:{},
    };
  },

  methods: {
    UpdateSubmit: async function () {
      await setProject(this.$route.params.id, this.editProject);
      this.snack = true;
      this.snackColor = "success";
      this.snackText = "更新できたよ";
    },
  },
};
// get one documents
async function getOneDocs(params) {
  let pjID = String(params);
  let oneProject = {};
  let OnepjRef = db.collection("projects").doc(pjID);
  const allSnapShot = await OnepjRef.get().then((doc) => {
    oneProject = doc.data();
  });
  return oneProject;
}
async function setProject(id, editProject) {
  await db.collection("projects").doc(id).set({
    Amoney: editProject.Amoney,
    name: editProject.name,
    team: editProject.team,
    bango: editProject.bango,
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
