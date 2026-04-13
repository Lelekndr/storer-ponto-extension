# Storer Ponto Extension

Extensão de navegador (Chrome/Edge) para registro de ponto eletrônico dos colaboradores da Storer Sistemas.

Desenvolvida com TypeScript, React 18, Vite e Manifest V3.

---

## Estrutura do Repositório
storer-ponto-extension/
├── mock-api/             # Servidor mock da ponto-web-api (Node.js + Express)
├── public/               # manifest.json e ícones
├── src/                  # Código-fonte da extensão
│   ├── popup/            # Interface principal (React)
│   ├── background/       # Service Worker
│   ├── options/          # Página de configurações
│   ├── services/         # AuthService, PontoService, HttpClient, StorageService
│   └── types/            # Interfaces TypeScript
└── tests/                # Testes unitários (Vitest)


---

## Como Rodar

### Pré-requisitos
- Node.js 20+
- Google Chrome ou Microsoft Edge

### 1. Iniciar a Mock API

A extensão depende de uma API REST para registrar e consultar batidas.
Em produção, essa API seria a `ponto-web-api` hospedada no Azure.

```bash
cd mock-api
npm install
npx ts-node server.ts
# API rodando em http://localhost:3001
```

### 2. Build da Extensão

```bash
# Na raiz do projeto
npm install
npm run build
```

### 3. Carregar no Chrome

1. Abra `chrome://extensions`
2. Ative o **Developer mode** (canto superior direito)
3. Clique em **Load unpacked**
4. Selecione a pasta `dist/`
5. O ícone da extensão aparecerá na barra do Chrome 🧩

### 4. Rodar os Testes

```bash
# Na raiz do projeto
npm test
```

---

## Funcionalidades Implementadas

- ✅ Login simulado (mock) — estrutura pronta para integração com Zitadel OIDC/PKCE
- ✅ Registro de batida com 1 clique
- ✅ Toast de confirmação com horário e tipo da batida
- ✅ Lista de batidas do dia com atualização automática
- ✅ Saldo de horas do mês
- ✅ Retry automático com backoff exponencial (3x: 1s, 2s, 4s)
- ✅ Suporte offline com fila local (sincroniza quando reconectar)
- ✅ Logout com limpeza de sessão
- ✅ 15 testes unitários passando (AuthService, StorageService, HttpClient)
- ✅ Service Worker registrado (base para TokenRefresh e Lembretes — Sprint 2)

## Funcionalidades Previstas (Sprint 2)

- ⏳ Integração real com Zitadel OIDC/PKCE
- ⏳ TokenRefreshService — renovação automática de token
- ⏳ ReminderService — notificações de lembrete via chrome.alarms
- ⏳ Geolocalização nas batidas (com consentimento LGPD)
- ⏳ Página de configurações completa

---

## Decisões Técnicas

**Por que mock de autenticação?**
A integração com Zitadel OIDC/PKCE requer configuração de uma aplicação Native no IdP
(redirect_uri para `chrome-extension://{ID}`). A estrutura do `AuthService` já está
preparada para receber o fluxo real de PKCE — o `loginMock()` seria substituído pelo
fluxo completo sem mudanças nos componentes ou hooks.

**Por que os tokens ficam em storages diferentes?**
Conforme RNF-02.2 e RNF-02.3 do SRS: o `access_token` fica em `chrome.storage.session`
(some ao fechar o browser) e o `refresh_token` em `chrome.storage.local` (persiste).
Isso garante que sessões não fiquem abertas indefinidamente em máquinas compartilhadas.

**Por que separar serviços de componentes?**
Os componentes React são "burros" — só exibem dados. Toda lógica de negócio fica nos
serviços (`PontoService`, `AuthService`) e nos hooks (`useBatidas`, `useAuth`).
Isso facilita testes unitários e manutenção.

**Por que o erro 401 não sofre retry?**
Diferente de erros de rede que são temporários, um 401 indica que o token é inválido —
retentar não vai resolver. Por isso o `HttpClient` usa um `NonRetryableError` para
interromper o loop de retry imediatamente e redirecionar para o login.