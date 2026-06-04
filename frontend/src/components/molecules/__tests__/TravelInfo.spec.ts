import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import TravelInfo from '../TravelInfo.vue';

function createWrapper(props = {}) {
  return mount(TravelInfo, {
    props: {
      publicTransport: 'Tram line 1 to station',
      ...props,
    },
  });
}

describe('TravelInfo', () => {
  it('renders the heading', () => {
    const wrapper = createWrapper({ publicTransport: 'Bus' });
    expect(wrapper.find('.info-heading').text()).toBe('Anreise mit öffentlichen Verkehrsmitteln');
  });

  it('renders public transport info', () => {
    const wrapper = createWrapper({ publicTransport: 'S-Bahn S1' });
    expect(wrapper.text()).toContain('S-Bahn S1');
  });

  it('renders train station', () => {
    const wrapper = createWrapper({ trainStation: 'Wien Hbf' });
    expect(wrapper.text()).toContain('Wien Hbf');
  });

  it('renders travel tips', () => {
    const wrapper = createWrapper({ travelTips: 'Avoid rush hour' });
    expect(wrapper.text()).toContain('Avoid rush hour');
  });

  it('shows empty state when no info provided', () => {
    const wrapper = createWrapper({
      publicTransport: null,
      trainStation: null,
      travelTips: null,
    });
    expect(wrapper.text()).toContain('Keine Reiseinformationen verfügbar');
  });

  it('renders aria-labelledby attribute', () => {
    const wrapper = createWrapper({ publicTransport: 'Bus' });
    expect(wrapper.find('section').attributes('aria-labelledby')).toBe('travel-heading');
  });
});
