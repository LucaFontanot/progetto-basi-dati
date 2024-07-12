<script setup lang="ts">
import {onMounted, ref} from "vue";
import {delOrder, getOrdersList, orderStats, ricevuta} from "../plugins/api";
const tab = ref("ordini");

const totalItems = ref(0)
const loading = ref(true)
const search = ref('')
const serverItems = ref([])

const headers = [
  { title: 'Id', key: 'id', sortable: false },
  { title: 'Data di ordine', key: 'data_ordine', sortable: false },
  { title: 'Spesa totale', key: 'spesa_totale', sortable: false },
  { title: 'Utente', key: 'utente', sortable: false },
  { title: 'Ricevura', key: 'ricevuta', sortable: false},
  { title: 'Azioni', key: 'actions', sortable: false }
]
async function loadItems(options) {
  loading.value = true
  let u = await getOrdersList(options);
  serverItems.value = u.orders;
  totalItems.value = u.count;
  loading.value = false
}
async function deleteOrder(id){
  if(!confirm("Sei sicuro di voler eliminare questo ordine?")) return
  await delOrder(id)
  loadItems({page: 1, itemsPerPage: 50, search: search.value})
}
const ricevuta_data = ref({
  items: [],
  open: false,
  nome: ''
})
async function viewRicevuta(id){
  let r = await ricevuta(id);
  ricevuta_data.value.items = r;
  ricevuta_data.value.open = true
  ricevuta_data.value.nome = id;
}
const stats = ref([]);
onMounted(async () =>{
  stats.value = await orderStats();
})
</script>

<template>
  <v-dialog v-model="ricevuta_data.open" max-width="800">
    <v-card>
      <v-card-title class="text-center">
        Ricevuta dell'ordine {{ricevuta_data.nome}}
      </v-card-title>
      <v-card-text>
        <table class="text-center" style="width:100%">
          <tr>
            <th>Prodotto</th>
            <th>Prezzo</th>
            <th>Iva</th>
            <th>Quantità</th>
            <th>Sconto</th>
          </tr>
          <tr v-for="item in ricevuta_data.items">
            <td>{{item.prodotto}} - {{item.nome}}</td>
            <td>{{item.prezzo}}€</td>
            <td>{{item.iva}}%</td>
            <td>{{item.quantita}}</td>
            <td v-if="item.sconto !==null">{{item.sconto}}€ ({{item.coupon}})</td>
            <td v-else>0€</td>
          </tr>
        </table>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="ricevuta_data.open = false">Chiudi</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-card class="pa-10 ma-10">
    <v-tabs
      v-model="tab"
      align-tabs="center"
    >
      <v-tab value="ordini">Ordini</v-tab>
      <v-tab value="fatturato">Fatturato</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        value="ordini"
      >
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
          <template v-slot:item.ricevuta="{ item }">
            <v-btn @click="viewRicevuta(item.id)" variant="flat" prepend-icon="mdi-eye">
              Visualizza ricevuta
            </v-btn>
          </template>
          <template v-slot:item.actions="{ item }">
            <v-btn @click="deleteOrder(item.id)" icon variant="flat">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table-server>
      </v-tabs-window-item>
      <v-tabs-window-item
        value="fatturato">
        <v-list>
          <v-list-item v-for="item in stats" :key="item.mese">
            <v-list-item-title>
              {{item.fatturato}}€
            </v-list-item-title>
            <v-list-item-subtitle>
              Anno: {{item.anno}} - Mese: {{item.mese}}
            </v-list-item-subtitle>
          </v-list-item>
        </v-list>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<style scoped>

</style>
