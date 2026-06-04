<template>
  <div class="confirm-email-wrapper">
    <IonItem
      class="field-item"
      :class="{ 'ion-invalid': touched && error, 'ion-valid': touched && !error }"
    >
      <IonLabel position="stacked">{{ label }} <span class="required">*</span></IonLabel>
      <IonInput
        :value="modelValue"
        type="email"
        :placeholder="placeholder"
        @ion-input="onInput"
        @ion-blur="onBlur"
      />
    </IonItem>
    <IonNote v-if="touched && error" color="danger" class="ion-margin-start">{{ error }}</IonNote>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { IonItem, IonLabel, IonInput, IonNote } from '@ionic/vue';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    email: string;
    label?: string;
    placeholder?: string;
  }>(),
  {
    label: 'E-Mail bestätigen',
    placeholder: 'max@example.com',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const touched = ref(false);
const error = ref<string | null>(null);
const value = ref(props.modelValue);

watch(() => props.modelValue, (v) => { value.value = v; });

function validate(val: string): string | null {
  if (!val.trim()) return 'Bitte bestätige deine E-Mail-Adresse.';
  return val.trim() === props.email.trim() ? null : 'Die E-Mail-Adressen stimmen nicht überein.';
}

function onInput(ev: CustomEvent) {
  const val = ev.detail.value ?? '';
  value.value = val;
  emit('update:modelValue', val);
  if (touched.value) error.value = validate(val);
}

function onBlur() {
  touched.value = true;
  error.value = validate(value.value);
}
</script>

<style scoped>
.confirm-email-wrapper {
  display: contents;
}
</style>