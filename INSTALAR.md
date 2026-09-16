# AutoLog — Guia de instalação no Android

## O que você precisa

- Um computador para hospedar os arquivos (qualquer sistema)
- O celular Android com Chrome
- Os arquivos desta pasta

---

## Opção A — GitHub Pages (gratuito, recomendado)

É a forma mais simples: o GitHub hospeda os arquivos gratuitamente com HTTPS,
que é obrigatório para PWA funcionar.

### 1. Crie uma conta no GitHub
Acesse https://github.com e crie uma conta gratuita (se não tiver).

### 2. Crie um repositório
- Clique em **New repository**
- Nome: `autolog` (ou qualquer nome)
- Marque **Public**
- Clique em **Create repository**

### 3. Faça upload dos arquivos
- Na página do repositório, clique em **uploading an existing file**
- Selecione todos os arquivos desta pasta:
  - `index.html`
  - `app.jsx`
  - `manifest.json`
  - `sw.js`
  - `icon-192.png`
  - `icon-512.png`
- Clique em **Commit changes**

### 4. Ative o GitHub Pages
- Vá em **Settings** → **Pages**
- Em **Source**, selecione **Deploy from a branch**
- Branch: `main`, pasta: `/ (root)`
- Clique em **Save**
- Aguarde ~2 minutos. A URL vai aparecer no formato:
  `https://SEU-USUARIO.github.io/autolog/`

### 5. Instale no celular
- Abra o Chrome no Android
- Acesse a URL acima
- O Chrome vai mostrar um banner **"Adicionar à tela inicial"** — toque nele
- Ou: menu ⋮ → **Adicionar à tela inicial**
- Confirme: **Adicionar**

Pronto! O ícone do AutoLog vai aparecer na sua tela inicial como um app nativo.

---

## Opção B — Servidor local na rede Wi-Fi

Use se quiser testar sem publicar na internet.
Computador e celular precisam estar na mesma rede Wi-Fi.

### No computador (Python 3 — já vem instalado no Mac/Linux)
```bash
# Navegue até a pasta autolog-pwa
cd caminho/para/autolog-pwa

# Inicie o servidor
python3 -m http.server 8080
```

### No Windows (sem Python)
Instale o Node.js (https://nodejs.org) e execute:
```bash
npx serve . -p 8080
```

### No celular
- Descubra o IP do computador (Windows: `ipconfig` / Mac/Linux: `ifconfig`)
- Abra o Chrome e acesse: `http://IP-DO-COMPUTADOR:8080`
- Exemplo: `http://192.168.1.10:8080`

> ⚠️ Servidor local não suporta instalação como PWA (exige HTTPS).
> Use para testar o funcionamento antes de publicar no GitHub Pages.

---

## Atualizar o app no futuro

Quando o app receber novas funcionalidades:
1. Substitua o arquivo `app.jsx` no repositório GitHub pelo novo
2. No celular, abra o app e aguarde alguns segundos — o Service Worker
   detecta a mudança e atualiza automaticamente
3. Se necessário, feche e abra o app novamente

---

## Seus dados

Os dados ficam salvos no **localStorage do Chrome** no seu celular.
Eles **não são apagados** ao atualizar o app ou reiniciar o celular.

Para fazer backup ou migrar de celular:
- Abra o AutoLog → ícone de engrenagem → **Exportar / Compartilhar dados**
- No novo celular, abra o AutoLog → engrenagem → **Importar backup**
