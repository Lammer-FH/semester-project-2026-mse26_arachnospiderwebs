<template>
  <div class="date-range-picker" :class="{ horizontal }">
    <div class="field">
      <IonLabel class="field-label">Anreise</IonLabel>
      <IonDatetimeButton :datetime="checkInId" class="field-button" />
      <IonModal :keep-contents-mounted="true">
        <IonDatetime
          :id="checkInId"
          presentation="date"
          :value="checkIn || undefined"
          :min="today"
          locale="de-DE"
          :first-day-of-week="1"
          show-default-buttons
          done-text="Übernehmen"
          cancel-text="Abbrechen"
          @ion-change="onCheckInChange"
        >
          <span slot="title">Anreise wählen</span>
        </IonDatetime>
      </IonModal>
    </div>

    <div class="field">
      <IonLabel class="field-label">Abreise</IonLabel>
      <IonDatetimeButton :datetime="checkOutId" class="field-button" />
      <IonModal :keep-contents-mounted="true">
        <IonDatetime
          :id="checkOutId"
          presentation="date"
          :value="checkOut || undefined"
          :min="minCheckOut"
          locale="de-DE"
          :first-day-of-week="1"
          show-default-buttons
          done-text="Übernehmen"
          cancel-text="Abbrechen"
          @ion-change="onCheckOutChange"
        >
          <span slot="title">Abreise wählen</span>
        </IonDatetime>
      </IonModal>
    </div>

    <IonNote v-if="validationError" color="danger" class="validation-note">
      {{ validationError }}
    </IonNote>
  </div>
</template>

<script setup lang="ts">
import { computed, useId } from 'vue';
import { IonLabel, IonNote, IonDatetime, IonDatetimeButton, IonModal } from '@ionic/vue';

const props = defineProps<{
  checkIn: string;
  checkOut: string;
  horizontal?: boolean;
}>();

const emit = defineEmits<{
  'update:checkIn': [value: string];
  'update:checkOut': [value: string];
}>();

const uid = useId();
const checkInId = `checkin-${uid}`;
const checkOutId = `checkout-${uid}`;

const today = new Date().toISOString().split('T')[0];

const minCheckOut = computed(() => {
  const base = props.checkIn || today;
  const next = new Date(base);
  next.setDate(next.getDate() + 1);
  return next.toISOString().split('T')[0];
});

const validationError = computed(() => {
  if (props.checkIn && props.checkOut && props.checkOut <= props.checkIn) {
    return 'Abreise muss nach der Anreise liegen.';
  }
  return null;
});

function toDate(value: unknown): string {
  return typeof value === 'string' ? value.split('T')[0] : '';
}

function onCheckInChange(e: CustomEvent) {
  emit('update:checkIn', toDate(e.detail.value));
}
function onCheckOutChange(e: CustomEvent) {
  emit('update:checkOut', toDate(e.detail.value));
}
</script>

<style scoped>
.date-range-picker {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.field-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--ion-color-medium);
}

.field-button::part(native) {
  width: 100%;
}

.validation-note {
  font-size: 0.8125rem;
}

.date-range-picker.horizontal {
  flex-direction: row;
  align-items: flex-start;
  gap: 16px;
}

.date-range-picker.horizontal .field {
  flex: 1;
}

.date-range-picker.horizontal .validation-note {
  flex-basis: 100%;
}
</style>
