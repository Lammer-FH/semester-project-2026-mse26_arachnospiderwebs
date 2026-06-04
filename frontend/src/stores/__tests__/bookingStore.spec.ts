import { setActivePinia, createPinia } from 'pinia';
import { useBookingStore } from '../bookingStore';
import type { BookingDraft } from '../bookingStore';
import { describe, it, expect, beforeEach } from 'vitest';

describe('bookingStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  const sampleDraft: BookingDraft = {
    roomId: 1,
    roomTitle: 'Deluxe Suite',
    roomImage: 'https://example.com/room.jpg',
    roomDescription: 'A beautiful suite',
    pricePerNight: 149,
    checkIn: '2026-07-01',
    checkOut: '2026-07-05',
    nights: 4,
    totalPrice: 596,
    extras: [{ id: 1, name: 'WiFi', icon: 'wifi' }],
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    breakfast: false,
  };

  it('starts with empty draft (not null)', () => {
    const store = useBookingStore();
    expect(store.draft).not.toBeNull();
    expect(store.draft.roomId).toBe(0);
    expect(store.draft.firstName).toBe('');
  });

  it('stores a draft via setDraft', () => {
    const store = useBookingStore();
    store.setDraft(sampleDraft);
    expect(store.draft.roomId).toBe(1);
    expect(store.draft.roomTitle).toBe('Deluxe Suite');
    expect(store.draft.firstName).toBe('');
  });

  it('updates guest info via updateGuestInfo', () => {
    const store = useBookingStore();
    store.setDraft(sampleDraft);
    store.updateGuestInfo({ firstName: 'Max', lastName: 'Mustermann', email: 'max@example.com', confirmEmail: 'max@example.com', breakfast: true });
    expect(store.draft.firstName).toBe('Max');
    expect(store.draft.lastName).toBe('Mustermann');
    expect(store.draft.email).toBe('max@example.com');
    expect(store.draft.breakfast).toBe(true);
  });

  it('clears all data via clearAll', () => {
    const store = useBookingStore();
    store.setDraft(sampleDraft);
    store.setStep(2);
    store.clearAll();
    expect(store.draft.roomId).toBe(0);
    expect(store.currentStep).toBe(0);
    expect(store.bookingResult).toBeNull();
    expect(store.error).toBeNull();
  });

  it('manages currentStep via setStep', () => {
    const store = useBookingStore();
    expect(store.currentStep).toBe(0);
    store.setStep(1);
    expect(store.currentStep).toBe(1);
    store.setStep(2);
    expect(store.currentStep).toBe(2);
  });

  it('hasDraft returns false for empty draft', () => {
    const store = useBookingStore();
    expect(store.hasDraft()).toBe(false);
  });

  it('hasDraft returns true when room and dates are set', () => {
    const store = useBookingStore();
    store.setDraft(sampleDraft);
    expect(store.hasDraft()).toBe(true);
  });
});
