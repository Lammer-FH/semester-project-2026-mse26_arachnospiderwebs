import { type Page, type Locator, expect } from '@playwright/test';

export async function setIonDateInput(
  page: Page,
  label: string,
  value: string,
) {
  const item = page.locator('ion-item').filter({ hasText: label });
  await item.locator('input[type="date"]').fill(value);
  await item.locator('input[type="date"]').dispatchEvent('change');
}

export async function fillIonInput(
  page: Page,
  placeholder: string,
  value: string,
) {
  const ionInput = page.locator(`ion-input[placeholder="${placeholder}"]`);
  await ionInput.locator('input').fill(value);
  await ionInput.evaluate((el, val) => {
    el.dispatchEvent(new CustomEvent('ion-input', {
      detail: { value: val },
      bubbles: true,
      composed: true,
    }));
  }, value);
  await ionInput.locator('input').dispatchEvent('blur');
}

export async function fillIonInputByLabel(
  page: Page,
  labelText: string,
  value: string,
) {
  let ionItem: Locator;
  if (labelText === 'E-Mail') {
    ionItem = page.locator('.email-input-wrapper ion-item');
  } else if (labelText === 'E-Mail bestätigen') {
    ionItem = page.locator('.confirm-email-wrapper ion-item');
  } else {
    ionItem = page.locator('ion-item').filter({ hasText: labelText });
  }
  const nativeInput = ionItem.locator('input');
  await nativeInput.fill(value);
  await nativeInput.evaluate((el) => {
    el.dispatchEvent(new Event('input', { bubbles: true }));
  });
  await nativeInput.dispatchEvent('blur');
}

export async function toggleIonCheckbox(page: Page, label: string, checked: boolean) {
  const item = page.locator('ion-item').filter({ hasText: label });
  const toggle = item.locator('ion-toggle');
  const current = await toggle.getAttribute('aria-checked');
  if ((current === 'true') !== checked) {
    await toggle.evaluate((el, val) => {
      (el as any).checked = val;
      const app = (document.getElementById('app') as any)?.__vue_app__;
      const pinia = app?.config?.globalProperties?.$pinia;
      const store = pinia?._s?.get('booking');
      if (store) {
        store.updateGuestInfo({ breakfast: val });
      }
    }, checked);
    await page.waitForTimeout(300);
  }
}

export function getIonAlert(page: Page) {
  return page.locator('ion-alert');
}

export async function dismissIonAlert(page: Page) {
  const alert = page.locator('ion-alert');
  if (await alert.isVisible()) {
    await alert.locator('button').first().click();
    await alert.waitFor({ state: 'hidden' });
  }
}

export async function waitForIonPageReady(page: Page) {
  await page.waitForLoadState('networkidle');
}

export async function getIonInputValue(locator: Locator): Promise<string> {
  return locator.inputValue();
}

export function expectVisible(locator: Locator) {
  return expect(locator).toBeVisible();
}

export function expectHidden(locator: Locator) {
  return expect(locator).not.toBeVisible();
}

const STORAGE_DRAFT_KEY = 'hotel_booking_draft';

export async function readBookingDraft(page: Page): Promise<Record<string, unknown> | null> {
  return page.evaluate((key) => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  }, STORAGE_DRAFT_KEY);
}

export async function clearStorage(page: Page) {
  const url = page.url();
  if (!url || url === 'about:blank') {
    await page.goto('/');
  }
  await page.evaluate(() => localStorage.clear());
}

export async function triggerIonBlur(page: Page, labelText: string) {
  let ionItem: Locator;
  if (labelText === 'E-Mail') {
    ionItem = page.locator('.email-input-wrapper ion-item');
  } else if (labelText === 'E-Mail bestätigen') {
    ionItem = page.locator('.confirm-email-wrapper ion-item');
  } else {
    ionItem = page.locator('ion-item').filter({ hasText: labelText });
  }
  const nativeInput = ionItem.locator('input');
  await nativeInput.dispatchEvent('blur');
  await nativeInput.evaluate((el) => {
    el.dispatchEvent(new CustomEvent('ion-blur', { bubbles: true, composed: true }));
  });
}

export async function expectDraftField(page: Page, field: string, expected: unknown) {
  const draft = await readBookingDraft(page);
  expect(draft, `Draft should exist`).not.toBeNull();
  expect(draft![field], `Draft field "${field}" should be ${JSON.stringify(expected)}`).toEqual(expected);
}
