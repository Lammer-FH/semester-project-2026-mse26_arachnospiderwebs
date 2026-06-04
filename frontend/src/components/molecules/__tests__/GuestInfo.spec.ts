import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import GuestInfo from '../GuestInfo.vue';

function createWrapper(props = {}) {
  return mount(GuestInfo, {
    props: {
      firstName: 'Max',
      lastName: 'Mustermann',
      email: 'max@example.com',
      breakfast: true,
      ...props,
    },
  });
}

describe('GuestInfo', () => {
  it('renders the heading', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('.info-heading').text()).toBe('Gast');
  });

  it('renders first name', () => {
    const wrapper = createWrapper({ firstName: 'Anna' });
    expect(wrapper.find('[data-testid="guest-firstname"]').text()).toBe('Anna');
  });

  it('renders last name', () => {
    const wrapper = createWrapper({ lastName: 'Schmidt' });
    expect(wrapper.find('[data-testid="guest-lastname"]').text()).toBe('Schmidt');
  });

  it('renders email', () => {
    const wrapper = createWrapper({ email: 'anna@example.com' });
    expect(wrapper.find('[data-testid="guest-email"]').text()).toBe('anna@example.com');
  });

  it('shows "Ja" when breakfast is true', () => {
    const wrapper = createWrapper({ breakfast: true });
    expect(wrapper.find('[data-testid="guest-breakfast"]').text()).toBe('Ja');
  });

  it('shows "Nein" when breakfast is false', () => {
    const wrapper = createWrapper({ breakfast: false });
    expect(wrapper.find('[data-testid="guest-breakfast"]').text()).toBe('Nein');
  });

  it('renders aria-labelledby attribute', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('section').attributes('aria-labelledby')).toBe('guest-heading');
  });
});
