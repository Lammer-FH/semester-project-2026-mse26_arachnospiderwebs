import { defineStore } from 'pinia';
import { ref } from 'vue';
import { roomApi } from '@/services/roomApi';
import type { Room, RoomPage, AvailabilityResponse } from '@/types/room';

export const useRoomStore = defineStore('rooms', () => {
  const rooms = ref<Room[]>([]);
  const totalPages = ref(0);
  const totalElements = ref(0);
  const currentPage = ref(0);
  const hasNextPage = ref(false);
  const hasPreviousPage = ref(false);

  const selectedRoom = ref<Room | null>(null);
  const availability = ref<AvailabilityResponse | null>(null);

  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchRooms(page = 0, checkIn?: string, checkOut?: string) {
    loading.value = true;
    error.value = null;
    try {
      const data: RoomPage = await roomApi.getRooms(page, 5, checkIn, checkOut);
      rooms.value = data.content;
      totalPages.value = data.totalPages;
      totalElements.value = data.totalElements;
      currentPage.value = data.currentPage;
      hasNextPage.value = data.hasNextPage;
      hasPreviousPage.value = data.hasPreviousPage;
    } catch {
      error.value = 'Zimmer konnten nicht geladen werden.';
    } finally {
      loading.value = false;
    }
  }

  async function fetchRoom(id: number) {
    loading.value = true;
    error.value = null;
    try {
      selectedRoom.value = await roomApi.getRoom(id);
    } catch {
      error.value = 'Zimmer konnte nicht geladen werden.';
    } finally {
      loading.value = false;
    }
  }

  async function checkAvailability(roomId: number, checkIn: string, checkOut: string) {
    loading.value = true;
    error.value = null;
    availability.value = null;
    try {
      availability.value = await roomApi.checkAvailability(roomId, checkIn, checkOut);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response?: { data?: { message?: string } } };
        error.value = axiosErr.response?.data?.message ?? 'Verfügbarkeit konnte nicht geprüft werden.';
      } else {
        error.value = 'Verfügbarkeit konnte nicht geprüft werden.';
      }
    } finally {
      loading.value = false;
    }
  }

  function clearAvailability() {
    availability.value = null;
    error.value = null;
  }

  return {
    rooms,
    totalPages,
    totalElements,
    currentPage,
    hasNextPage,
    hasPreviousPage,
    selectedRoom,
    availability,
    loading,
    error,
    fetchRooms,
    fetchRoom,
    checkAvailability,
    clearAvailability,
  };
});
