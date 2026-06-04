<template>
  <section aria-labelledby="contact-heading">
    <h3 id="contact-heading" class="info-heading">Kontakt</h3>
    <IonCard color="light">
      <IonCardContent class="ion-no-padding">
        <IonItem v-if="phone" color="light" lines="full">
          <IonLabel color="medium">Telefon</IonLabel>
          <IonButton slot="end" fill="clear" size="small" :href="'tel:' + phone" color="primary">{{ phone }}</IonButton>
        </IonItem>
        <IonItem v-if="email" color="light" lines="full">
          <IonLabel color="medium">E-Mail</IonLabel>
          <IonButton slot="end" fill="clear" size="small" :href="'mailto:' + email" color="primary">{{ email }}</IonButton>
        </IonItem>
        <IonItem v-if="emergencyContact" color="light" lines="none" class="ion-align-items-start">
          <IonLabel color="medium">Notfallkontakt</IonLabel>
          <IonText slot="end" color="dark">{{ emergencyContact }}</IonText>
        </IonItem>
        <IonItem v-if="!hasAnyInfo" color="light" lines="none">
          <IonNote color="medium" class="ion-text-wrap">Keine Kontaktinformationen verf&uuml;gbar.</IonNote>
        </IonItem>
      </IonCardContent>
    </IonCard>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonCard, IonCardContent, IonItem, IonLabel, IonNote, IonText, IonButton } from '@ionic/vue';

const props = defineProps<{
  phone?: string | null;
  email?: string | null;
  emergencyContact?: string | null;
}>();

const hasAnyInfo = computed(() => props.phone || props.email || props.emergencyContact);
</script>

<style scoped>
</style>
