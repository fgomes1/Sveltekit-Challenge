# sv
Crie um site que exiba um formulário com os campos "Nome", "Telefone" e "Email". Ao clicar no botão "Iniciar Desafio", o site deve exibir um contador regressivo de 15 segundos no formato mm:ss. Ao clicar no botão "Enviar", o site deve exibir um modal com o texto "Desafio finalizado com sucesso!".
Se o usuário demorar mais que 15 segundos para clicar em "Enviar", o site deve exibir um modal com o texto "Desafio finalizado com falha!".
O modal deve ter um X no canto superior direito (você pode e deve usar o modelo do DaisyUI) e deve fechar quando o usuário clica fora do modal e quando clica no X.
O site deve ter uma página chamada "candidate" que exibe o nome, telefone e email do candidato, e esta sessão fica visível apenas após o desafio ser iniciado.
Deve haver um botão no canto superior direito da tela que, ao ser clicado, vai para esta página. Nela, deve haver outro botão que, ao ser clicado, volta para a página do desafio.
Ao entrar e sair da página "candidate", a contagem do tempo não deve ser interrompida.

Regras:
- Todo o código deve ser em Typescript, javascript sem tipos não é permitido.
- Utilize apenas Sveltekit, TailwindCSS e DaisyUI. Nenhum outro import é permitido. Se não conseguir com Sveltekit, use React (preferimos muito fortemente Sveltekit).
- Configure o Playwright ao inicializar o projeto. Se for utilizar sveltekit, inicialize o projeto com:

pnpm create svelte@latest my-app
cd my-app
pnpm install
pnpm run dev -- --open

- Siga a estrutura de pastas padrão do Sveltekit.
- Preze pela experiência do usuário.
- Todo o código deve ser client-side, nenhum código server-side é permitido.
- Use o adapter-static para gerar o site estático.
- O código deve ser escrito em TypeScript.
- O código deve ser escrito em inglês.
- NÃO inclua as pastas node_modules, .git, .svelte-kit, .vscode nem build no arquivo zip. O arquivo deve ter no máximo 200kb.
- Vamos executar os seguintes comandos, o que deve resultar no app funcionando em localhost:5173:

unzip challenge.zip
pnpm install
pnpm run dev

- Se os comandos acima não resultarem em um site funcionando em localhost:5173, o desafio será considerado como falha. Os comandos serão executados automaticamente, então preste bastante atenção na estrutura de pastas para que rode de primeira. Teste os comandos acima no seu computador antes de enviar.
- Deve haver cobertura de testes com o playright (deixe o navegador visível para assistirmos o teste). Os testes devem cobrir todos os requisitos solicitados. Todos os testes devem ser executados com o comando npx playwright test browser.spec.ts.
Segue a configuração do arquivo playwright.config.ts:

import type { PlaywrightTestConfig } from '@playwright/test'; import { CandidateSelectionClient } from '../../src/services/CandidateSelectionClient'; const config: PlaywrightTestConfig = { webServer: { command: 'npm run build && npm run preview', port: 4173 }, testDir: 'tests', testMatch: /(.+.)?(test|spec).[jt]s/, use: { headless: false } }; export default config;

Nossa prioridade está primeiro na funcionalidade, em segundo lugar no preenchimento de todos os itens do desafio e em terceiro lugar na qualidade técnica do código que você entregar.

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
npx sv create

# create a new project in my-app
npx sv create my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
