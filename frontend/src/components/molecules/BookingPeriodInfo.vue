<template>
  <section aria-labelledby="period-heading">
    <h3 id="period-heading" class="info-heading">Buchungszeitraum</h3>
    <IonCard color="light">
      <IonCardContent class="ion-no-padding">
        <IonItem color="light" lines="full">
          <IonLabel color="medium">Anreise</IonLabel>
          <IonText slot="end" color="dark" data-testid="check-in">{{ formatDate(checkIn) }}</IonText>
        </IonItem>
        <IonItem color="light" lines="full">
          <IonLabel color="medium">Abreise</IonLabel>
          <IonText slot="end" color="dark" data-testid="check-out">{{ formatDate(checkOut) }}</IonText>
        </IonItem>
        <IonItem color="light" lines="none">
          <IonLabel color="medium">N&auml;chte</IonLabel>
          <IonText slot="end" color="dark" data-testid="nights">{{ nights }}</IonText>
        </IonItem>
      </IonCardContent>
    </IonCard>
  </section>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonItem, IonLabel, IonText } from '@ionic/vue';

defineProps<{
  checkIn: string;
  checkOut: string;
  nights: number;
}>();

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' }).format(new Date(dateStr));
}
</script>

<style scoped>
</style>
