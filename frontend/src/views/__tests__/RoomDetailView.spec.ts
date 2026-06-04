import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, type Pinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import { nextTick } from 'vue';
import RoomDetailView from '../RoomDetailView.vue';
import { useRoomStore } from '@/stores/roomStore';
import { useBookingStore } from '@/stores/bookingStore';

const routes = [
  { path: '/', redirect: '/home' },
  { path: '/home', component: {} },
  { path: '/rooms/:id', name: 'RoomDetail', component: RoomDetailView },
  { path: '/booking', name: 'Booking', component: {} },
];

async function createWrapper(pinia: Pinia) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });
  await router.push('/rooms/1');
  await router.isReady();
  return mount(RoomDetailView, {
    global: {
      plugins: [pinia, router],
      stubs: {
        IonPage: { template: '<div><slot /></div>' },
        IonContent: { template: '<div><slot /></div>' },
        IonSpinner: { template: '<div class="spinner" />' },
        IonText: { template: '<span><slot /></span>' },
        IonButton: {
          template: '<button class="ion-btn" @click="$attrs.onClick ? $attrs.onClick() : null"><slot /></button>',
        },
        IonIcon: true,
        AppNavbar: true,
        DateRangePicker: { template: '<div />' },
        ExtraChip: { template: '<span><slot /></span>' },
      },
    },
    attachTo: document.body,
  });
}

async function settleMount() {
  await nextTick();
  await new Promise((r) => setTimeout(r, 0));
  await nextTick();
}

describe('RoomDetailView', () => {
  let pinia: Pinia;

  beforeEach(() => {
    pinia = createPinia();
    vi.clearAllMocks();
    localStorage.clear();
  });

  /** Set the room store state directly to bypass any Pinia instance mismatch */
  function setRoomDetailState(p: Pinia, available: boolean | null) {
    // Ensure the room store is registered on this pinia
    useRoomStore(p);
    const state = p.state.value.rooms;
    state.loading = false;
    state.error = null;
    state.selectedRoom = {
      id: 1,
      title: 'Deluxe Suite',
      description: 'A nice room',
      imageUrl: 'https://example.com/img.jpg',
      pricePerNight: 149,
      extras: [{ id: 1, name: 'WiFi', icon: 'wifi' }],
      availability: null,
    };
    if (available === true) {
      state.availability = {
        roomId: 1, roomTitle: 'Deluxe Suite',
        checkIn: '2026-07-01', checkOut: '2026-07-05',
        available: true, nights: 4, totalPrice: 596,
      };
    } else if (available === false) {
      state.availability = {
        roomId: 1, roomTitle: 'Deluxe Suite',
        checkIn: '2026-07-01', checkOut: '2026-07-05',
        available: false, nights: 4, totalPrice: 0,
      };
    } else {
      state.availability = null;
    }
  }

  it('shows book now button when room is available', async () => {
    const wrapper = await createWrapper(pinia);
    await settleMount();

    setRoomDetailState(pinia, true);

    const roomStore = useRoomStore(pinia);
    expect(roomStore.availability?.available).toBe(true);
    expect(roomStore.selectedRoom?.title).toBe('Deluxe Suite');

    const vm = wrapper.vm as any;
    vm.checkIn = '2026-07-01';
    vm.checkOut = '2026-07-05';
    await nextTick();

    // Debug: log rendered HTML
    const html = wrapper.html();
    expect(html).toContain('Jetzt buchen');
  });

  it('hides book now button when availability is null', async () => {
    const wrapper = await createWrapper(pinia);
    await settleMount();
    setRoomDetailState(pinia, null);
    const vm = wrapper.vm as any;
    vm.checkIn = '2026-07-01';
    vm.checkOut = '2026-07-05';
    await nextTick();
    const html = wrapper.html();
    expect(html).not.toContain('Jetzt buchen');
  });

  it('hides book now button when room is not available', async () => {
    const wrapper = await createWrapper(pinia);
    await settleMount();
    setRoomDetailState(pinia, false);
    const vm = wrapper.vm as any;
    vm.checkIn = '2026-07-01';
    vm.checkOut = '2026-07-05';
    await nextTick();
    const html = wrapper.html();
    expect(html).not.toContain('Jetzt buchen');
  });

  it('bookNow sets draft and navigates when clicking book button', async () => {
    const wrapper = await createWrapper(pinia);
    await settleMount();
    setRoomDetailState(pinia, true);
    const vm = wrapper.vm as any;
    vm.checkIn = '2026-07-01';
    vm.checkOut = '2026-07-05';
    await nextTick();

    const html = wrapper.html();
    expect(html).toContain('Jetzt buchen');

    const buttons = wrapper.findAll('button.ion-btn');
    const bookBtn = buttons.find((b) => b.text().includes('Jetzt buchen'));
    expect(bookBtn).toBeDefined();

    await bookBtn!.trigger('click');
    await nextTick();

      const bookingStore = useBookingStore(pinia);
      expect(bookingStore.draft.roomId).toBe(1);
      expect(bookingStore.draft.roomTitle).toBe('Deluxe Suite');
      expect(bookingStore.draft.roomImage).toBe('https://example.com/img.jpg');
      expect(bookingStore.draft.checkIn).toBe('2026-07-01');
      expect(bookingStore.draft.checkOut).toBe('2026-07-05');
      expect(bookingStore.draft.nights).toBe(4);
      expect(bookingStore.draft.totalPrice).toBe(596);
      expect(bookingStore.draft.extras).toEqual([{ id: 1, name: 'WiFi', icon: 'wifi' }]);
  });

  it('shows loading spinner while fetching room', async () => {
    const wrapper = await createWrapper(pinia);
    await nextTick();
    expect(wrapper.find('.spinner').exists()).toBe(true);
  });
});
