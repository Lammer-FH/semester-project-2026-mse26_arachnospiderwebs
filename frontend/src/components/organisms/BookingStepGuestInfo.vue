<template>
  <div class="step-guest booking-step-sm">
    <h2 class="step-title">Gastinformationen</h2>
    <p class="step-description">Bitte gib deine Kontaktdaten f&uuml;r die Buchung ein.</p>

    <form novalidate @submit.prevent>
      <div class="form-group">
        <IonItem
          class="field-item"
          :class="{ 'ion-invalid': touched.firstName && errors.firstName, 'ion-valid': touched.firstName && !errors.firstName }"
        >
          <IonLabel position="stacked">Vorname <span class="required">*</span></IonLabel>
          <IonInput
            :value="firstName"
            :maxlength="100"
            placeholder="Max"
            @ion-input="onFirstNameInput"
            @ion-blur="onFirstNameBlur"
          />
        </IonItem>
        <IonNote v-if="touched.firstName && errors.firstName" color="danger" class="ion-margin-start">
          {{ errors.firstName }}
        </IonNote>

        <IonItem
          class="field-item"
          :class="{ 'ion-invalid': touched.lastName && errors.lastName, 'ion-valid': touched.lastName && !errors.lastName }"
        >
          <IonLabel position="stacked">Nachname <span class="required">*</span></IonLabel>
          <IonInput
            :value="lastName"
            :maxlength="100"
            placeholder="Mustermann"
            @ion-input="onLastNameInput"
            @ion-blur="onLastNameBlur"
          />
        </IonItem>
        <IonNote v-if="touched.lastName && errors.lastName" color="danger" class="ion-margin-start">
          {{ errors.lastName }}
        </IonNote>

        <EmailInput v-model="email" />

        <ConfirmEmailInput v-model="confirmEmail" :email="email" />

        <IonItem class="field-item">
          <IonLabel>Fr&uuml;hst&uuml;ck buchen (&euro;15 / Nacht)</IonLabel>
          <IonToggle
            :checked="breakfast"
            @ion-change="onBreakfastChange"
          />
        </IonItem>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue';
import { IonItem, IonLabel, IonInput, IonToggle, IonNote } from '@ionic/vue';
import EmailInput from '@/components/molecules/EmailInput.vue';
import ConfirmEmailInput from '@/components/molecules/ConfirmEmailInput.vue';
import { useBookingStore } from '@/stores/bookingStore';

const store = useBookingStore();

const firstName = ref(store.draft.firstName);
const lastName = ref(store.draft.lastName);
const email = ref(store.draft.email);
const confirmEmail = ref(store.draft.confirmEmail);
const breakfast = ref(store.draft.breakfast);

const touched = reactive({
  firstName: false,
  lastName: false,
});

const errors = reactive({
  firstName: null as string | null,
  lastName: null as string | null,
});

function syncToStore() {
  store.updateGuestInfo({
    firstName: firstName.value.trim(),
    lastName: lastName.value.trim(),
    email: email.value.trim(),
    confirmEmail: confirmEmail.value.trim(),
    breakfast: breakfast.value,
  });
}

watch(email, syncToStore);
watch(confirmEmail, syncToStore);

function validateFirstName(): string | null {
  return firstName.value.trim() ? null : 'Bitte gib deinen Vornamen ein.';
}

function validateLastName(): string | null {
  return lastName.value.trim() ? null : 'Bitte gib deinen Nachnamen ein.';
}

function onFirstNameInput(ev: CustomEvent) {
  firstName.value = ev.detail.value ?? '';
  if (touched.firstName) errors.firstName = validateFirstName();
  syncToStore();
}

function onFirstNameBlur() {
  touched.firstName = true;
  errors.firstName = validateFirstName();
}

function onLastNameInput(ev: CustomEvent) {
  lastName.value = ev.detail.value ?? '';
  if (touched.lastName) errors.lastName = validateLastName();
  syncToStore();
}

function onLastNameBlur() {
  touched.lastName = true;
  errors.lastName = validateLastName();
}

function onBreakfastChange(ev: CustomEvent) {
  breakfast.value = ev.detail.checked ?? false;
  syncToStore();
}

const isValid = computed(() => {
  return !!(
    firstName.value.trim() &&
    lastName.value.trim() &&
    email.value.trim().includes('@') &&
    confirmEmail.value.trim() === email.value.trim()
  );
});

defineExpose({
  validate(): boolean {
    touched.firstName = true;
    touched.lastName = true;
    errors.firstName = validateFirstName();
    errors.lastName = validateLastName();
    syncToStore();
    return isValid.value;
  },
  isValid,
});
</script>

<style scoped>
@media (max-width: 480px) {
  .step-guest {
    max-width: 100%;
  }
}
</style>