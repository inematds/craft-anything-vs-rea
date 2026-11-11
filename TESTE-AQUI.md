# Teste real do Craft Anything 0.6.0 (10/11/2026)

Máquina: Linux ARM64 (aarch64, Ubuntu), Claude Code 2.1.322 logado na **assinatura**, sem nenhuma
chave de API no ambiente. Tudo numa pasta nova e vazia, com a configuração do Craft Anything
isolada nela (`XDG_CONFIG_HOME` e `XDG_DATA_HOME` apontando para a pasta do teste).

## Resultado em 6 linhas

1. Download do `linux-aarch64.tar.gz` (66 MB): SHA256 bate com o `SHA256SUMS.txt`, e a assinatura
   GPG do `SHA256SUMS.txt` confere ("Good signature from ArtCraft Linux Release Signing Key").
2. `craft-anything-cli doctor`: `healthy: true`; achou Claude Code, Codex, Cursor e Claude Desktop
   instalados (não conectados), Chromium, GDB, Java e objdump; servidor MCP respondeu (30 ferramentas).
3. `craft-anything-cli commands`: **322 comandos** em 17 grupos (o README fala em 320).
4. `rebuild` em sala limpa de uma página local (contador de água "Copo Cheio" servida em
   127.0.0.1), pedindo "Gota Certa" em verde, com Claude Code construindo: **pronto em 2 min 21 s**,
   2 rodadas, nota do próprio Craft Anything **98%** (1440 px 99%, 768 px 98%, 390 px 97%).
5. Nossa régua (`conferir/semelhanca.js`): estrutura **93,6 / 90,7 / 85,5** e cor 93,8 / 94,3 / 92,9
   nas larguras 1440 / 820 / 390. É mais dura que a deles porque o nome e o rodapé trocados pesam.
6. Teste de função (`conferir/exemplos/funcoes-contador.js`): **8 de 8** no original e **8 de 8**
   na versão gerada (somar, tirar, zerar, não ficar negativo, barra cheia, celular sem rolagem lateral).

## O que barrou e como passamos

| Tentativa | O que aconteceu | Contorno |
|---|---|---|
| 1ª | "couldn't reach the browser … Connection reset by peer": o Chromium achado era o do snap | Apontar outro Chromium em `engines.tools.chromium` |
| 2ª | "chrome closed after 0.2 s": o Ubuntu 23.10+ bloqueia o sandbox do Chromium (AppArmor restringe *user namespaces*) | Um script de 1 linha que chama o Chromium do Playwright com `--no-sandbox`, só para a página local do teste |
| 3ª | Funcionou | — |

Na sua máquina (Windows, macOS ou Linux com Chrome instalado normalmente) isso não deve aparecer.
Se aparecer no Linux, o caminho limpo é liberar o sandbox (veja o link que o próprio Chromium
imprime), não desligar o sandbox para sites de terceiros.

## Coisas que vimos e que o guia avisa

- **O construtor é o seu Claude Code, com a sua configuração.** Ele rodou `claude -p` e leu o
  CLAUDE.md global da máquina: a resposta final saiu até com o bloco de aviso que as regras daqui
  pedem. Ou seja: o agente age como você.
- **Modo automático ligado de fábrica** (`auto_mode: true` no `settings-show`). Com ele, o
  construtor rodou `npm install` e `npm run build` sem perguntar. No app, desligue em
  Settings → Safety → Auto mode para ele pedir licença.
- Rodamos com `--unattended` (responde a 1ª opção e recusa aprovações) e `--rounds 1`: isso é para
  teste. No uso normal, deixe ele perguntar.
- O agente acrescentou coisas que não pedimos: salvar o contador no navegador (zera a cada dia) e
  uma frase própria no rodapé. Ele mesmo avisou. Confira sempre o que foi além do pedido.
- O `usage.json` do projeto registrou 1,33 milhão de tokens de entrada e "cost_usd 1,24" como valor
  de referência, com **"api_billed_usd": 0,0** — saiu da assinatura, não de API.
- Pasta do projeto: `craft.json`, `capture/` (prints 1440/768/390 + medidas), `app/` (o código
  novo: `src/index.html` + `build.mjs` → `dist/index.html`), `checks/round-0/` e `investigation.cany/`.
- Na 1ª tentativa ele criou `~/.config/craft-anything/config.toml` fora da pasta do teste; movemos
  para dentro e isolamos as tentativas seguintes.

## Comandos usados (para repetir)

```bash
mkdir -p ~/teste-craft/download && cd ~/teste-craft/download
gh release download v0.6.0 -R storytold/craft-anything \
  -p 'craft-anything-0.6.0-linux-aarch64.tar.gz' -p 'SHA256SUMS.txt' -p 'SHA256SUMS.txt.asc' -p 'release-signing-key.asc'
grep linux-aarch64.tar.gz SHA256SUMS.txt; sha256sum craft-anything-0.6.0-linux-aarch64.tar.gz
mkdir -p ../app && tar -xzf craft-anything-0.6.0-linux-aarch64.tar.gz -C ../app
CLI=../app/craft-anything-0.6.0-linux-aarch64/bin/craft-anything-cli
export XDG_CONFIG_HOME=~/teste-craft/config XDG_DATA_HOME=~/teste-craft/data
$CLI doctor
$CLI commands
$CLI rebuild http://127.0.0.1:8793/ "Faça a minha própria versão desta página de contador de água e chame de Gota Certa. Mantenha o mesmo layout e os mesmos botões (+1 copo, −, Zerar), mas use o meu nome e cor verde." \
  --clean-room --backend "Claude Code" --rounds 1 --projects-dir ~/teste-craft/projetos
```

Em computador x86_64 troque `aarch64` por `x86_64` no nome do arquivo.
