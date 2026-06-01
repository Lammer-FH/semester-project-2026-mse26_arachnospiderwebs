<template>
  <IonPage>
    <AppNavbar :show-menu="false" />
    <IonContent>
      <div v-if="store.loading" class="center-content">
        <IonSpinner name="crescent" />
      </div>

      <div v-else-if="store.error" class="center-content">
        <IonText color="danger">{{ store.error }}</IonText>
        <IonButton router-link="/rooms" fill="outline" class="ion-margin-top">
          Zurück zur Übersicht
        </IonButton>
      </div>

      <article v-else-if="room" class="room-detail">
        <div class="hero-image">
          <img :src="room.imageUrl" :alt="room.title" />
        </div>

        <div class="container">
          <div class="detail-grid">
            <div class="detail-main">
              <h1 class="room-title">{{ room.title }}</h1>
              <p class="room-description">{{ room.description }}</p>

              <h2 class="subsection-title">Ausstattung</h2>
              <div class="extras-row">
                <ExtraChip
                  v-for="extra in room.extras"
                  :key="extra.id"
                  :name="extra.name"
                  :icon="extra.icon"
                />
              </div>

              <div v-if="store.availability" class="availability-card" :class="store.availability.available ? 'avail-ok' : 'avail-no'">
                <IonIcon :name="store.availability.available ? 'checkmark-circle' : 'close-circle'" />
                <span v-if="store.availability.available">
                  Verfügbar – {{ store.availability.nights }} Nächte, {{ formatPrice(store.availability.totalPrice) }}
                </span>
                <span v-else>Nicht verfügbar für den gewählten Zeitraum.</span>
              </div>
            </div>

            <aside class="detail-sidebar">
              <div class="booking-card">
                <p class="price-display">
                  ab <strong>{{ formatPrice(room.pricePerNight) }}</strong> / Nacht
                </p>

                <DateRangePicker
                  :check-in="checkIn"
                  :check-out="checkOut"
                  @update:check-in="checkIn = $event; store.clearAvailability()"
                  @update:check-out="checkOut = $event; store.clearAvailability()"
                />

                <IonButton
                  expand="block"
                  color="primary"
                  :disabled="!checkIn || !checkOut"
                  @click="checkAvailability"
                >
                  Verfügbarkeit prüfen
                </IonButton>

                <p v-if="store.error" class="error-text">{{ store.error }}</p>
              </div>
            </aside>
          </div>
        </div>
      </article>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {
  IonPage, IonContent, IonSpinner, IonText,
  IonButton, IonIcon,
} from '@ionic/vue';
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import DateRangePicker from '@/components/molecules/DateRangePicker.vue';
import ExtraChip from '@/components/molecules/ExtraChip.vue';
import { useRoomStore } from '@/stores/roomStore';

const route = useRoute();
const store = useRoomStore();

const roomId = computed(() => Number(route.params.id));
const checkIn = ref('');
const checkOut = ref('');

const room = computed(() => store.selectedRoom);

onMounted(() => {
  store.fetchRoom(roomId.value);
});

function checkAvailability() {
  if (checkIn.value && checkOut.value) {
    store.checkAvailability(roomId.value, checkIn.value, checkOut.value);
  }
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(price);
}
</script>

<style scoped>
.center-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 64px 16px;
}
.hero-image {
  width: 100%;
  height: 40vh;
  min-height: 250px;
  overflow: hidden;
}
.hero-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 16px;
}
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 40px;
  padding: 32px 0;
}
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
.room-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: var(--ion-color-primary);
  margin-bottom: 16px;
}
.room-description {
  font-size: 1.05rem;
  color: var(--ion-color-medium);
  line-height: 1.7;
  margin-bottom: 32px;
}
.subsection-title {
  font-size: 1.2rem;
  color: var(--ion-color-primary);
  margin-bottom: 12px;
}
.extras-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
}
.availability-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 0.95rem;
}
.avail-ok {
  background: #e8f5e9;
  color: #2e7d32;
}
.avail-no {
  background: #ffebee;
  color: #c62828;
}
.price-display {
  font-size: 1.1rem;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}
.price-display strong {
  font-size: 1.6rem;
  color: var(--ion-color-primary);
}
.booking-card {
  background: var(--ion-color-light);
  border-radius: 12px;
  padding: 24px;
  position: sticky;
  top: 16px;
}
.error-text {
  color: var(--ion-color-danger);
  font-size: 0.85rem;
  margin-top: 8px;
}
</style>
