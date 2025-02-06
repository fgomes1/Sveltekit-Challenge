import { defineConfig } from '@playwright/test';

export default defineConfig({
    webServer: {
        command: 'npm run build && npm run preview',
        port: 4173
    },
    testDir: 'e2e',
    testMatch: /(.+.)?(test|spec).[jt]s/,
    use: {
        headless: false,
        launchOptions: {
            slowMo: 800 // Adiciona um atraso de 500ms entre as ações
        }
    }
});


