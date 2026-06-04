<template>
  <IonBreadcrumbs class="booking-breadcrumbs" aria-label="Buchungsfortschritt">
    <IonBreadcrumb
      v-for="(step, index) in steps"
      :key="index"
      :active="index === currentStep"
      :disabled="index > currentStep"
      :color="index <= currentStep ? 'primary' : 'medium'"
      :aria-current="index === currentStep ? 'step' : undefined"
      @click="onStepClick(index)"
    >
      <IonIcon v-if="index < currentStep" :icon="checkmarkOutline" slot="start" />
      {{ step.title }}
    </IonBreadcrumb>
  </IonBreadcrumbs>
  <span class="sr-only" aria-live="polite">
    Schritt {{ currentStep + 1 }} von {{ steps.length }}: {{ steps[currentStep]?.title }}
  </span>
</template>

<script setup lang="ts">
import { IonBreadcrumbs, IonBreadcrumb, IonIcon } from '@ionic/vue';
import { checkmarkOutline } from 'ionicons/icons';

const props = defineProps<{
  steps: { title: string }[];
  currentStep: number;
}>();

const emit = defineEmits<{
  'go-to-step': [index: number];
}>();

function onStepClick(index: number) {
  if (index <= props.currentStep) {
    emit('go-to-step', index);
  }
}
</script>

<style scoped>
.booking-breadcrumbs {
  margin-bottom: 32px;
  justify-content: center;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
