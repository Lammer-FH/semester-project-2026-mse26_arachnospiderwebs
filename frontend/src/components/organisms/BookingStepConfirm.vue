<template>
  <div class="booking-confirmation">
    <div v-if="submitting" class="confirm-state confirm-state-loading">
      <IonSpinner name="crescent" size="large" />
      <p>Buchung wird erstellt...</p>
    </div>

    <div v-else-if="error" class="confirm-state confirm-state-error">
      <IonIcon name="close-circle" color="danger" size="large" />
      <h2>Buchung fehlgeschlagen</h2>
      <p>{{ error }}</p>
      <IonButton fill="outline" @click="retry">Erneut versuchen</IonButton>
    </div>

    <div v-else-if="result" class="confirm-success">
      <header class="success-header">
        <IonIcon name="checkmark-circle" color="success" size="large" />
        <h2>Buchung best&auml;tigt!</h2>
        <p class="confirm-id">Buchungsnummer: <strong>{{ result.id }}</strong></p>
      </header>

      <IonGrid class="ion-no-padding">
        <IonRow>
          <IonCol size="12" size-md="6">
            <BookingPeriodInfo
              :check-in="result.checkIn"
              :check-out="result.checkOut"
              :nights="result.nights"
            />
          </IonCol>
          <IonCol size="12" size-md="6">
            <RoomInfo
              :title="result.room.title"
              :description="result.room.description"
              :image-url="result.room.imageUrl"
              :extras="result.room.extras"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <GuestInfo
              :first-name="result.firstName"
              :last-name="result.lastName"
              :email="result.email"
              :breakfast="result.breakfast"
            />
          </IonCol>
          <IonCol size="12" size-md="6">
            <ArrivalInfo
              v-if="result.hotel"
              :address="result.hotel.address"
              :directions="result.hotel.directions"
              :parking-info="result.hotel.parkingInfo"
              :check-in-time="result.hotel.checkInTime"
              :check-out-time="result.hotel.checkOutTime"
              :check-in-instructions="result.hotel.checkInInstructions"
            />
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol size="12" size-md="6">
            <TravelInfo
              v-if="result.hotel"
              :public-transport="result.hotel.publicTransport"
              :train-station="result.hotel.trainStation"
              :travel-tips="result.hotel.travelTips"
            />
          </IonCol>
          <IonCol size="12" size-md="6">
            <ContactInfo
              v-if="result.hotel"
              :phone="result.hotel.phone"
              :email="result.hotel.email"
              :emergency-contact="result.hotel.emergencyContact"
            />
          </IonCol>
        </IonRow>
      </IonGrid>

      <IonCard color="light" class="ion-margin-top">
        <IonCardContent class="ion-no-padding">
          <IonItem color="light" lines="none">
            <IonLabel>Gesamtpreis</IonLabel>
            <span slot="end" class="total-value">{{ formatPrice(result.totalPrice) }}</span>
          </IonItem>
        </IonCardContent>
      </IonCard>

      <IonButton router-link="/rooms" fill="outline" class="ion-margin-top">
        Zur&uuml;ck zur Zimmer&uuml;bersicht
      </IonButton>
    </div>

    <div v-else class="confirm-state confirm-state-empty">
      <IonIcon name="document-text" color="medium" size="large" />
      <p>Keine Buchungsdaten verf&uuml;gbar.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { IonIcon, IonSpinner, IonButton, IonGrid, IonRow, IonCol, IonCard, IonCardContent, IonItem, IonLabel } from '@ionic/vue';
import { useBookingStore } from '@/stores/bookingStore';
import type { BookingResponse } from '@/types/booking';
import BookingPeriodInfo from '@/components/molecules/BookingPeriodInfo.vue';
import RoomInfo from '@/components/molecules/RoomInfo.vue';
import GuestInfo from '@/components/molecules/GuestInfo.vue';
import ArrivalInfo from '@/components/molecules/ArrivalInfo.vue';
import TravelInfo from '@/components/molecules/TravelInfo.vue';
import ContactInfo from '@/components/molecules/ContactInfo.vue';

defineProps<{
  result: BookingResponse | null;
  submitting: boolean;
  error: string | null;
}>();

const store = useBookingStore();

async function retry() {
  await store.submitBooking();
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(price);
}
</script>

<style scoped>
.confirm-id {
  font-size: 0.95rem;
  color: var(--color-neutral-500);
}

.confirm-success .confirm-state {
  display: none;
}

@media print {
  .booking-confirmation {
    max-width: 100%;
  }

  .confirm-state {
    display: none !important;
  }

  .success-header {
    margin-bottom: 20px;
  }

  .success-header h2 {
    font-size: 14pt;
  }

  .confirm-id {
    font-size: 10pt;
  }

  .confirm-grid {
    gap: 12px;
  }

  .confirm-total {
    background: none;
    border: 1px solid var(--color-neutral-200);
    padding: 10px 16px;
  }

  .total-label {
    font-size: 12pt;
  }

  .total-value {
    font-size: 14pt;
  }
}
</style>
