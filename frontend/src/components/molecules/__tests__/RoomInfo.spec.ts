import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import RoomInfo from '../RoomInfo.vue';

function createWrapper(props = {}) {
  return mount(RoomInfo, {
    props: {
      title: 'Deluxe Suite',
      description: 'A nice room',
      imageUrl: 'https://example.com/img.jpg',
      extras: [{ id: 1, name: 'WiFi', icon: 'wifi' }],
      ...props,
    },
    global: {
      stubs: {
        ExtraChip: true,
      },
    },
  });
}

describe('RoomInfo', () => {
  it('renders the heading', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.info-heading').text()).toBe('Zimmer');
  });

  it('renders room title', () => {
    const wrapper = createWrapper({ title: 'Penthouse' });
    expect(wrapper.find('[data-testid="room-title"]').text()).toBe('Penthouse');
  });

  it('renders room description', () => {
    const wrapper = createWrapper({ description: 'Spacious room' });
    expect(wrapper.find('.room-desc').text()).toBe('Spacious room');
  });

  it('renders room image', () => {
    const wrapper = createWrapper({ imageUrl: 'https://example.com/room.jpg' });
    const img = wrapper.find('.room-image');
    expect(img.exists()).toBe(true);
    expect(img.attributes('src')).toBe('https://example.com/room.jpg');
  });

  it('renders extras', () => {
    const wrapper = createWrapper({
      extras: [
        { id: 1, name: 'WiFi', icon: 'wifi' },
        { id: 2, name: 'TV', icon: 'tv' },
      ],
    });
    const chips = wrapper.findAllComponents({ name: 'ExtraChip' });
    expect(chips).toHaveLength(2);
  });

  it('does not render image when imageUrl is empty', () => {
    const wrapper = createWrapper({ imageUrl: '' });
    expect(wrapper.find('.room-image').exists()).toBe(false);
  });

  it('renders aria-labelledby attribute on section', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('section').attributes('aria-labelledby')).toBe('room-heading');
  });
});
