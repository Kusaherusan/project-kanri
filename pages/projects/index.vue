<template>
  <v-container>
    <!-- プロジェクト一覧表示 -->
    <v-data-table :headers="headers" :items="projects" item-key="id">
      <template v-slot:top>
        <!-- タイトル -->
        <v-toolbar-title>プロジェクト達</v-toolbar-title>
        <!-- インサート用ダイアログ
        v-model="dialog"　で表示非表示を制御 -->
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-col class="text-right">
              <!-- インサート用ダイアログを開くボタン -->
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
            </v-col>
          </template>

          <v-card>
            <v-card-title>
              <span class="headline">プロジェクトを追加する</span>
            </v-card-title>
            <!-- 入力フォーム -->
            <v-form v-model="isrtvalid" ref="isrtItem" lazy-validation>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.bango"
                        label="プロジェクトID"
                        :rules="bangoRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="20" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="プロジェクト名"
                        :rules="nameRules"
                        counter="30"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-autocomplete
                        label="担当チーム"
                        v-model="editedItem.team"
                        :rules="teamRules"
                        :items="teams"
                        required
                      ></v-autocomplete>
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-form>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- やめとくボタン -->
              <v-btn color="blue darken-1" text @click="close">
                やめとく
              </v-btn>
              <!-- インサート実行ボタン 
              入力エラーが無くなったときのみ、活性化-->
              <v-btn
                color="blue darken-1"
                :disabled="!isrtvalid"
                text
                @click="InsertSubmit"
              >
                追加する
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!-- 検索用エリア -->
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
        <!-- デリート用ダイアログエリア -->
        <v-dialog v-model="dialogDelete" max-width="300px">
          <v-card>
            <v-card-title class="headline">ほんとに削除する？</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <!-- やめとくボタン -->
              <v-btn color="blue darken-1" text @click="closeDelete"
                >やめとく</v-btn
              >
              <!-- 削除ボタン -->
              <v-btn color="blue darken-1" text @click="deleteItemConfirm"
                >削除する
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
      <!-- プロジェクト一覧オブジェクトの項目以外を表示するエリア -->
      <template v-slot:[`item.actions`]="{ item }">
        <!-- 編集画面へ遷移するボタン -->
        <v-btn icon :to="'/projects/' + item.id" nuxt>
          <v-icon dark> mdi-pencil </v-icon>
        </v-btn>
        <!-- デリート用ダイアログを表示するボタン -->
        <v-icon @click="deleteItem(item)"> mdi-delete </v-icon>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import db from "~/plugins/firebase";

export default {
  data() {
    return {
      nameFilterValue: "", // 検索用：プロジェクト名
      teamFilterValue: null, // 検索用：チーム名
      dialog: false, //　インサート画面表示フラグ
      dialogDelete: false, //　デリート画面表示フラグ
      isrtvalid: false, //　インサート画面のバリデーション状態フラグ
      deleteId: "", //　デリート時のプロジェクトキー情報一時退避エリア
      editedItem: {
        //　インサート画面の編集用エリア
        bango: "", //プロジェクトID
        name: "", //プロジェクト名
        team: "", //担当チーム
      },
      bangoRules: [
        //バリデーション：プロジェクトID
        (v) => !!v || "必須項目",
        (v) => /^\d{6}$/.test(v) || "6桁数字のみ",
      ],
      nameRules: [
        //バリデーション：プロジェクト名
        (v) => !!v || "必須項目",
        (v) => v.length <= 30 || "文字数オーバー",
      ],
      teamRules: [
        //バリデーション：担当チーム
        (v) => !!v || "必須項目",
      ],
      teams: [
        //担当チーム選択用リスト（別の場所に変えたい・・・）
        "ひまわり",
        "たんぽぽ",
        "あさがお",
        "どんぐり",
      ],
      projects: [], //プロジェクト一覧格納用エリア
    };
  },
  firestore: {
    //vuefireの機能で、FireStoreとprojectsオブジェクトを同期
    projects: db.collection("projects"),
  },
  computed: {
    headers() {
      //プロジェクト一覧のタイトル行
      return [
        {
          text: "プロジェクトID",
          value: "bango",
        },
        {
          text: "プロジェクト名",
          value: "name",
          filter: this.nameFilter, //プロジェクト名での検索用に設定（いまいち仕組みがわからない・・・）
        },
        {
          text: "プロジェクトランク",
          value: "rank",
        },
        {
          text: "担当チーム",
          value: "team",
          filter: this.teamFilter, //担当チームでの検索用に設定（いまいち仕組みがわからない・・・）
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
        //   text: "最終更新",　　//そのまま表示するとFireStoreのTimeStanp型になる。moment.jsなどで表示方法を変えたい。
        //   value: "latestupdate",
        // },
        {
          text: "操作", //編集ボタンとデリートボタン配置用エリア
          value: "actions",
          sortable: false,
        },
      ];
    },
  }, //https://vuetifyjs.com/ja/components/data-tables/#edit-dialog
  //参考にしたものにはついていた 下記のCRUD アクションのscript
  //なくても問題はなさそうなのでコメント化
  // watch: {
  //   dialog(val) {
  //     val || this.close();
  //   },
  //   dialogDelete(val) {
  //     val || this.closeDelete();
  //   },
  // },
  methods: {
    nameFilter(value) {
      if (!this.nameFilterValue) {
        return true;
      }
      // 検索欄（プロジェクト名）に入力があるとフィルター有効化
      return value.toLowerCase().includes(this.nameFilterValue.toLowerCase());
    },
    teamFilter(value) {
      if (!this.teamFilterValue) {
        return true;
      }
      // 検索欄（チーム欄）で何かを選択するとフィルター有効化
      return value === this.teamFilterValue;
    },
    close() {
      //インサート画面を閉じる。
      this.dialog = false;
    },
    deleteItem(item) {
      //対象のプロジェクトキーを保管
      //デリート画面を開く
      this.deleteId = item.id;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      //デリートを実行
      console.log(this.deleteId);
      db.collection("projects").doc(this.deleteId).delete();
      console.log("delete scuccse");
      this.closeDelete();
    },
    closeDelete() {
      //デリート画面を閉じる。
      this.dialogDelete = false;
      //デリート用プロジェクトキー初期化
      this.deleteId = "";
    },
    InsertSubmit: async function () {
      //インサート画面でインサート実行時に稼働。
      if (this.$refs.isrtItem.validate()) {
        // すべてのバリデーションが通過したときのみ
        // if文の中に入る
        this.editedItem.time = new Date();
        await db
          .collection("projects")
          .add({
            bango: this.editedItem.bango,
            name: this.editedItem.name,
            team: this.editedItem.team,
            latestupdate: this.editedItem.time,
          })
          .then(function () {
            console.log("insert success");
          });
        //インサート画面を閉じる。
        this.close();
      }
    },
  },
};
</script>


<style scoped>
</style>