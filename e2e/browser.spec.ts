import { test, expect } from '@playwright/test';

test('challenge success scenario', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await expect(page.locator('input').nth(0)).toBeVisible();
    await expect(page.locator('input').nth(1)).toBeVisible();
    await expect(page.locator('input').nth(2)).toBeVisible();
    await page.locator('input').nth(0).fill('John Doe');
    await page.locator('input').nth(1).fill('123456789');
    await page.locator('input').nth(2).fill('john@example.com');
    await page.click('button:has-text("Start Challenge")');
    await expect(page.locator('text=Countdown')).toBeVisible();
    // Click "Enviar" immediately for success scenario
    await page.click('button:has-text("Enviar")');
    await expect(page.locator('text=Desafio finalizado com sucesso!')).toBeVisible();
    // Close the modal by clicking outside
    await page.click('body'); // Clicando no corpo da página para fechar o modal
    await expect(page.locator('text=Desafio finalizado com sucesso!')).not.toBeVisible();
});

test('challenge failure scenario', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await expect(page.locator('input').nth(0)).toBeVisible();
    await expect(page.locator('input').nth(1)).toBeVisible();
    await expect(page.locator('input').nth(2)).toBeVisible();
    await page.locator('input').nth(0).fill('Jane Doe');
    await page.locator('input').nth(1).fill('987654321');
    await page.locator('input').nth(2).fill('jane@example.com');
    await page.click('button:has-text("Start Challenge")');
    // Wait 16 seconds to expire the timer
    await page.waitForTimeout(16000);
    await expect(page.locator('text=Desafio finalizado com falha!')).toBeVisible();
    // Close the modal by clicking the "X"
    await page.click('button:has-text("✕")');
    await expect(page.locator('text=Desafio finalizado com falha!')).not.toBeVisible();
});

test('candidate page navigation', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await expect(page.locator('input').nth(0)).toBeVisible();
    await expect(page.locator('input').nth(1)).toBeVisible();
    await expect(page.locator('input').nth(2)).toBeVisible();
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

test('timer continues counting after navigation', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await expect(page.locator('input').nth(0)).toBeVisible();
    await expect(page.locator('input').nth(1)).toBeVisible();
    await expect(page.locator('input').nth(2)).toBeVisible();
    await page.locator('input').nth(0).fill('Test User');
    await page.locator('input').nth(1).fill('123456789');
    await page.locator('input').nth(2).fill('test@example.com');
    await page.click('button:has-text("Start Challenge")');

    // Wait for a few seconds to let the timer start
    await page.waitForTimeout(5000);
    const timerValueBefore = await page.locator('text=Countdown').innerText();

    // Navigate to another page
    await page.click('a:has-text("Candidate")');
    await expect(page.locator('text=Candidate Page')).toBeVisible();

    // Navigate back to the challenge page
    await page.click('button:has-text("Back to Challenge")');
    await expect(page.locator('text=Challenge Page')).toBeVisible();

    // Wait for a few more seconds
    await page.waitForTimeout(5000);
    const timerValueAfter = await page.locator('text=Countdown').innerText();

    // Ensure the timer has continued counting
    expect(timerValueAfter).not.toBe(timerValueBefore);
});

