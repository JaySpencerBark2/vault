<template>
  <v-app>
    <v-app-bar v-if="currentUser" flat>
      <v-btn to="/dashboard">Dashboard</v-btn>
      <v-btn to="/group-vaults">Group Vaults</v-btn>
      <v-btn v-if="currentUser.admin" to="/users">Users</v-btn>
      <v-btn v-if="currentUser.admin" to="/groups">Groups</v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="logout">Logout</v-btn>
    </v-app-bar>
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import globalFunctions from '@/classes/globalFunctions.js'

const currentUser = ref(null)
const route = useRoute()

async function refreshUser() {
  if (route.path === '/login') {
    currentUser.value = null
    return
  }
  currentUser.value = await globalFunctions.getCurrentLoggedInUser()
}

watch(() => route.path, refreshUser, { immediate: true })

async function logout() {
  await fetch('http://localhost:3000/login/logout', {
    method: 'POST',
    credentials: 'include',
  })
  currentUser.value = null
  window.location.href = '/login'
}
</script>
