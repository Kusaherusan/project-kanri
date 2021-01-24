<template>
  <v-container>
    <!-- テーブルを指定 -->
    <v-data-table :headers="headers" :items="projects" item-key="id">
      <!-- テーブルの上部に指定 -->
      <template v-slot:top>
        <!-- タイトル -->
        <v-toolbar-title>プロジェクト達</v-toolbar-title>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-col class="text-right">
              <!-- <v-tooltip bottom　#activator="{ on> -->

              <v-btn
                class="mx-2"
                fab
                dark
                large
                color="cyan"
                v-bind="attrs"
                v-on="on"
              >
                <v-icon dark> mdi-plus </v-icon>
              </v-btn>

              <!-- インサートボタンにカーソルを合わせたときのメッセージ -->
              <!-- <span>プロジェクトを追加する</span>
          </v-tooltip> -->
            </v-col>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">プロジェクトを追加する</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field
                      v-model="editedItem.bango"
                      label="プロジェクトID"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="20" md="4">
                    <v-text-field
                      v-model="editedItem.name"
                      label="プロジェクト名"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-autocomplete
                      label="担当チーム"
                      v-model="editedItem.team"
                      :items="teams"
                    ></v-autocomplete>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                やめとく
              </v-btn>
              <v-btn color="blue darken-1" text @click="InsertSubmit">
                追加する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- インサートボタン -->
        <!-- <v-col class="text-right">
          <v-tooltip bottom>
            <template v-slot:activator="{ on }">
              <v-btn
                class="mx-2"
                fab
                dark
                large
                color="cyan"
                :to="'/insert'"
                nuxt
                v-on="on"
              >
                <v-icon dark> mdi-plus </v-icon>
              </v-btn>
            </template> -->
        <!-- インサートボタンにカーソルを合わせたときのメッセージ -->
        <!-- <span>プロジェクトを追加する</span>
          </v-tooltip>
        </v-col> -->
        <v-row class="px-2">
          <v-col cols="6" class="pa-1">
            <v-text-field
              type="text"
              label="プロジェクト名"
              v-model="nameFilterValue"
            ></v-text-field>
          </v-col>
          <v-col cols="3" class="pa-1">
            <v-select
              label="チーム名"
              item-text="label"
              item-value="value"
              :items="teams"
              v-model="teamFilterValue"
            ></v-select>
          </v-col>
        </v-row>
        <v-dialog v-model="dialogDelete" max-width="300px">
          <v-card>
            <v-card-title class="headline">ほんとに削除する？</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete"
                >やめとく</v-btn
              >
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >削除する
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-btn icon :to="'/projects/' + item.id" nuxt>
          <v-icon dark> mdi-pencil </v-icon>
        </v-btn>
        <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import db from "~/plugins/firebase";

export default {
  async asyncData() {
    return {
      projects: await getAllDocs(),
    };
  },
  data() {
    return {
      // Filter models.
      nameFilterValue: "",
      teamFilterValue: null,
      dialog: false,
      dialogDelete: false,
      editedItem: {
      bango: "",
      name: "",
      team: "",
      },
      teams: ["ひまわり", "たんぽぽ", "あさがお", "どんぐり"],
      
      // projects: [],
    };
  },
  computed: {
   
    headers() {
      return [
        {
          text: "プロジェクトID",
          value: "bango",
        },
        {
          text: "プロジェクト名",
          value: "name",
          filter: this.nameFilter,
        },
        {
          text: "プロジェクトランク",
          value: "rank",
        },
        {
          text: "チーム名",
          value: "team",
          filter: this.teamFilter,
        },
        {
          text: "工程",
          value: "phase",
        },
        {
          text: "進捗率",
          value: "progress-rate",
        },
        {
          text: "工数消化率",
          value: "man-hours-rate",
        },
        //         {
        //   text: "最終更新",
        //   value: "latestupdate",
        // },
        {
          text: "操作",
          value: "actions",
          sortable: false,
        },
      ];
    },
    
  },
  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },
  methods: {
    nameFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.nameFilterValue) {
        return true;
      }
      // Check if the current loop value (The project name)
      // partially contains the searched word.
      return value.toLowerCase().includes(this.nameFilterValue.toLowerCase());
    },
    /**
     * Filter for calories column.
     * @param value Value to be tested.
     * @returns {boolean}
     */
    teamFilter(value) {
      // If this filter has no value we just skip the entire filter.
      if (!this.teamFilterValue) {
        return true;
      }
      // Check if the current loop value (The teams value)
      // equals to the selected value at the <v-select>.
      return value === this.teamFilterValue;
    },
    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    deleteItem(item) {
      db.collection("projects").doc(item.id).delete();
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.projects.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
    },
    InsertSubmit: async function () {
      this.editedItem.time = new Date()
      await db
        .collection("projects")
        .add({
          bango: this.editedItem.bango,
          name: this.editedItem.name,
          team: this.editedItem.team,
          latestupdate:this.editedItem.time, 
          // latestupdate: new Date()
        })
        .then(function () {
          console.log("Document successfully written!");
        });
      this.projects.push(this.editedItem)
      this.close();
    },
  },
};

// get all documents
async function getAllDocs() {
  let obj = [];
  let pjRef = db.collection("projects");
  const allSnapShot = await pjRef.get();
  allSnapShot.forEach((doc) => {
    const pj = doc.data();
    pj.id = doc.id;
    // pj.latestupdate=pj.latestupdate.toDate();
    obj.push(pj);
  });
  return obj;
}
</script>


<style scoped>
</style>
