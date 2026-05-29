<template>
  <div class="room-list">
    <div v-if="loading" class="center-content">
      <IonSpinner name="crescent" />
    </div>
    <div v-else-if="error" class="center-content">
      <IonText color="danger">{{ error }}</IonText>
    </div>
    <div v-else-if="rooms.length === 0" class="center-content">
      <IonText color="medium">Keine Zimmer gefunden.</IonText>
    </div>
    <div v-else class="rooms-grid">
      <RoomCard
        v-for="room in rooms"
        :key="room.id"
        :room="room"
        @select="$emit('select', $event)"
      />
    </div>
    <PaginationBar
      v-if="totalPages > 1"
      :current="currentPage"
      :total="totalPages"
      :has-next="hasNextPage"
      :has-previous="hasPreviousPage"
      @prev="$emit('prev')"
      @next="$emit('next')"
    />
  </div>
</template>

<script setup lang="ts">
import { IonSpinner, IonText } from '@ionic/vue';
import RoomCard from '@/components/molecules/RoomCard.vue';
import PaginationBar from '@/components/molecules/PaginationBar.vue';
import type { Room } from '@/types/room';

defineProps<{
  rooms: Room[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}>();

defineEmits<{ select: [id: number]; prev: []; next: [] }>();
</script>

<style scoped>
.center-content {
  display: flex;
  justify-content: center;
  padding: 48px 0;
}
.rooms-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}
@media (min-width: 768px) {
  .rooms-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (min-width: 1200px) {
  .rooms-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
