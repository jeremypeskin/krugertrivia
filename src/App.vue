<script setup>
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
  <div class="navbar-with-logo">
    <router-link to="/">
      <img
        height="80"
        src="@/assets/krugerkidslogo.png"
        alt="Logo"
        class="logo"
      />
    </router-link>
  </div>
  <RouterView />
</template>

<style scoped>
.navbar-with-logo {
  display: flex;
  justify-content: center;
  align-items: normal;
  padding: 1rem;
}
</style>
