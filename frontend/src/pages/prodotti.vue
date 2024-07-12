<script setup lang="ts">
import {onMounted, ref} from "vue";
import {delProd, getProducts} from "../plugins/api";

const totalItems = ref(0)
const loading = ref(true)
const search = ref('')
const serverItems = ref([])
const headers = [
  { title: 'Id', key: 'id', sortable: false },
  { title: 'Nome', key: 'nome', sortable: false },
  { title: 'Prezzo', key: 'prezzo', sortable: false },
  { title: 'Iva', key: 'iva', sortable: false },
  { title: 'Categoria', key: 'categoria', sortable: false},
  { title: "ID Categoria", key:"cid", sortable: false},
  { title: 'Azioni', key: 'actions', sortable: false }
]
async function loadItems(options) {
  loading.value = true
  let u = await getProducts(options);
  serverItems.value = u.products;
  totalItems.value = u.count;
  loading.value = false
}

async function deleteProd(id){
  if(!confirm("Sei sicuro di voler eliminare questo utente?")) return
  await delProd(id)
  loadItems({page: 1, itemsPerPage: 50, search: search.value})
}

</script>

<template>

  <v-card class="pa-10 ma-10">
    <v-text-field
      v-model="search"
      label="Cerca ID"
      append-icon="mdi-magnify"
      single-line
      hide-details
    ></v-text-field>
    <v-data-table-server
      items-per-page="20"
      :items="serverItems"
      :items-length="totalItems"
      :loading="loading"
      :search="search"
      item-value="name"
      :headers="headers"
      @update:options="loadItems"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn @click="deleteProd(item.id)" icon variant="flat">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>
