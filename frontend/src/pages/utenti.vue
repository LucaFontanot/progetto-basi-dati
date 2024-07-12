<script setup lang="ts">
import {ref} from "vue";
import {delUser, getCoupons, getOrders, getUsers} from "../plugins/api";

const totalItems = ref(0)
const loading = ref(true)
const search = ref('')
const serverItems = ref([])

const headers = [
  { title: 'Id', key: 'id', sortable: false },
  { title: 'Email', key: 'email', sortable: false },
  { title: 'Nome', key: 'nome', sortable: false },
  { title: 'Cognome', key: 'cognome', sortable: false },
  { title: 'Registrazione', key: 'registrazione', sortable: false},
  { title: "Ordini effettuati", key:"ordini", sortable: false},
  { title: "Coupons usati",key:"coupons", sortable: false},
  { title: 'Azioni', key: 'actions', sortable: false }
]
async function loadItems(options) {
  loading.value = true
  let u = await getUsers(options);
  serverItems.value = u.users;
  totalItems.value = u.count;
  loading.value = false
}
const coupons_data = ref({
  items: [],
  open: false,
  nome: ''
})
async function coupons(id){
  coupons_data.value.items = await getCoupons(id)
  coupons_data.value.nome = id;
  coupons_data.value.open = true
}
const orders_data = ref({
  items: [],
  open: false,
  nome: ''
})
async function orders(id){
  orders_data.value.items = await getOrders(id)
  orders_data.value.nome = id;
  orders_data.value.open = true
}
async function deleteAcc(id){
  if(!confirm("Sei sicuro di voler eliminare questo utente?")) return
  await delUser(id)
  loadItems({page: 1, itemsPerPage: 50, search: search.value})
}
</script>

<template>
  <v-dialog v-model="orders_data.open" max-width="600">
    <v-card>
      <v-card-title class="text-center">
        Ci sono {{orders_data.items.length}} ordini effettuati da {{orders_data.nome}}
      </v-card-title>
      <v-card-text>
        <table style="width:100%" class="text-center">
          <tr>
            <th>Id ordine</th>
            <th>Data ordine</th>
            <th>Spesa totale</th>
          </tr>
          <tr v-for="item in orders_data.items" :key="item.id">
            <td>{{item.id}}</td>
            <td>{{item.data_ordine}}</td>
            <td>{{item.spesa_totale}}</td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="orders_data.open = false">Chiudi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="coupons_data.open" max-width="600">
    <v-card>
      <v-card-title class="text-center">
        Ci sono {{coupons_data.items.length}} coupons usati da {{coupons_data.nome}}
      </v-card-title>
      <v-card-text>
        <v-list>
          <v-list-item v-for="item in coupons_data.items" :key="item.coupon">
            <v-list-item-title>
              {{item.coupon}}
            </v-list-item-title>
          </v-list-item>
        </v-list>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="coupons_data.open = false">Chiudi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
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
      <template v-slot:item.ordini="{ item }">
        <v-btn @click="orders(item.id)" variant="flat" prepend-icon="mdi-eye">
          Apri ordini
        </v-btn>
      </template>
      <template v-slot:item.coupons="{ item }">
        <v-btn @click="coupons(item.id)" variant="flat" prepend-icon="mdi-eye">
          Apri coupons
        </v-btn>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-btn @click="deleteAcc(item.id)" icon variant="flat">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </template>
    </v-data-table-server>
  </v-card>
</template>

<style scoped>

</style>
