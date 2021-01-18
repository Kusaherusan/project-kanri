<template>

    <v-container>
    
                
 <!-- <v-text-field append-icon="search" label="Search" single-line hide-details v-model="search"></v-text-field> -->
    <v-data-table
      :headers="headers"
      :items="projects"
      item-key="id"
    >
    <template v-slot:top>
    
      <v-toolbar-title>プロジェクト達</v-toolbar-title>
     <v-col class="text-right">
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
      <v-icon dark>
        mdi-plus
      </v-icon>
      </v-btn>
         </template>
    <span>プロジェクトを追加する</span>
</v-tooltip>
     </v-col>
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
                      :items="[
                        { label: 'all', value: null },
                        { label: 'ひまわり', value: 'ひまわり' },
                        { label: 'たんぽぽ', value: 'たんぽぽ' },
                        { label: 'あさがお', value: 'あさがお' },  
                        { label: 'どんぐり', value: 'どんぐり' },                      
                      ]"
                      v-model="teamFilterValue"
                    ></v-select>
                  </v-col>
                  <!-- <v-col cols="3" class="pa-1">
                    <v-select
                      label="公開"
                      name="is_open"
                      item-text="label"
                      item-value="value"
                      :items="[
                        { label: '-', value: null },
                        { label: '公開中', value: true },
                        { label: '未公開', value: false },
                      ]"
                      v-model="model.is_open"
                      @change="loadList"
                    ></v-select>
                  </v-col> -->
                </v-row>
                <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="headline">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
     
    </template>
     <template v-slot:[`item.actions`]="{ item }">
      <v-btn
        icon
        :to="'/projects/' + item.id"
        nuxt
           
      >
        <v-icon dark>
          mdi-pencil
        </v-icon>
      </v-btn>
      <v-icon
        
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
      </v-data-table>

<!-- <v-row>
      <v-col>
        <h2>テスト用にオブジェクトの状態を表示する</h2>
        nameFilterValue<pre>{{nameFilterValue}}</pre>
        teamFilterValue<pre>{{teamFilterValue}}</pre>
        search<pre>{{ projects }}</pre>
      </v-col>
    </v-row> -->
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
  nameFilterValue: '',
  teamFilterValue: null,
  dialogDelete: false,
  // projects: getAllDocs(),
      }},
  computed: {
  // projects: [],
  headers() {
        return [
          {
            text: 'プロジェクトID',
            value: 'bango',
          },          {
            text: 'プロジェクト名',
            value: 'name',
            filter: this.nameFilter,
          },
            {
            text: 'プロジェクトランク',
            value: 'rank',
          },
            {
            text: 'チーム名',
            value: 'team',    
            filter: this.teamFilter,        
          },
            {
            text: '工程',
            value: 'phase',            
          },          
            {
            text: '進捗率',
            value: 'progress-rate',            
          },                    
            {
            text: '工数消化率',
            value: 'man-hours-rate',            
          },                              
             {
            text: '操作',
            value: 'actions',
            sortable:false,
             },
          ]}},
  watch: {
      dialogDelete (val) {
        val || this.closeDelete()
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
        deleteItem (item) {
        db.collection('projects').doc(item.id).delete();
        this.dialogDelete = true
      },
       deleteItemConfirm () {
        this.projects.splice(this.editedIndex, 1)
        this.closeDelete()
      },
       closeDelete () {
        this.dialogDelete = false
      },

      }
}
  
// get all documents
async function getAllDocs() {
    let obj = [];
    let pjRef = db.collection('projects');
    const allSnapShot = await pjRef.get();
    allSnapShot.forEach(doc => {
      const pj = doc.data()
      pj.id = doc.id
      obj.push(pj);
    });
    return obj;
}
   </script>


<style scoped>

</style>
