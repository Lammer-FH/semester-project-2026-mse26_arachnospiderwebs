<template>
  <span class="app-badge">
    <slot />
  </span>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ color?: string }>(), { color: 'secondary' });
</script>

<style scoped>
.app-badge {
  display: inline-block;
  padding: 2px 10px;
  border-radius: 12px;
  background: var(--ion-color-secondary);
  color: var(--ion-color-secondary-contrast);
  font-size: 0.75rem;
  font-weight: 600;
}
</style>
