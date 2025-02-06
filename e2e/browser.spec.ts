import { test, expect } from '@playwright/test';

async function waitForButtonHoverToBeRed(page, selector) {
    await page.hover(selector);
    await page.waitForFunction(selector => {
        const button = document.querySelector(selector);
        if (!button) return false;
        const style = window.getComputedStyle(button);
        return style.backgroundColor === 'rgb(239, 68, 68)'; // Cor vermelha em RGB correspondente a bg-red-500
    }, selector);
}

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
    // Wait until the text "Desafio finalizado com falha!" is visible
    await page.waitForSelector('text=Desafio finalizado com falha!');
    await expect(page.locator('text=Desafio finalizado com falha!')).toBeVisible();
    // Wait for the "X" button to be red on hover
    await waitForButtonHoverToBeRed(page, '#close-modal-button');
    // Close the modal by clicking the "X"
    await page.click('#close-modal-button');
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

