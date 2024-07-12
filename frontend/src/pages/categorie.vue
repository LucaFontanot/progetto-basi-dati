<script setup lang="ts">
import {onMounted, ref} from "vue";
import {delCat, getCategories, profilation, profilationUpdate} from "../plugins/api";

const items = ref([])
async function getData(){
  let categorie = await getCategories();
  for (let i = 0; i < categorie.length; i++){
    categorie[i].children = []
    categorie[i].title = "" + categorie[i].id + " - " + categorie[i].nome;
  }
  // eslint-disable-next-line no-constant-condition
  while(true){
    let atLeastOneChild = false;
    for (let i = 0; i < categorie.length; i++){
      if (categorie[i].padre !== null){
        atLeastOneChild = true;
        for (let j = 0; j < categorie.length; j++){
          if (categorie[j].id === categorie[i].padre){
            categorie[j].children.push(categorie[i])
            break;
          }
        }
        categorie.splice(i, 1)
        i--;
      }
    }
    if (!atLeastOneChild) break;
  }
  let scanner = function (scan){
    for (let i = 0; i < scan.length; i++){
      if (scan[i].children.length === 0){
        delete scan[i].children;
      }else{
        scanner(scan[i].children)
      }
    }
  }
  scanner(categorie)
  items.value = categorie;
}
onMounted(async () =>{
  getData()
})
async function deleteCat(id){
  if(!confirm("Sei sicuro di voler eliminare questa categoria?")) return
  await delCat(id)
  getData()
}
const profilation_data = ref({
  items: [],
  open: false,
  nome: ''
})
async function openProfilation(id){
  profilation_data.value.items = await profilation(id)
  profilation_data.value.nome = id;
  profilation_data.value.open = true
}

</script>

<template>
  <v-dialog v-model="profilation_data.open" max-width="1000">
    <v-card>
      <v-card-title class="text-center">
        Ci sono {{profilation_data.items.length}} utenti profilati per questa categoria
      </v-card-title>
      <v-card-text>
        <table class="text-center" style="width:100%">
          <tr>
            <th>Utente</th>
            <th>Email</th>
            <th>Data</th>
          </tr>
          <tr v-for="item in profilation_data.items">
            <td>{{item.utente}}</td>
            <td>{{item.email}}</td>
            <td>{{item.data}}</td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="profilation_data.open = false">Chiudi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card class="pa-10 ma-10">
    <div class="text-center">
      <v-btn @click="profilationUpdate" class="mb-4" color="primary">Aggiorna profilazione</v-btn>
    </div>
    <v-treeview :items="items">
      <template v-slot:append="{ item }">
        <v-btn @click="openProfilation(item.id)" variant="flat" class="mr-4" prepend-icon="mdi-eye">
          Apri profilazione
        </v-btn>
        <v-btn @click="deleteCat(item.id)" icon variant="flat" class="mr-4">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-treeview>
  </v-card>
</template>

<style scoped>

</style>
