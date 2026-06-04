<template>
  <IonChip color="primary" outline>
    <IonIcon :icon="ionIcon" slot="start" />
    <span>{{ name }}</span>
  </IonChip>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonChip, IonIcon } from '@ionic/vue';
import { wifi, cafe, flower, lockClosed, snow, car, star } from 'ionicons/icons';

const props = defineProps<{ name: string; icon: string }>();

const iconMap: Record<string, string> = {
  wifi,
  'cup-hot': cafe,
  'door-open': flower,
  lock: lockClosed,
  'thermometer-snow': snow,
  'car-front': car,
};

const ionIcon = computed(() => iconMap[props.icon] ?? star);
</script>
