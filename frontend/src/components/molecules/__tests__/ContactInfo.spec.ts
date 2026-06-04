import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ContactInfo from '../ContactInfo.vue';

function createWrapper(props = {}) {
  return mount(ContactInfo, {
    props: {
      phone: null,
      email: null,
      ...props,
    },
  });
}

describe('ContactInfo', () => {
  it('renders the heading', () => {
    const wrapper = createWrapper({ phone: '+43 1 234' });
    expect(wrapper.find('.info-heading').text()).toBe('Kontakt');
  });

  it('renders phone as a tel link', () => {
    const wrapper = createWrapper({ phone: '+43 1 2345678' });
    const link = wrapper.find('.info-link');
    expect(link.exists()).toBe(true);
    expect(link.attributes('href')).toBe('tel:+43 1 2345678');
    expect(link.text()).toBe('+43 1 2345678');
  });

  it('renders email as a mailto link', () => {
    const wrapper = createWrapper({ email: 'hotel@example.com' });
    const link = wrapper.find('.info-link');
    expect(link.attributes('href')).toBe('mailto:hotel@example.com');
    expect(link.text()).toBe('hotel@example.com');
  });

  it('renders emergency contact', () => {
    const wrapper = createWrapper({ emergencyContact: 'Notruf: 112' });
    expect(wrapper.text()).toContain('Notruf: 112');
  });

  it('shows empty state when no info provided', () => {
    const wrapper = createWrapper({
      phone: null,
      email: null,
      emergencyContact: null,
    });
    expect(wrapper.text()).toContain('Keine Kontaktinformationen verfügbar');
  });

  it('renders aria-labelledby attribute', () => {
    const wrapper = createWrapper({ phone: '+43 1 234' });
    expect(wrapper.find('section').attributes('aria-labelledby')).toBe('contact-heading');
  });
});
