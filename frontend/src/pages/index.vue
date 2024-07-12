<template>
  <v-dialog v-model="mock.modal" persistent>
    <v-card :loading="true" >
      <v-card-title class="text-center">Inizializzazione del database</v-card-title>
      <v-card-text>
        <v-virtual-scroll
          :height="600"
          :items="mock.data"
        >
          <template v-slot:default="{ item }">
            > {{ item }}
          </template>
        </v-virtual-scroll>
      </v-card-text>
    </v-card>
  </v-dialog>
  <div class="d-flex justify-center">
    <v-card class="pa-10 ma-10" style="max-width: 800px" :loading="loading">
      <v-card-title class="text-center">Controllo sistema...</v-card-title>
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-row>
              <v-col cols="6">
                <h2>Sistema:</h2>
              </v-col>
              <v-col cols="6">
                <v-chip color="green" v-if="status.system">Online</v-chip>
                <v-chip color="red" v-else>Offline</v-chip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="6">
                <h2>Server SQL:</h2>
              </v-col>
              <v-col cols="6">
                <v-chip color="green" v-if="status.sql">Funzionante</v-chip>
                <v-chip color="red" v-else>Non funzionante</v-chip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="6">
                <h2>Database:</h2>
              </v-col>
              <v-col cols="6">
                <v-chip color="green" v-if="status.database">Pronto</v-chip>
                <v-chip color="red" v-else>Non pronto</v-chip>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <v-col cols="6">
                <h2>Dati:</h2>
              </v-col>
              <v-col cols="6">
                <v-chip color="green" v-if="status.tables">Pronto</v-chip>
                <v-chip color="red" v-else>Non pronto</v-chip>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
        <v-divider class="ma-3"></v-divider>
        <div v-if="!loading && (!status.database || !status.tables)" class="d-flex justify-center">
          <v-btn color="primary" @click="startMock">Inizializza il database</v-btn>
        </div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from "vue";
import {health, mockStart, mockStatus} from "../plugins/api";
import {useStore} from "../plugins/state";

let state = {};
let status = ref({
  system: false,
  sql: false,
  database: false,
  tables: false
})
let loading = ref(true)
let mock = ref({
  modal: false,
  data: []
})

async function sleep(ms){
  return new Promise(resolve => setTimeout(resolve, ms))
}
async function startMock(){
  mock.value.modal = true
  await mockStart();
  // eslint-disable-next-line no-constant-condition
  while (true){
    let data = await mockStatus();
    if (data[mock.value.data.length-1]==="ENDED"){
      mock.value.modal = false;
      status.value = await health();
      if (status.value.tables===true){
        state.ready = true;
      }
      break;
    }
    mock.value.data = data.reverse();
    await sleep(500)
  }
}


onMounted(async () => {
  state = useStore();
  status.value = await health()
  loading.value = false
  if (status.value.tables===true){
    state.ready = true;
  }
})
</script>
