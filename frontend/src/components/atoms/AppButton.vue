<template>
  <IonButton :color="color" :fill="fill" :disabled="disabled" :expand="expand" @click="$emit('click')">
    <slot />
  </IonButton>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue';

withDefaults(
  defineProps<{
    color?: string;
    fill?: 'clear' | 'outline' | 'solid';
    disabled?: boolean;
    expand?: 'block' | 'full';
  }>(),
  { color: 'primary', fill: 'solid', disabled: false }
);

defineEmits<{ click: [] }>();
</script>
