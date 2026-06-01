<template>
  <IonPage>
    <AppNavbar />
    <IonContent>
      <section class="section">
        <div class="container">
          <h1 class="page-title">Unsere Zimmer</h1>

          <div class="filter-bar">
            <DateRangePicker
              :check-in="checkIn"
              :check-out="checkOut"
              @update:check-in="checkIn = $event"
              @update:check-out="checkOut = $event"
            />
            <IonButton
              color="primary"
              class="search-btn"
              @click="search"
            >
              <IonIcon slot="start" name="search" />
              Suchen
            </IonButton>
            <IonButton
              v-if="checkIn || checkOut"
              fill="clear"
              color="medium"
              @click="resetFilter"
            >
              Zurücksetzen
            </IonButton>
          </div>

          <RoomList
            :rooms="store.rooms"
            :loading="store.loading"
            :error="store.error"
            :current-page="store.currentPage"
            :total-pages="store.totalPages"
            :has-next-page="store.hasNextPage"
            :has-previous-page="store.hasPreviousPage"
            @select="goToRoom"
            @prev="page = store.currentPage - 1; loadRooms()"
            @next="page = store.currentPage + 1; loadRooms()"
          />
        </div>
      </section>
    </IonContent>
  </IonPage>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import RoomList from '@/components/organisms/RoomList.vue';
import DateRangePicker from '@/components/molecules/DateRangePicker.vue';
import { useRoomStore } from '@/stores/roomStore';

const router = useRouter();
const store = useRoomStore();

const checkIn = ref('');
const checkOut = ref('');
const page = ref(0);

onMounted(() => {
  loadRooms();
});

function loadRooms() {
  store.fetchRooms(page.value, checkIn.value || undefined, checkOut.value || undefined);
}

function search() {
  page.value = 0;
  loadRooms();
}

function resetFilter() {
  checkIn.value = '';
  checkOut.value = '';
  page.value = 0;
  loadRooms();
}

function goToRoom(id: number) {
  router.push(`/rooms/${id}`);
}
</script>

<style scoped>
.section {
  padding: 32px 16px;
}
.container {
  max-width: 1100px;
  margin: 0 auto;
}
.page-title {
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: var(--ion-color-primary);
  margin-bottom: 24px;
  text-align: center;
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  background: var(--ion-color-light);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}
.filter-bar > .date-range-picker {
  flex: 1 1 320px;
}
.search-btn {
  height: 44px;
  --border-radius: 4px;
}
</style>
