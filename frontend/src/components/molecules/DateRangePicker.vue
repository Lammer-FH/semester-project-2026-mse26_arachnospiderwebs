<template>
  <div class="date-range-picker">
    <IonItem>
      <IonLabel position="stacked">Anreise</IonLabel>
      <IonInput
        type="date"
        :value="checkIn"
        :min="today"
        @ion-change="onCheckInChange"
      />
    </IonItem>
    <IonItem>
      <IonLabel position="stacked">Abreise</IonLabel>
      <IonInput
        type="date"
        :value="checkOut"
        :min="checkIn || today"
        @ion-change="onCheckOutChange"
      />
    </IonItem>
    <p v-if="validationError" class="error-text ion-padding-horizontal">
      {{ validationError }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonItem, IonLabel, IonInput } from '@ionic/vue';

const props = defineProps<{
  checkIn: string;
  checkOut: string;
}>();

const emit = defineEmits<{
  'update:checkIn': [value: string];
  'update:checkOut': [value: string];
}>();

const today = new Date().toISOString().split('T')[0];

const validationError = computed(() => {
  if (props.checkIn && props.checkOut && props.checkOut < props.checkIn) {
    return 'Abreise muss nach Anreise liegen.';
  }
  return null;
});

function onCheckInChange(e: CustomEvent) {
  emit('update:checkIn', e.detail.value ?? '');
}
function onCheckOutChange(e: CustomEvent) {
  emit('update:checkOut', e.detail.value ?? '');
}
</script>

<style scoped>
.date-range-picker {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.error-text {
  color: var(--ion-color-danger);
  font-size: 0.8rem;
}
</style>
