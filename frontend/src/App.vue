<template>
  <IonApp>
    <AppMenu />
    <IonRouterOutlet id="main-content" />
  </IonApp>
</template>

<script setup lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import AppMenu from '@/components/organisms/AppMenu.vue';
</script>
