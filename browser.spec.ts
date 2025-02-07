import { test, expect } from '@playwright/test';

async function waitForButtonHoverToBeRed(page, selector) {
    await page.hover(selector);
    await page.waitForFunction(selector => {
        const button = document.querySelector(selector);
        if (!button) return false;
        const style = window.getComputedStyle(button);
        return style.backgroundColor === 'rgb(239, 68, 68)';
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
    await page.click('button:has-text("Iniciar Desafio")');
    await expect(page.locator('text=Contagem')).toBeVisible();
    await page.click('button:has-text("Enviar")');
    await expect(page.locator('text=Desafio finalizado com sucesso!')).toBeVisible();
    await page.click('#close-modal-button');
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
    await page.click('button:has-text("Iniciar Desafio")');
    await page.waitForSelector('text=Desafio finalizado com falha!');
    await expect(page.locator('text=Desafio finalizado com falha!')).toBeVisible();
    await waitForButtonHoverToBeRed(page, '#close-modal-button');
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
    await page.click('button:has-text("Iniciar Desafio")');
    await page.click('a:has-text("Candidato")');
    await expect(page.locator('h1:has-text("Página do Candidato")')).toBeVisible();
    await expect(page.locator('p:has-text("Nome: Alice")')).toBeVisible();
    await page.click('button:has-text("Voltar ao Desafio")');
    await expect(page.locator('h1:has-text("Desafio Lesser")')).toBeVisible();
});

test('timer continues counting with DaisyUI countdown', async ({ page }) => {
    await page.goto('http://localhost:4173');
    await expect(page.locator('input').nth(0)).toBeVisible();
    await expect(page.locator('input').nth(1)).toBeVisible();
    await expect(page.locator('input').nth(2)).toBeVisible();
    await page.locator('input').nth(0).fill('Alice');
    await page.locator('input').nth(1).fill('55555555');
    await page.locator('input').nth(2).fill('alice@example.com');
    await page.click('button:has-text("Iniciar Desafio")');

  
    await page.waitForTimeout(2000);
  
    const [minBefore, secBefore] = await getCountdownValues(page);
  
    await page.click('a:has-text("Candidato")');
    await expect(page.locator('h1:has-text("Página do Candidato")')).toBeVisible();
    await expect(page.locator('p:has-text("Nome: Alice")')).toBeVisible();
    await page.click('button:has-text("Voltar ao Desafio")');
    await expect(page.locator('h1:has-text("Desafio Lesser")')).toBeVisible();
    
    await page.waitForTimeout(3000);
  
    const [minAfter, secAfter] = await getCountdownValues(page);
  
    const totalBefore = minBefore * 60 + secBefore;
    const totalAfter = minAfter * 60 + secAfter;
  
    expect(totalAfter).toBeLessThan(totalBefore);
  });
  
  async function getCountdownValues(page) {
    const minuteStyle = await page.locator('.countdown span').nth(0).getAttribute('style');
    const secondStyle = await page.locator('.countdown span').nth(1).getAttribute('style');
  
    const min = parseInt(minuteStyle.replace('--value:', '').replace(';', '').trim());
    const sec = parseInt(secondStyle.replace('--value:', '').replace(';', '').trim());
    return [min, sec];
  }
  