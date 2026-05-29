<template>
  <div class="pagination-bar ion-text-center ion-padding-top">
    <IonButtons>
      <IonButton :disabled="!hasPrevious" fill="outline" color="primary" @click="$emit('prev')">
        <IonIcon slot="icon-only" name="chevron-back" />
      </IonButton>
      <span class="page-info">{{ current + 1 }} / {{ total }}</span>
      <IonButton :disabled="!hasNext" fill="outline" color="primary" @click="$emit('next')">
        <IonIcon slot="icon-only" name="chevron-forward" />
      </IonButton>
    </IonButtons>
  </div>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonIcon } from '@ionic/vue';

defineProps<{
  current: number;
  total: number;
  hasNext: boolean;
  hasPrevious: boolean;
}>();

defineEmits<{ prev: []; next: [] }>();
</script>

<style scoped>
.pagination-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
}
.page-info {
  font-size: 0.9rem;
  color: var(--ion-color-medium);
  padding: 0 12px;
}
</style>
