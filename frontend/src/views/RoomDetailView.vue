<template>
  <IonPage>
    <AppNavbar :show-menu="false" />
    <IonContent>
      <div v-if="store.loading" class="center-content">
        <IonSpinner name="crescent" />
      </div>

      <div v-else-if="!room && store.error" class="center-content">
        <IonText color="danger">{{ store.error }}</IonText>
        <IonButton router-link="/rooms" fill="outline" class="ion-margin-top">
          Zurück zur Übersicht
        </IonButton>
      </div>

      <article v-else-if="room" class="room-detail">
        <div class="bg-light">
          <div class="container">
            <div class="room-header">
              <div class="room-header-text">
                <h1 class="room-title">{{ room.title }}</h1>
                <p class="room-description">{{ room.description }}</p>
              </div>
              <img :src="room.imageUrl" :alt="room.title" class="room-thumb" />
            </div>

            <IonGrid class="ion-no-padding">
              <IonRow>
                <IonCol size="12" size-lg="8">
                  <h2 class="subsection-title">Ausstattung</h2>
                  <div class="flex flex-wrap gap-sm mb-lg">
                    <ExtraChip
                      v-for="extra in room.extras"
                      :key="extra.id"
                      :name="extra.name"
                      :icon="extra.icon"
                    />
                  </div>

                  <IonCard
                    v-if="store.availability"
                    :color="store.availability.available ? 'success' : 'danger'"
                    class="ion-margin-bottom"
                  >
                    <IonCardContent class="ion-no-padding">
                      <IonItem :color="store.availability.available ? 'success' : 'danger'" lines="none">
                        <IonIcon
                          slot="start"
                          :icon="store.availability.available ? checkmarkCircle : closeCircle"
                        />
                        <IonLabel v-if="store.availability.available">
                          Verfügbar – {{ store.availability.nights }} Nächte, {{ formatPrice(store.availability.totalPrice) }}
                        </IonLabel>
                        <IonLabel v-else>Nicht verfügbar für den gewählten Zeitraum.</IonLabel>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                </IonCol>

                <IonCol size="12" size-lg="4">
                  <IonCard color="light" class="ion-margin-bottom">
                    <IonCardContent>
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
                        :disabled="!checkIn || !checkOut || !!store.availability"
                        @click="checkAvailability"
                      >
                        Verfügbarkeit prüfen
                      </IonButton>

                      <IonButton
                        v-if="store.availability?.available"
                        expand="block"
                        color="success"
                        class="ion-margin-top"
                        @click="bookNow"
                      >
                        Jetzt buchen
                      </IonButton>

                      <p v-if="store.error" class="error-text">{{ store.error }}</p>
                    </IonCardContent>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </div>
        </div>
      </article>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonContent, IonSpinner, IonText,
  IonButton, IonIcon, IonImg, IonGrid, IonRow, IonCol,
  IonCard, IonCardContent, IonItem, IonLabel,
} from '@ionic/vue';
import { checkmarkCircle, closeCircle } from 'ionicons/icons';
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import DateRangePicker from '@/components/molecules/DateRangePicker.vue';
import ExtraChip from '@/components/molecules/ExtraChip.vue';
import { useRoomStore } from '@/stores/roomStore';
import { useBookingStore } from '@/stores/bookingStore';

const route = useRoute();
const router = useRouter();
const store = useRoomStore();
const bookingStore = useBookingStore();

const roomId = computed(() => Number(route.params.id));
const checkIn = ref(store.searchCheckIn);
const checkOut = ref(store.searchCheckOut);

const room = computed(() => store.selectedRoom);

onMounted(async () => {
  await store.fetchRoom(roomId.value);
  if (checkIn.value && checkOut.value) {
    store.checkAvailability(roomId.value, checkIn.value, checkOut.value);
  }
});

function checkAvailability() {
  if (checkIn.value && checkOut.value) {
    store.checkAvailability(roomId.value, checkIn.value, checkOut.value);
  }
}

function bookNow() {
  if (!room.value || !store.availability?.available || !checkIn.value || !checkOut.value) {
    return;
  }
  bookingStore.setDraft({
    roomId: room.value.id,
    roomTitle: room.value.title,
    roomImage: room.value.imageUrl,
    roomDescription: room.value.description,
    pricePerNight: room.value.pricePerNight,
    checkIn: checkIn.value,
    checkOut: checkOut.value,
    nights: store.availability.nights,
    totalPrice: store.availability.totalPrice,
    extras: room.value.extras,
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    breakfast: false,
  });
  bookingStore.setStep(0);
  router.push('/booking');
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
.room-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}
.room-header-text {
  flex: 1;
  min-width: 0;
}
.room-header .room-title {
  margin-bottom: 8px;
}
.room-header .room-description {
  margin-bottom: 0;
}
.room-thumb {
  max-width: 260px;
  max-height: 260px;
  width: auto;
  height: auto;
  border-radius: 12px;
  flex-shrink: 0;
  object-fit: contain;
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
.price-display {
  font-size: 1.1rem;
  color: var(--ion-color-medium);
  margin-bottom: 16px;
}
.price-display strong {
  font-size: 1.6rem;
  color: var(--ion-color-primary);
}
.error-text {
  color: var(--ion-color-danger);
  font-size: 0.85rem;
  margin-top: 8px;
}
</style>
