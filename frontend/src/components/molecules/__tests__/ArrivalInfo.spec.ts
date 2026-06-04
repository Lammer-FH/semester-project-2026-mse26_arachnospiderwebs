import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ArrivalInfo from '../ArrivalInfo.vue';

function createWrapper(props = {}) {
  return mount(ArrivalInfo, {
    props: {
      address: 'Musterstrasse 1, 1010 Wien',
      ...props,
    },
  });
}

describe('ArrivalInfo', () => {
  it('renders the heading', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.info-heading').text()).toBe('Anreise');
  });

  it('renders address', () => {
    const wrapper = createWrapper({ address: 'Teststrasse 5, 4020 Linz' });
    expect(wrapper.find('.info-address').text()).toBe('Teststrasse 5, 4020 Linz');
  });

  it('renders directions when provided', () => {
    const wrapper = createWrapper({ directions: 'A1 exit 15' });
    expect(wrapper.text()).toContain('A1 exit 15');
  });

  it('does not render directions when null', () => {
    const wrapper = createWrapper({ directions: null });
    expect(wrapper.text()).not.toContain('Anfahrt');
  });

  it('renders parking info when provided', () => {
    const wrapper = createWrapper({ parkingInfo: 'Free parking' });
    expect(wrapper.text()).toContain('Free parking');
  });

  it('renders check-in time', () => {
    const wrapper = createWrapper({ checkInTime: '15:00' });
    expect(wrapper.text()).toContain('15:00');
  });

  it('renders check-out time', () => {
    const wrapper = createWrapper({ checkOutTime: '11:00' });
    expect(wrapper.text()).toContain('11:00');
  });

  it('renders check-in instructions', () => {
    const wrapper = createWrapper({ checkInInstructions: 'Key at reception' });
    expect(wrapper.text()).toContain('Key at reception');
  });

  it('renders aria-labelledby attribute', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('section').attributes('aria-labelledby')).toBe('arrival-heading');
  });
});
