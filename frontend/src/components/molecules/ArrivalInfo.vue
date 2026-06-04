<template>
  <section aria-labelledby="arrival-heading">
    <h3 id="arrival-heading" class="info-heading">Anreise</h3>
    <IonCard color="light">
      <IonCardContent class="ion-no-padding">
        <IonItem color="light" lines="full">
          <IonLabel color="medium">Adresse</IonLabel>
          <IonText slot="end" color="dark"><address class="info-address">{{ address }}</address></IonText>
        </IonItem>
        <IonItem v-if="directions" color="light" lines="full">
          <IonLabel color="medium">Anfahrt</IonLabel>
          <IonText slot="end" color="dark">{{ directions }}</IonText>
        </IonItem>
        <IonItem v-if="parkingInfo" color="light" lines="full">
          <IonLabel color="medium">Parken</IonLabel>
          <IonText slot="end" color="dark">{{ parkingInfo }}</IonText>
        </IonItem>
        <IonItem v-if="checkInTime" color="light" lines="full">
          <IonLabel color="medium">Check-in</IonLabel>
          <IonText slot="end" color="dark">{{ checkInTime }}</IonText>
        </IonItem>
        <IonItem v-if="checkOutTime" color="light" lines="full">
          <IonLabel color="medium">Check-out</IonLabel>
          <IonText slot="end" color="dark">{{ checkOutTime }}</IonText>
        </IonItem>
        <IonItem v-if="checkInInstructions" color="light" lines="none" class="ion-align-items-start">
          <IonLabel color="medium">Check-in Hinweise</IonLabel>
          <IonText slot="end" color="dark">{{ checkInInstructions }}</IonText>
        </IonItem>
      </IonCardContent>
    </IonCard>
  </section>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonItem, IonLabel, IonText } from '@ionic/vue';

defineProps<{
  address: string;
  directions?: string | null;
  parkingInfo?: string | null;
  checkInTime?: string | null;
  checkOutTime?: string | null;
  checkInInstructions?: string | null;
}>();
</script>

<style scoped>
.info-address {
  font-style: normal;
  display: inline;
}
</style>
