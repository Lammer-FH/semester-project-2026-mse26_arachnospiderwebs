<template>
  <div class="step-review">
    <h2 class="step-title">Buchung &uuml;berpr&uuml;fen</h2>
    <p class="step-description">Bitte &uuml;berpr&uuml;fe alle Angaben vor der Best&auml;tigung.</p>

    <IonCard v-if="store.error" color="danger" class="ion-margin-bottom">
      <IonCardContent class="ion-no-padding">
        <IonItem color="danger" lines="none">
          <IonIcon :icon="alertCircleOutline" slot="start" />
          <IonLabel>{{ store.error }}</IonLabel>
        </IonItem>
      </IonCardContent>
    </IonCard>

    <div class="booking-summary">
      <section class="summary-section">
        <div class="summary-section-header">
          <h3>Buchungszeitraum</h3>
          <IonButton size="small" fill="outline" color="medium" :disabled="store.submitting" @click="editRoom">
            <IonIcon :icon="createOutline" slot="start" />
            Bearbeiten
          </IonButton>
        </div>
        <div class="summary-section-body">
          <IonItem lines="full">
            <IonLabel color="medium">Anreise</IonLabel>
            <IonText slot="end" color="dark">{{ formatDate(draft.checkIn) }}</IonText>
          </IonItem>
          <IonItem lines="full">
            <IonLabel color="medium">Abreise</IonLabel>
            <IonText slot="end" color="dark">{{ formatDate(draft.checkOut) }}</IonText>
          </IonItem>
          <IonItem lines="none">
            <IonLabel color="medium">N&auml;chte</IonLabel>
            <IonText slot="end" color="dark">{{ draft.nights }}</IonText>
          </IonItem>
        </div>
      </section>

      <section class="summary-section">
        <div class="summary-section-header">
          <h3>Zimmer</h3>
          <IonButton size="small" fill="outline" color="medium" :disabled="store.submitting" @click="editRoom">
            <IonIcon :icon="createOutline" slot="start" />
            Bearbeiten
          </IonButton>
        </div>
        <div class="summary-section-body">
          <IonItem lines="none">
            <IonThumbnail slot="start" class="summary-thumbnail">
              <IonImg :src="draft.roomImage" :alt="draft.roomTitle" />
            </IonThumbnail>
            <IonLabel>
              <p class="ion-text-wrap">
                <strong>{{ draft.roomTitle }}</strong>
              </p>
              <p class="ion-text-wrap">{{ formatPrice(draft.pricePerNight) }} / Nacht</p>
              <p v-if="draft.roomDescription" class="ion-text-wrap review-desc">{{ draft.roomDescription }}</p>
            </IonLabel>
          </IonItem>
          <div v-if="draft.extras.length" class="extras-row">
            <ExtraChip
              v-for="extra in draft.extras"
              :key="extra.id"
              :name="extra.name"
              :icon="extra.icon"
            />
          </div>
        </div>
      </section>

      <section class="summary-section">
        <div class="summary-section-header">
          <h3>Gast</h3>
          <IonButton size="small" fill="outline" color="medium" :disabled="store.submitting" @click="editGuest">
            <IonIcon :icon="createOutline" slot="start" />
            Bearbeiten
          </IonButton>
        </div>
        <div class="summary-section-body">
          <IonItem lines="full">
            <IonLabel color="medium">Vorname</IonLabel>
            <IonText slot="end" color="dark">{{ draft.firstName }}</IonText>
          </IonItem>
          <IonItem lines="full">
            <IonLabel color="medium">Nachname</IonLabel>
            <IonText slot="end" color="dark">{{ draft.lastName }}</IonText>
          </IonItem>
          <IonItem lines="full">
            <IonLabel color="medium">E-Mail</IonLabel>
            <IonText slot="end" color="dark">{{ draft.email }}</IonText>
          </IonItem>
          <IonItem lines="none">
            <IonLabel color="medium">Fr&uuml;hst&uuml;ck</IonLabel>
            <IonText slot="end" color="dark">{{ draft.breakfast ? 'Ja' : 'Nein' }}</IonText>
          </IonItem>
        </div>
      </section>

      <section class="summary-section review-total">
        <h3>Gesamtpreis</h3>
        <p class="total-price">{{ formatPrice(draft.totalPrice) }}</p>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useBookingStore } from '@/stores/bookingStore';
import { IonCard, IonCardContent, IonItem, IonLabel, IonIcon, IonButton, IonThumbnail, IonImg, IonText } from '@ionic/vue';
import { alertCircleOutline, createOutline } from 'ionicons/icons';
import ExtraChip from '@/components/molecules/ExtraChip.vue';

const store = useBookingStore();
const router = useRouter();
const draft = store.draft;

function editGuest() {
  store.setStep(0);
}

function editRoom() {
  router.push('/rooms');
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(price);
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  return new Intl.DateTimeFormat('de-AT', { dateStyle: 'medium' }).format(new Date(dateStr));
}
</script>

<style scoped>
</style>
