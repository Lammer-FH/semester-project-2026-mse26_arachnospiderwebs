<template>
  <span class="extra-chip">
    <ion-icon :name="ionIcon" class="extra-icon" />
    <span class="extra-label">{{ name }}</span>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonIcon } from '@ionic/vue';

const props = defineProps<{ name: string; icon: string }>();

const iconMap: Record<string, string> = {
  wifi: 'wifi',
  'cup-hot': 'cafe',
  'door-open': 'flower',
  lock: 'lock-closed',
  'thermometer-snow': 'snow',
  'car-front': 'car',
};

const ionIcon = computed(() => iconMap[props.icon] ?? 'star');
</script>

<style scoped>
.extra-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: var(--ion-color-light);
  border-radius: 16px;
  padding: 4px 10px;
  font-size: 0.8rem;
  color: var(--ion-color-primary);
  border: 1px solid var(--ion-color-secondary);
}
.extra-icon {
  font-size: 1rem;
  color: var(--ion-color-secondary);
}
</style>
