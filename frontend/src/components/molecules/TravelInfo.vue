<template>
  <section aria-labelledby="travel-heading">
    <h3 id="travel-heading" class="info-heading">Anreise mit &ouml;ffentlichen Verkehrsmitteln</h3>
    <IonCard color="light">
      <IonCardContent class="ion-no-padding">
        <IonItem v-if="publicTransport" color="light" lines="full" class="ion-align-items-start">
          <IonLabel color="medium">&Ouml;ffentliche Verkehrsmittel</IonLabel>
          <IonText slot="end" color="dark">{{ publicTransport }}</IonText>
        </IonItem>
        <IonItem v-if="trainStation" color="light" lines="full">
          <IonLabel color="medium">N&auml;chster Bahnhof</IonLabel>
          <IonText slot="end" color="dark">{{ trainStation }}</IonText>
        </IonItem>
        <IonItem v-if="travelTips" color="light" lines="none" class="ion-align-items-start">
          <IonLabel color="medium">Reisetipps</IonLabel>
          <IonText slot="end" color="dark">{{ travelTips }}</IonText>
        </IonItem>
        <IonItem v-if="!hasAnyInfo" color="light" lines="none">
          <IonNote color="medium" class="ion-text-wrap">Keine Reiseinformationen verf&uuml;gbar.</IonNote>
        </IonItem>
      </IonCardContent>
    </IonCard>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonCard, IonCardContent, IonItem, IonLabel, IonNote, IonText } from '@ionic/vue';

const props = defineProps<{
  publicTransport?: string | null;
  trainStation?: string | null;
  travelTips?: string | null;
}>();

const hasAnyInfo = computed(() => props.publicTransport || props.trainStation || props.travelTips);
</script>

<style scoped>
</style>
