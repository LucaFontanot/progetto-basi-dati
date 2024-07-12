<script setup lang="ts">
import {onMounted, ref} from "vue";
import {couponStats, delCoupon, getCouponsList} from "../plugins/api";
const tab = ref("coupons");

const totalItems = ref(0)
const loading = ref(true)
const search = ref('')
const serverItems = ref([])

const headers = [
  { title: 'Codice', key: 'code', sortable: false },
  { title: 'Descrizione', key: 'descrizione', sortable: false },
  { title: 'Scadenza', key: 'scadenza', sortable: false },
  { title: 'Sconto', key: 'sconto', sortable: false },
  { title: 'Prodotto', key: 'prodotto', sortable: false},
  { title: 'Azioni', key: 'actions', sortable: false }
]
async function loadItems(options) {
  loading.value = true
  let u = await getCouponsList(options);
  serverItems.value = u.coupons;
  totalItems.value = u.count;
  loading.value = false
}
async function deleteCoupon(id){
  if(!confirm("Sei sicuro di voler eliminare questo coupon?")) return
  await delCoupon(id)
  loadItems({page: 1, itemsPerPage: 50, search: search.value})
}
const stats = ref({});
const periodo = ref("");
onMounted(async () =>{
  let serverStats = await couponStats();
  for (let i = 0; i < serverStats.length; i++){
    let key = "" + serverStats[i].anno + " - " + serverStats[i].mese;
    if (stats.value[key] ===undefined) stats.value[key] = [];
    if (periodo.value === "") periodo.value = key;
    stats.value[key].push(serverStats[i])
  }
})
</script>

<template>
  <v-card class="pa-10 ma-10">
    <v-tabs
      v-model="tab"
      align-tabs="center"
    >
      <v-tab value="coupons">Coupons</v-tab>
      <v-tab value="usage">Coupons più usati</v-tab>
    </v-tabs>
    <v-tabs-window v-model="tab">
      <v-tabs-window-item
        value="coupons"
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
          <template v-slot:item.actions="{ item }">
            <v-btn @click="deleteCoupon(item.code)" icon variant="flat">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </template>
        </v-data-table-server>
      </v-tabs-window-item>
      <v-tabs-window-item
        value="usage">
        <v-select
          v-model="periodo"
          :items="Object.keys(stats)"
          label="Seleziona periodo"
        ></v-select>
        <v-virtual-scroll height="500" :items="stats[periodo]">
          <template v-slot="{ item }">
            <v-list-item>
              <v-list-item-title>
                Coupon: {{item.coupon}}
              </v-list-item-title>
              <v-list-item-subtitle>
                Utilizzato: {{item.utilizzi}} volte
              </v-list-item-subtitle>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-tabs-window-item>
    </v-tabs-window>
  </v-card>
</template>

<style scoped>

</style>
