<template>
  <div class="booking-wizard">
    <BookingProgress :steps="steps" :current-step="currentStep" @go-to-step="$emit('go-to-step', $event)" />

    <div class="booking-wizard-body">
      <Transition name="fade" mode="out-in">
        <component :is="activeStep.component" :key="currentStep" v-bind="activeStep.props" />
      </Transition>
    </div>

    <div class="booking-wizard-footer">
      <IonButton
        v-if="!isFirstStep"
        fill="outline"
        :disabled="submitting"
        @click="$emit('back')"
      >
        Zurück
      </IonButton>
      <div class="booking-wizard-footer-spacer" />
      <IonButton
        v-if="hasNextStep && !isFinishStep"
        :disabled="!canProceed"
        @click="$emit('next')"
      >
        Weiter
      </IonButton>
      <IonButton
        v-if="isFinishStep"
        color="success"
        :disabled="submitting"
        :loading="submitting"
        @click="$emit('finish')"
      >
        Buchung bestätigen
      </IonButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type Component } from 'vue';
import { IonButton } from '@ionic/vue';
import BookingProgress from '@/components/molecules/BookingProgress.vue';

export interface WizardStep {
  title: string;
  component: Component;
  props?: Record<string, unknown>;
  canProceed?: boolean;
  /** When true, shows "Buchung bestätigen" instead of "Weiter" */
  finishStep?: boolean;
}

const props = defineProps<{
  steps: WizardStep[];
  currentStep: number;
  canProceed?: boolean;
  submitting?: boolean;
}>();

defineEmits<{
  next: [];
  back: [];
  finish: [];
  'go-to-step': [index: number];
}>();

const isFirstStep = computed(() => props.currentStep === 0);
const hasNextStep = computed(() => props.currentStep < props.steps.length - 1);
const activeStep = computed(() => props.steps[props.currentStep]);
const isFinishStep = computed(() => activeStep.value?.finishStep === true);
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
