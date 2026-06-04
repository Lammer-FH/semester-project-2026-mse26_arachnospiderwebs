<template>
  <section aria-labelledby="guest-heading">
    <h3 id="guest-heading" class="info-heading">Gast</h3>
    <IonCard color="light">
      <IonCardContent class="ion-no-padding">
        <IonItem color="light" lines="full">
          <IonLabel color="medium">Vorname</IonLabel>
          <IonText slot="end" color="dark" data-testid="guest-firstname">{{ firstName }}</IonText>
        </IonItem>
        <IonItem color="light" lines="full">
          <IonLabel color="medium">Nachname</IonLabel>
          <IonText slot="end" color="dark" data-testid="guest-lastname">{{ lastName }}</IonText>
        </IonItem>
        <IonItem color="light" lines="full">
          <IonLabel color="medium">E-Mail</IonLabel>
          <IonText slot="end" color="dark" data-testid="guest-email">{{ email }}</IonText>
        </IonItem>
        <IonItem color="light" lines="none">
          <IonLabel color="medium">Fr&uuml;hst&uuml;ck</IonLabel>
          <IonText slot="end" color="dark" data-testid="guest-breakfast">{{ breakfast ? 'Ja' : 'Nein' }}</IonText>
        </IonItem>
      </IonCardContent>
    </IonCard>
  </section>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonItem, IonLabel, IonText } from '@ionic/vue';

defineProps<{
  firstName: string;
  lastName: string;
  email: string;
  breakfast: boolean;
}>();
</script>

<style scoped>
</style>
