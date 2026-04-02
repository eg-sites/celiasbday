# 🎀 Aniversário da Célia Bizerra João
## Birthday Experience · Confirmação de Presença

Site premium de confirmação de presença para o jantar de aniversário e after da Célia, com integração ao Google Sheets via Google Apps Script e publicação gratuita no GitHub Pages.

---

## 📁 Estrutura do Projeto

```
celia-birthday/
├── index.html          ← Site principal (todas as cenas)
├── styles.css          ← CSS premium mobile-first
├── script.js           ← Lógica de cenas, formulários e submissão
├── config.js           ← ⭐ TODOS OS TEXTOS E VARIÁVEIS EDITÁVEIS
├── admin.html          ← Área de administração interna
├── admin.js            ← Lógica do admin
├── apps-script.gs      ← Google Apps Script (colar no script.google.com)
├── README.md           ← Este ficheiro
└── assets/
    ├── kid-after.jpg   ← 🔧 SUBSTITUIR pela foto kid real da Célia
    └── (outros assets decorativos opcionais)
```

---

## 🚀 Guia de Instalação Completo

### PASSO 1 — Clonar / Descarregar o projeto

```bash
# Opção A: criar repositório no GitHub e subir os ficheiros
# Opção B: descarregar e fazer upload direto no GitHub
```

---

### PASSO 2 — Configurar o Google Sheets + Apps Script

#### 2.1 Criar o Google Apps Script

