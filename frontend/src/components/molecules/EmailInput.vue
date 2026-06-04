<template>
  <div class="email-input-wrapper">
    <IonItem
      class="field-item"
      :class="{ 'ion-invalid': touched && error, 'ion-valid': touched && !error }"
    >
      <IonLabel position="stacked">{{ label }} <span class="required">*</span></IonLabel>
      <IonInput
        ref="ionInputRef"
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
    label?: string;
    placeholder?: string;
  }>(),
  {
    label: 'E-Mail',
    placeholder: 'max@example.com',
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const ionInputRef = ref<typeof IonInput | null>(null);
const touched = ref(false);
const error = ref<string | null>(null);
const value = ref(props.modelValue);

watch(() => props.modelValue, (v) => { value.value = v; });

async function getNativeValidity(): Promise<ValidityState | null> {
  try {
    const native = await (ionInputRef.value as any)?.getInputElement();
    return native?.validity ?? null;
  } catch {
    return null;
  }
}

async function validate(val: string): Promise<string | null> {
  const trimmed = val.trim();
  if (!trimmed) return 'Bitte gib deine E-Mail-Adresse ein.';
  const validity = await getNativeValidity();
  if (validity?.typeMismatch) return 'Bitte gib eine gültige E-Mail-Adresse ein.';
  if (!trimmed.includes('@')) return 'Bitte gib eine gültige E-Mail-Adresse ein.';
  return null;
}

async function onInput(ev: CustomEvent) {
  const val = ev.detail.value ?? '';
  value.value = val;
  emit('update:modelValue', val);
  if (touched.value) error.value = await validate(val);
}

async function onBlur() {
  touched.value = true;
  error.value = await validate(value.value);
}
</script>

<style scoped>
.email-input-wrapper {
  display: contents;
}
</style>