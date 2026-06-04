import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ConfirmEmailInput from '../ConfirmEmailInput.vue';

function createWrapper(modelValue = '', email = '', props = {}) {
  return mount(ConfirmEmailInput, {
    props: { modelValue, email, ...props },
    global: {
      stubs: {
        IonItem: { template: '<div class="ion-item"><slot /></div>' },
        IonLabel: { template: '<label><slot /></label>' },
        IonInput: {
          template: '<input class="ion-input" :value="$attrs.value" @input="$emit(\'ionInput\', { detail: { value: $event.target.value } })" @blur="$emit(\'ionBlur\')" />',
          inheritAttrs: false,
        },
      },
    },
  });
}

describe('ConfirmEmailInput', () => {
  it('renders with default label', () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain('E-Mail bestätigen');
  });

  it('renders with custom label', () => {
    const wrapper = createWrapper('', '', { label: 'Repeat Email' });
    expect(wrapper.text()).toContain('Repeat Email');
  });

  it('emits update:modelValue on input', () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.ion-input');
    (input.element as HTMLInputElement).value = 'a@b.com';
    input.trigger('input');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['a@b.com']);
  });

  it('shows error on blur with empty value', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.ion-input');
    await input.trigger('blur');
    expect(wrapper.text()).toContain('Bitte bestätige deine E-Mail-Adresse.');
  });

  it('shows mismatch error when values differ', async () => {
    const wrapper = createWrapper('other@test.com', 'original@test.com');
    const input = wrapper.find('input.ion-input');
    await input.trigger('blur');
    expect(wrapper.text()).toContain('stimmen nicht überein');
  });

  it('shows no error when values match', async () => {
    const wrapper = createWrapper('same@test.com', 'same@test.com');
    const input = wrapper.find('input.ion-input');
    (input.element as HTMLInputElement).value = 'same@test.com';
    await input.trigger('input');
    await input.trigger('blur');
    expect(wrapper.find('.field-error').exists()).toBe(false);
  });

  it('shows required indicator', () => {
    const wrapper = createWrapper();
    expect(wrapper.html()).toContain('*');
  });
});