1. Abre [script.google.com](https://script.google.com)
2. Clica em **"Novo projeto"**
3. Apaga o código existente
4. Cola **todo o conteúdo** do ficheiro `apps-script.gs`
5. Clica em 💾 para guardar (dá um nome ao projeto, ex: `Celia Birthday`)

#### 2.2 Publicar como Web App

1. No menu superior, clica em **"Implementar"** → **"Nova implementação"**
2. Clica no ⚙️ ao lado de "Tipo" e escolhe **"Web App"**
3. Configura:
   - **Descrição**: `Celia Birthday v1`
   - **Executar como**: `Eu (o teu email)`
   - **Quem tem acesso**: `Qualquer pessoa`
4. Clica em **"Implementar"**
5. Autoriza as permissões quando pedido
6. **Copia a URL gerada** — parece com:
   ```
   https://script.google.com/macros/s/AKfycb.../exec
   ```

> ⚠️ A Google Sheet é criada automaticamente na tua Google Drive com o nome "Confirmações Célia" quando a primeira resposta chegar.

---

### PASSO 3 — Configurar o config.js

Abre `config.js` e edita as variáveis marcadas com `// ← editar`:

```javascript
// 🔧 URL do Web App (copiada no Passo 2.2)
googleAppsScriptUrl: "https://script.google.com/macros/s/AKfycb.../exec",

// 🔧 Dados do Jantar
dinnerVenueName:    "Aprazível",
dinnerVenueAddress: "Lisboa, Portugal",
dinnerVenueMapsUrl: "https://share.google/MfY5LhM7l7T69CJkF",
dinnerTimeLabel:    "19:15",

// 🔧 Dados do After
afterVenueName:    "SEEN by Olivier - Lisboa",
afterVenueAddress: "Av. da Liberdade 187, Lisbon, Portugal",
afterVenueMapsUrl: "https://share.google/lo61RQSPuwqE0d5kr",
afterTimeLabel:    "22:30",

// 🔧 Chave do admin (muda para algo mais seguro)
adminSecretKey: "celia2026admin",
```

---

### PASSO 4 — Adicionar a foto "kid"

1. Coloca a foto real no ficheiro `assets/kid-after.jpg`
   - Dimensões ideais: **600×800px** (portrait)
   - Formato: JPG ou PNG
   - Pode ser uma foto divertida da Célia em criança
2. O nome deve ser exatamente `kid-after.jpg` (ou atualiza `kidAfterImage` no config.js)

---

### PASSO 5 — Publicar no GitHub Pages (custo zero)

#### 5.1 Criar repositório no GitHub

1. Vai a [github.com](https://github.com) e clica em **"New repository"**
2. Nome: `celia-birthday` (ou qualquer nome)
3. Visibilidade: **Public** (necessário para GitHub Pages grátis)
4. Clica em **"Create repository"**

#### 5.2 Fazer upload dos ficheiros

**Opção A (via browser):**
1. No repositório criado, clica em **"uploading an existing file"**
2. Arrasta todos os ficheiros do projeto (incluindo a pasta `assets/`)
3. Clica em **"Commit changes"**

**Opção B (via Git):**
```bash
git init
git add .
git commit -m "Birthday experience 🎀"
git branch -M main
git remote add origin https://github.com/SEU_USERNAME/celia-birthday.git
git push -u origin main
```

#### 5.3 Ativar GitHub Pages

1. No repositório, vai a **Settings** → **Pages**
2. Em "Source", seleciona **"Deploy from a branch"**
3. Branch: **main** · Pasta: **/ (root)**
4. Clica em **Save**
5. Aguarda 1-2 minutos — a URL será:
   ```
   https://SEU_USERNAME.github.io/celia-birthday/
   ```

---

### PASSO 6 — Personalizar os links por convidado

Para que cada convidado tenha o seu ID registado no Sheets:

```
https://SEU_USERNAME.github.io/celia-birthday/?guest=celia001
https://SEU_USERNAME.github.io/celia-birthday/?guest=maria002
https://SEU_USERNAME.github.io/celia-birthday/?guest=joana003
```

O parâmetro `?guest=` é capturado automaticamente e guardado como `inviteId` no Sheets.

---

## 🔐 Aceder à Área Admin

1. Abre `https://SEU_USERNAME.github.io/celia-birthday/admin.html`
2. Insere a chave definida em `config.js` → `adminSecretKey`
3. A página carrega os dados em tempo real do Google Sheets

---

## ✏️ Como editar textos e informações

**Todas as alterações de texto devem ser feitas APENAS em `config.js`.**

| O que editar | Onde no config.js |
|---|---|
| Nome do restaurante | `dinnerVenueName` |
| Hora do jantar | `dinnerTimeLabel` |
| Morada do jantar | `dinnerVenueAddress` |
| Link Google Maps jantar | `dinnerVenueMapsUrl` |
| Nome do espaço do after | `afterVenueName` |
| Hora do after | `afterTimeLabel` |
| Morada do after | `afterVenueAddress` |
| Link Google Maps after | `afterVenueMapsUrl` |
| Mensagem de welcome | `welcomeMessage` |
| Mensagem de confirmação | `confirmedDinnerMessage` |
| Mensagem de recusa | `declinedDinnerMessage` |

---

## 🖋️ Tipografia utilizada

| Fonte | Uso | Estilo |
|---|---|---|
| **Cormorant Garamond** | Títulos, mensagens principais | Serif elegante, editorial |
| **Great Vibes** | Títulos decorativos, script | Caligrafia sofisticada |
| **Jost** | Corpo de texto, labels, botões | Sans-serif clean |

Todas carregadas via Google Fonts — sem custo.

---

## 📊 Estrutura de Dados (Google Sheets)

Cada linha na Sheet representa uma resposta com as colunas:

| Coluna | Descrição |
|---|---|
| `inviteId` | Parâmetro `?guest=` da URL |
| `guestName` | Nome do convidado principal |
| `dinnerAttendance` | `yes` / `no` |
| `dinnerCompanionsCount` | Número de acompanhantes no jantar |
| `dinnerCompanion1/2/3` | Nomes dos acompanhantes |
| `afterAttendance` | `yes` / `no` |
| `afterCompanionsMode` | `none` / `same` / `other` |
| `afterCompanionsCount` | Número de acompanhantes no after |
| `afterCompanion1/2/3` | Nomes dos acompanhantes |
| `submittedAt` | Data/hora ISO da submissão |
| `userAgent` | Browser/dispositivo |
| `source` | URL de origem |

---

## 🎨 Paleta de Cores

| Nome | Hex | Uso |
|---|---|---|
| Cream | `#fff8f4` | Fundo principal |
| Soft Pink | `#fce8f0` | Fundos secundários |
| Red | `#b20d18` | Cor principal, frames, laços |
| Deep Red | `#7f0912` | Textos em vermelho escuro |
| Rose | `#e07090` | Acentos, labels |
| Blush | `#f6d0dd` | Bordas, elementos delicados |
| Black | `#0a0a0f` | Fundo das cenas do after |
| Gold | `#c9a87c` | Detalhes dourados (opcional) |

---

## ⚡ Performance & Compatibilidade

- ✅ Mobile-first (iPhone Safari + Chrome Android)
- ✅ Animações apenas com `transform` e `opacity`
- ✅ `prefers-reduced-motion` suportado
- ✅ Safe-area para notch do iPhone
- ✅ Sem frameworks pesados (vanilla JS + CSS)
- ✅ Sem backend pago (Google Apps Script grátis)
- ✅ Sem domínio pago (GitHub Pages gratuito)

---

## 🐛 Resolução de Problemas

**Os dados não chegam ao Sheets:**
- Verifica se a URL no `config.js` está correta
- Confirma que o Web App está publicado com acesso "Qualquer pessoa"
- Abre o Apps Script e clica em "Ver execuções" para ver logs de erro

**A página admin não carrega dados:**
- A URL do Apps Script deve suportar GET (doGet)
- Testa a URL diretamente no browser — deve devolver JSON

**As animações não funcionam no Safari:**
- Estão implementadas apenas com CSS transform e opacity
- Se necessário, desativa animações em `styles.css` para a linha `@media (prefers-reduced-motion)`

**A foto kid não aparece:**
- Confirma que o ficheiro está em `assets/kid-after.jpg`
- Verifica se o nome em `config.js` corresponde exatamente

---

## 💌 Créditos

Site criado com muito carinho para o aniversário de **Célia Bizerra João**.  
Estética *Grown & Sexy* · Primavera 2026 · 🎀
