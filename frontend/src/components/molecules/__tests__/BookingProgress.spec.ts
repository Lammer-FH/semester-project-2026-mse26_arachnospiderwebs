import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import BookingProgress from '../BookingProgress.vue';

const defaultSteps = [
  { title: 'Gastinformationen' },
  { title: 'Überprüfen' },
  { title: 'Bestätigung' },
];

function createWrapper(steps = defaultSteps, currentStep = 0) {
  return mount(BookingProgress, {
    props: { steps, currentStep },
    global: {
      stubs: {
        IonIcon: true,
      },
    },
  });
}

describe('BookingProgress', () => {
  it('renders all steps', () => {
    const wrapper = createWrapper();
    const labels = wrapper.findAll('.step-label');
    expect(labels).toHaveLength(3);
    expect(labels[0].text()).toBe('Gastinformationen');
    expect(labels[1].text()).toBe('Überprüfen');
    expect(labels[2].text()).toBe('Bestätigung');
  });

  it('marks the first step as active by default', () => {
    const wrapper = createWrapper(defaultSteps, 0);
    const steps = wrapper.findAll('.step');
    expect(steps[0].classes()).toContain('step--active');
    expect(steps[1].classes()).toContain('step--upcoming');
    expect(steps[2].classes()).toContain('step--upcoming');
  });

  it('marks completed steps correctly', () => {
    const wrapper = createWrapper(defaultSteps, 2);
    const steps = wrapper.findAll('.step');
    expect(steps[0].classes()).toContain('step--completed');
    expect(steps[1].classes()).toContain('step--completed');
    expect(steps[2].classes()).toContain('step--active');
  });

  it('renders checkmark for completed steps', () => {
    const wrapper = createWrapper(defaultSteps, 2);
    const steps = wrapper.findAll('.step');
    expect(steps[0].find('.step-icon').exists()).toBe(true);
    expect(steps[1].find('.step-icon').exists()).toBe(true);
    expect(steps[2].find('.step-icon').exists()).toBe(false);
  });

  it('renders step numbers for active and upcoming steps', () => {
    const wrapper = createWrapper(defaultSteps, 1);
    const steps = wrapper.findAll('.step');
    expect(steps[0].find('.step-number').exists()).toBe(false);
    expect(steps[1].find('.step-number').exists()).toBe(true);
    expect(steps[1].find('.step-number').text()).toBe('2');
    expect(steps[2].find('.step-number').exists()).toBe(true);
    expect(steps[2].find('.step-number').text()).toBe('3');
  });

  it('sets aria-current="step" on the active step', () => {
    const wrapper = createWrapper(defaultSteps, 1);
    const steps = wrapper.findAll('.step');
    expect(steps[0].attributes('aria-current')).toBeUndefined();
    expect(steps[1].attributes('aria-current')).toBe('step');
    expect(steps[2].attributes('aria-current')).toBeUndefined();
  });

  it('has accessible nav with aria-label', () => {
    const wrapper = createWrapper();
    const nav = wrapper.find('nav');
    expect(nav.attributes('aria-label')).toBe('Buchungsfortschritt');
  });

  it('has sr-only region with current step announcement', () => {
    const wrapper = createWrapper(defaultSteps, 0);
    const srOnly = wrapper.find('.sr-only');
    expect(srOnly.exists()).toBe(true);
    expect(srOnly.attributes('aria-live')).toBe('polite');
    expect(srOnly.text()).toContain('Schritt 1 von 3');
    expect(srOnly.text()).toContain('Gastinformationen');
  });

  it('updates sr-only text when current step changes', async () => {
    const wrapper = createWrapper(defaultSteps, 0);
    await wrapper.setProps({ currentStep: 2 });
    const srOnly = wrapper.find('.sr-only');
    expect(srOnly.text()).toContain('Schritt 3 von 3');
    expect(srOnly.text()).toContain('Bestätigung');
  });

  it('uses semantic nav and ol elements', () => {
    const wrapper = createWrapper();
    expect(wrapper.find('nav').exists()).toBe(true);
    expect(wrapper.find('ol').exists()).toBe(true);
  });

  it('renders with one step correctly', () => {
    const wrapper = createWrapper([{ title: 'Nur ein Schritt' }], 0);
    const steps = wrapper.findAll('.step');
    expect(steps).toHaveLength(1);
    expect(steps[0].classes()).toContain('step--active');
  });

  it('handles all steps completed (beyond last index)', () => {
    const wrapper = createWrapper(defaultSteps, 3);
    const steps = wrapper.findAll('.step');
    steps.forEach((step) => {
      expect(step.classes()).toContain('step--completed');
    });
  });
});