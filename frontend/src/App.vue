<template>
  <v-app>
    <v-main>
      <router-view />
      <v-bottom-navigation >
        <v-btn to="/utenti" :disabled="!state.ready">
          <v-icon>mdi-account</v-icon>
          <span>Utenti</span>
        </v-btn>
        <v-btn to="/ordini" :disabled="!state.ready">
          <v-icon>mdi-cart</v-icon>
          <span>Ordini</span>
        </v-btn>
        <v-btn to="/prodotti" :disabled="!state.ready">
          <v-icon>mdi-food</v-icon>
          <span>Prodotti</span>
        </v-btn>
        <v-btn to="/categorie" :disabled="!state.ready">
          <v-icon>mdi-tag</v-icon>
          <span>Categorie</span>
        </v-btn>
        <v-btn to="/coupons" :disabled="!state.ready">
          <v-icon>mdi-ticket-percent</v-icon>
          <span>Coupons</span>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>

import {onMounted, ref} from "vue";
  import router from "./router";
  import {useStore} from "./plugins/state";
  let state = ref({
    ready: false
  })
  onMounted(() => {
    state.value = useStore();
    console.log(state.value.ready)
    if (state.value.ready===false){
      router.push('/')
    }
  })
</script>
