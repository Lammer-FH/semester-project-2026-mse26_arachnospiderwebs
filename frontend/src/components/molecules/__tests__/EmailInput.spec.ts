import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, h } from 'vue';
import EmailInput from '../EmailInput.vue';

const IonInputStub = defineComponent({
  props: ['value'],
  inheritAttrs: false,
  emits: ['ionInput', 'ionBlur'],
  setup(props, { emit, attrs }) {
    return () => h('input', {
      class: 'ion-input',
      type: 'email',
      value: attrs.value,
      onInput(e: Event) {
        emit('ionInput', { detail: { value: (e.target as HTMLInputElement).value } });
      },
      onBlur() {
        emit('ionBlur');
      },
    });
  },
});

function createWrapper(modelValue = '', props = {}) {
  return mount(EmailInput, {
    props: { modelValue, ...props },
    global: {
      stubs: {
        IonItem: { template: '<div class="ion-item"><slot /></div>' },
        IonLabel: { template: '<label><slot /></label>' },
        IonInput: IonInputStub,
      },
    },
  });
}

describe('EmailInput', () => {
  it('renders with default label', () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain('E-Mail');
  });

  it('renders with custom label', () => {
    const wrapper = createWrapper('', { label: 'Custom Label' });
    expect(wrapper.text()).toContain('Custom Label');
  });

  it('emits update:modelValue on input', () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.ion-input');
    (input.element as HTMLInputElement).value = 'test@example.com';
    input.trigger('input');
    expect(wrapper.emitted('update:modelValue')).toBeTruthy();
  });

  it('shows error on blur with empty value', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.ion-input');
    await input.trigger('blur');
    expect(wrapper.find('.field-error').exists()).toBe(true);
    expect(wrapper.text()).toContain('Bitte gib deine E-Mail-Adresse ein.');
  });

  it('shows format error on blur with email missing @', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.ion-input');
    (input.element as HTMLInputElement).value = 'noatsign';
    await input.trigger('input');
    await input.trigger('blur');
    expect(wrapper.find('.field-error').exists()).toBe(true);
  });

  it('shows no error for valid email on blur', async () => {
    const wrapper = createWrapper();
    const input = wrapper.find('input.ion-input');
    (input.element as HTMLInputElement).value = 'user@example.com';
    await input.trigger('input');
    await input.trigger('blur');
    expect(wrapper.find('.field-error').exists()).toBe(false);
  });

  it('shows required indicator', () => {
    const wrapper = createWrapper();
    expect(wrapper.html()).toContain('*');
  });
});