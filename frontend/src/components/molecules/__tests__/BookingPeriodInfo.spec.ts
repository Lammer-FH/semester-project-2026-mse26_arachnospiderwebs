import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import BookingPeriodInfo from '../BookingPeriodInfo.vue';

function createWrapper(props = {}) {
  return mount(BookingPeriodInfo, {
    props: {
      checkIn: '2026-07-01',
      checkOut: '2026-07-05',
      nights: 4,
      ...props,
    },
  });
}

describe('BookingPeriodInfo', () => {
  it('renders the heading', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.info-heading').text()).toBe('Buchungszeitraum');
  });

  it('renders check-in date', () => {
    const wrapper = createWrapper({ checkIn: '2026-07-01' });
    expect(wrapper.find('[data-testid="check-in"]').text()).toContain('1.07.2026');
  });

  it('renders check-out date', () => {
    const wrapper = createWrapper({ checkOut: '2026-07-05' });
    expect(wrapper.find('[data-testid="check-out"]').text()).toContain('5.07.2026');
  });

  it('renders number of nights', () => {
    const wrapper = createWrapper({ nights: 3 });
    expect(wrapper.find('[data-testid="nights"]').text()).toBe('3');
  });
});
