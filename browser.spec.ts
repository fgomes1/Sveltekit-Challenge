import { test, expect } from '@playwright/test';

test('challenge success scenario', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await page.locator('input').nth(0).fill('John Doe');
    await page.locator('input').nth(1).fill('123456789');
    await page.locator('input').nth(2).fill('john@example.com');
    await page.click('button:has-text("Start Challenge")');
    await expect(page.locator('text=Countdown')).toBeVisible();
    // Click "Enviar" immediately for success scenario
    await page.click('button:has-text("Enviar")');
    await expect(page.locator('text=Desafio finalizado com sucesso!')).toBeVisible();
    // Close the modal
    await page.click('button:has-text("✕")');
});

test('challenge failure scenario', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await page.locator('input').nth(0).fill('Jane Doe');
    await page.locator('input').nth(1).fill('987654321');
    await page.locator('input').nth(2).fill('jane@example.com');
    await page.click('button:has-text("Start Challenge")');
    // Wait 16 seconds to expire the timer
    await page.waitForTimeout(16000);
    // Ensure modal is not intercepting clicks
    await page.evaluate(() => {
        const modal = document.querySelector('.modal.modal-open') as HTMLElement;
        if (modal) {
            modal.style.pointerEvents = 'none';
        }
    });
    await page.click('button:has-text("Enviar")');
    await expect(page.locator('text=Desafio finalizado com falha!')).toBeVisible();
    // Ensure modal is not intercepting clicks again
    await page.evaluate(() => {
        const modal = document.querySelector('.modal.modal-open') as HTMLElement;
        if (modal) {
            modal.style.pointerEvents = 'auto';
        }
    });
    await page.click('button:has-text("✕")');
});

test('candidate page navigation', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await page.locator('input').nth(0).fill('Alice');
    await page.locator('input').nth(1).fill('55555555');
    await page.locator('input').nth(2).fill('alice@example.com');
    await page.click('button:has-text("Start Challenge")');
    await page.click('a:has-text("Candidate")');
    await expect(page.locator('text=Candidate Page')).toBeVisible();
    await expect(page.locator('p:has-text("Name: Alice")')).toBeVisible();
    // Navigate back to challenge page
    await page.click('button:has-text("Back to Challenge")');
    await expect(page.locator('text=Challenge Page')).toBeVisible();
});

