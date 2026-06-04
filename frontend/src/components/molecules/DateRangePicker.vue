<template>
  <div class="date-range-picker" :class="{ horizontal }">
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
    <IonNote v-if="validationError" color="danger" class="ion-padding-horizontal">
      {{ validationError }}
    </IonNote>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonItem, IonLabel, IonInput, IonNote } from '@ionic/vue';

const props = defineProps<{
  checkIn: string;
  checkOut: string;
  horizontal?: boolean;
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

.date-range-picker.horizontal {
  flex-direction: row;
  gap: 8px;
}

.date-range-picker.horizontal IonItem {
  flex: 1;
}
</style>
