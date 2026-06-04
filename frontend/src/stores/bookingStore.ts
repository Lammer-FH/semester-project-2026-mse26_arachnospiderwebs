import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import type { Extra } from '@/types/room';
import { bookingService } from '@/services/bookingService';
import type { BookingResponse } from '@/types/booking';

const STORAGE_KEY = 'hotel_booking_draft';
const STEP_KEY = 'hotel_booking_step';

export interface BookingDraft {
  roomId: number;
  roomTitle: string;
  roomImage: string;
  roomDescription: string;
  pricePerNight: number;
  checkIn: string;
  checkOut: string;
  nights: number;
  totalPrice: number;
  extras: Extra[];

  firstName: string;
  lastName: string;
  email: string;
  confirmEmail: string;
  breakfast: boolean;
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveToStorage(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage full or unavailable */
  }
}

function removeFromStorage(key: string) {
  try {
    localStorage.removeItem(key);
  } catch {
    /* ignore */
  }
}

function emptyDraft(): BookingDraft {
  return {
    roomId: 0,
    roomTitle: '',
    roomImage: '',
    roomDescription: '',
    pricePerNight: 0,
    checkIn: '',
    checkOut: '',
    nights: 0,
    totalPrice: 0,
    extras: [],
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    breakfast: false,
  };
}

export const useBookingStore = defineStore('booking', () => {
  const draft = ref<BookingDraft>(loadFromStorage<BookingDraft>(STORAGE_KEY, emptyDraft()));
  const currentStep = ref(loadFromStorage<number>(STEP_KEY, 0));
  const bookingResult = ref<BookingResponse | null>(null);
  const submitting = ref(false);
  const error = ref<string | null>(null);

  watch(draft, (val) => saveToStorage(STORAGE_KEY, val), { deep: true });
  watch(currentStep, (val) => saveToStorage(STEP_KEY, val));

  function setDraft(value: BookingDraft) {
    draft.value = value;
  }

  function updateGuestInfo(info: { firstName: string; lastName: string; email: string; confirmEmail: string; breakfast: boolean }) {
    draft.value = { ...draft.value, ...info };
  }

  function setStep(step: number) {
    currentStep.value = step;
  }

  async function submitBooking(): Promise<boolean> {
    if (!draft.value.roomId) return false;
    submitting.value = true;
    error.value = null;
    bookingResult.value = null;
    try {
      const result = await bookingService.createBooking({
        roomId: draft.value.roomId,
        checkIn: draft.value.checkIn,
        checkOut: draft.value.checkOut,
        firstName: draft.value.firstName,
        lastName: draft.value.lastName,
        email: draft.value.email,
        breakfast: draft.value.breakfast,
      });
      if (result.success) {
        bookingResult.value = result.data;
        return true;
      } else {
        error.value = result.error.message;
        return false;
      }
    } catch {
      error.value = 'Buchung fehlgeschlagen.';
      return false;
    } finally {
      submitting.value = false;
    }
  }

  function clearAll() {
    draft.value = emptyDraft();
    currentStep.value = 0;
    bookingResult.value = null;
    error.value = null;
    removeFromStorage(STORAGE_KEY);
    removeFromStorage(STEP_KEY);
  }

  const hasDraft = () =>
    draft.value.roomId > 0 && draft.value.checkIn !== '' && draft.value.checkOut !== '';

  return {
    draft,
    currentStep,
    bookingResult,
    submitting,
    error,
    setDraft,
    updateGuestInfo,
    setStep,
    submitBooking,
    clearAll,
    hasDraft,
  };
});
