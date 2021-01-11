<template>

    <v-container>
      <h2>プロジェクト達</h2>
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
    
    <v-data-table
      :headers="headers"
      :items="projects"
      
    >
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
    </template>
      </v-data-table>

<!-- <v-row>
      <v-col>
        <h2>テスト用にオブジェクトの状態を表示する</h2>
        <pre>{{ headers }}</pre>
        <pre>{{ projects }}</pre>
      </v-col>
    </v-row> -->
    </v-container>

    
</template>

<script>
import db from "~/plugins/firebase";

export default {
  data: () => ({
  headers: [
          {
            text: 'プロジェクト名',
            value: 'name',
          },
                    {
            text: 'チーム名',
            value: 'team',
          },
                    {
            text: '操作',
            value: 'actions',
            sortable:false,
          },          
        ],
  projects: [],}),
       
  async asyncData() {    
    return { 

      projects: await getAllDocs(),
            
      
    };
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

    // <NuxtLink :to="{ name: 'projects-id', params: { id: project.id } }">
    //         {{ project.name }}
    //         </NuxtLink>
</script>


<style scoped>

</style>
