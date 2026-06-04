<template>
  <IonPage>
    <AppNavbar :show-menu="false" />
    <IonContent>
      <div v-if="!store.hasDraft()" class="flex-center" style="padding: 64px 16px;">
        <IonText color="medium">Keine Buchungsdaten gefunden.</IonText>
        <IonButton router-link="/rooms" fill="outline" class="ion-margin-top">
          Zurück zur Zimmerübersicht
        </IonButton>
      </div>

      <div v-else class="max-content-width-sm">
        <h1 class="page-title">Buchung abschliessen</h1>

        <BookingWizard
          :steps="steps"
          :current-step="store.currentStep"
          :can-proceed="stepCanProceed"
          :submitting="store.submitting"
          @next="onNext"
          @back="onBack"
          @finish="onFinish"
          @go-to-step="onGoToStep"
        />
      </div>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { computed, markRaw } from 'vue';
import { IonPage, IonContent, IonText, IonButton } from '@ionic/vue';
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import BookingWizard from '@/components/organisms/BookingWizard.vue';
import BookingStepGuestInfo from '@/components/organisms/BookingStepGuestInfo.vue';
import BookingStepReview from '@/components/organisms/BookingStepReview.vue';
import BookingStepConfirm from '@/components/organisms/BookingStepConfirm.vue';
import { useBookingStore } from '@/stores/bookingStore';

const store = useBookingStore();

const steps = computed(() => [
  {
    title: 'Gastinformationen',
    component: markRaw(BookingStepGuestInfo),
  },
  {
    title: 'Überprüfen',
    component: markRaw(BookingStepReview),
    finishStep: true,
  },
  {
    title: 'Bestätigung',
    component: markRaw(BookingStepConfirm),
    props: {
      result: store.bookingResult,
      submitting: store.submitting,
      error: store.error,
    },
  },
]);

const stepCanProceed = computed(() => {
  if (store.currentStep === 0) {
    const d = store.draft;
    return !!(d.firstName.trim() && d.lastName.trim() && d.email.trim() && d.confirmEmail.trim() && d.email.trim() === d.confirmEmail.trim() && d.email.includes('@'));
  }
  return true;
});

function onNext() {
  if (store.currentStep < steps.value.length - 1) {
    store.setStep(store.currentStep + 1);
  }
}

function onBack() {
  if (store.currentStep > 0) {
    store.setStep(store.currentStep - 1);
  }
}

function onGoToStep(index: number) {
  store.setStep(index);
}

async function onFinish() {
  const ok = await store.submitBooking();
  if (ok) {
    store.setStep(steps.value.length - 1);
  }
}
</script>

<style scoped>
.page-title {
  font-size: clamp(1.4rem, 3vw, 2rem);
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}
</style>
