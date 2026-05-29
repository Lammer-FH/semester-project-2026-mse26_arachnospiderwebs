<template>
  <IonCard class="room-card" button @click="$emit('select', room.id)">
    <div class="room-image-wrapper">
      <img :src="room.imageUrl" :alt="room.title" class="room-image" loading="lazy" />
      <div v-if="room.availability" class="availability-badge" :class="room.availability.available ? 'available' : 'unavailable'">
        {{ room.availability.available ? 'Verfügbar' : 'Belegt' }}
      </div>
    </div>
    <IonCardHeader>
      <IonCardTitle>{{ room.title }}</IonCardTitle>
      <IonCardSubtitle>ab {{ formatPrice(room.pricePerNight) }} / Nacht</IonCardSubtitle>
    </IonCardHeader>
    <IonCardContent>
      <p class="room-description">{{ room.description }}</p>
      <div class="extras-row">
        <ExtraChip
          v-for="extra in room.extras"
          :key="extra.id"
          :name="extra.name"
          :icon="extra.icon"
        />
      </div>
    </IonCardContent>
  </IonCard>
</template>

<script setup lang="ts">
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import ExtraChip from './ExtraChip.vue';
import type { Room } from '@/types/room';

defineProps<{ room: Room }>();
defineEmits<{ select: [id: number] }>();

function formatPrice(price: number) {
  return new Intl.NumberFormat('de-AT', { style: 'currency', currency: 'EUR' }).format(price);
}
</script>

<style scoped>
.room-card {
  margin: 0;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
.room-image-wrapper {
  position: relative;
  overflow: hidden;
  height: 200px;
}
.room-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.availability-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.78rem;
  font-weight: 700;
}
.available {
  background: var(--ion-color-success);
  color: #fff;
}
.unavailable {
  background: var(--ion-color-danger);
  color: #fff;
}
.room-description {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.extras-row {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
</style>
