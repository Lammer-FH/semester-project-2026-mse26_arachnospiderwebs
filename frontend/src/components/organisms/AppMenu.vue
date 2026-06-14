<template>
  <IonMenu content-id="main-content" menu-id="main-menu" type="overlay">
    <IonHeader>
      <IonToolbar color="primary">
        <IonTitle>Menü</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        <IonMenuToggle v-for="link in links" :key="link.path" :auto-hide="false">
          <IonItem button :router-link="link.path" lines="full" :detail="true">
            <IonLabel>{{ link.label }}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      </IonList>
    </IonContent>
  </IonMenu>
</template>

<script setup lang="ts">
import {
  IonMenu, IonHeader, IonToolbar, IonTitle, IonContent,
  IonList, IonItem, IonLabel, IonMenuToggle
} from '@ionic/vue';

interface NavLink {
  path: string;
  label: string;
}

const links: NavLink[] = [
  { path: '/home', label: 'Home' },
  { path: '/rooms', label: 'Zimmer' },
  { path: '/about', label: 'Über uns' },
  { path: '/imprint', label: 'Impressum' },
];
</script>
