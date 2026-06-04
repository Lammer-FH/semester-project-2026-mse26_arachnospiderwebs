<template>
  <section aria-labelledby="room-heading">
    <h3 id="room-heading" class="info-heading">Zimmer</h3>
    <IonCard color="light">
      <IonCardContent class="ion-no-padding">
        <IonItem color="light" lines="none">
          <IonThumbnail slot="start" class="room-thumbnail">
            <IonImg v-if="imageUrl" :src="imageUrl" :alt="title" />
          </IonThumbnail>
          <IonLabel>
            <p class="room-title" data-testid="room-title">{{ title }}</p>
            <p v-if="description" class="room-desc">{{ description }}</p>
          </IonLabel>
        </IonItem>
        <div v-if="extras.length" class="flex flex-wrap gap-xs py-sm px-md">
          <ExtraChip
            v-for="extra in extras"
            :key="extra.id"
            :name="extra.name"
            :icon="extra.icon"
          />
        </div>
      </IonCardContent>
    </IonCard>
  </section>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonItem, IonThumbnail, IonImg, IonLabel } from '@ionic/vue';
import ExtraChip from '@/components/molecules/ExtraChip.vue';

defineProps<{
  title: string;
  description: string;
  imageUrl: string;
  extras: { id: number; name: string; icon: string }[];
}>();
</script>

<style scoped>
.room-thumbnail {
  --size: 100px;
  --border-radius: var(--radius-md);
}
.room-title {
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-base);
  color: var(--ion-color-dark);
  margin-bottom: var(--spacing-xs);
}
.room-desc {
  font-size: 0.82rem;
  color: var(--color-neutral-600);
  line-height: var(--line-height-base);
  margin-bottom: var(--spacing-xs);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
