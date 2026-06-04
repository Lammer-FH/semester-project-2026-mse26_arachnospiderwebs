<template>
  <IonPage>
    <AppNavbar />
    <IonContent>
      <section class="section">
        <div class="container">
          <h1 class="page-title">Unsere Zimmer</h1>

          <IonCard class="filter-bar">
            <IonCardContent>
              <div class="filter-bar-content">
                <DateRangePicker
                  :check-in="checkIn"
                  :check-out="checkOut"
                  :horizontal="isLargeScreen"
                  @update:check-in="checkIn = $event"
                  @update:check-out="checkOut = $event"
                />

              </div>
            </IonCardContent>
          </IonCard>

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
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { IonPage, IonContent, IonCard, IonCardContent } from '@ionic/vue';
import AppNavbar from '@/components/organisms/AppNavbar.vue';
import RoomList from '@/components/organisms/RoomList.vue';
import DateRangePicker from '@/components/molecules/DateRangePicker.vue';
import { useRoomStore } from '@/stores/roomStore';

const router = useRouter();
const store = useRoomStore();

const checkIn = ref(store.searchCheckIn);
const checkOut = ref(store.searchCheckOut);
const page = ref(0);
const isLargeScreen = ref(window.innerWidth >= 769);

watch([checkIn, checkOut], () => {
  search();
});

let mql: MediaQueryList | undefined;

onMounted(() => {
  mql = window.matchMedia('(min-width: 769px)');
  isLargeScreen.value = mql.matches;
  mql.addEventListener('change', onBreakpointChange);
  loadRooms();
});

onUnmounted(() => {
  mql?.removeEventListener('change', onBreakpointChange);
});

function onBreakpointChange(e: MediaQueryListEvent) {
  isLargeScreen.value = e.matches;
}

function loadRooms() {
  store.fetchRooms(page.value, checkIn.value || undefined, checkOut.value || undefined);
}

function search() {
  page.value = 0;
  store.setSearchDates(checkIn.value, checkOut.value);
  loadRooms();
}

function goToRoom(id: number) {
  router.push(`/rooms/${id}`);
}
</script>

<style scoped>
.container {
  max-width: 1100px;
  margin: 0 auto;
}
.filter-bar-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (min-width: 769px) {
  .filter-bar-content {
    flex-direction: row;
    align-items: flex-end;
  }


}
</style>
