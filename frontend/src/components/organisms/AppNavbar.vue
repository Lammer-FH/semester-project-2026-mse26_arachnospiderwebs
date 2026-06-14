<template>
  <IonHeader>
    <IonToolbar color="primary">
      <IonButtons slot="start">
        <IonMenuButton v-if="showMenu" menu="main-menu" class="menu-btn" />
        <IonBackButton v-else default-href="/rooms" />
      </IonButtons>
      <IonTitle>
        <router-link to="/home" class="brand-link">Boutique Hotel Technikum</router-link>
      </IonTitle>
      <IonButtons slot="end" class="nav-links">
        <IonButton router-link="/home" fill="clear" color="light">Home</IonButton>
        <IonButton router-link="/rooms" fill="clear" color="light">Zimmer</IonButton>
        <IonButton router-link="/about" fill="clear" color="light">Über uns</IonButton>
      </IonButtons>
    </IonToolbar>
  </IonHeader>
</template>

<script setup lang="ts">
import {
  IonHeader, IonToolbar, IonTitle, IonButtons,
  IonButton, IonBackButton, IonMenuButton
} from '@ionic/vue';

withDefaults(defineProps<{ showMenu?: boolean }>(), { showMenu: true });
</script>

<style scoped>
.brand-link {
  font-weight: 600;
  text-decoration: none;
}
.nav-links {
  display: none;
}
@media (min-width: 768px) {
  .nav-links {
    display: flex;
  }
  .menu-btn {
    display: none;
  }
}
</style>
