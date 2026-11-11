# craft-anything-vs-rea

[![Faça a sua versão — Craft Anything × REA](guia/assets/banner.jpg)](https://inematds.github.io/craft-anything-vs-rea/guia/)

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

## 🎬 Assista ao vídeo

**Craft Anything: aponte para um app e a IA faz a sua versão**: https://www.youtube.com/watch?v=Jx_lYjw6ioQ · versão vertical: https://www.youtube.com/watch?v=0atFUnqDXv8

## O que é

O **Craft Anything** é um programa aberto e gratuito que olha um site, app ou jogo, pede a um agente
de IA (como o Claude Code) para escrever a sua própria versão do zero e compara o resultado com o
original. Este repositório é um guia para instalar e usar com segurança, uma comparação com o
**REA** (outra ferramenta aberta, que mostra como um programa funciona por dentro) e um teste real
feito aqui. O kit traz uma régua de semelhança e uma lista de funções para conferir a cópia com
qualquer agente. Você precisa de um computador e de um agente de código logado; o kit pede
Node.js e Python 3.

## 📖 Guia de uso

Guia completo (landing + passo a passo): **https://inematds.github.io/craft-anything-vs-rea/guia/**

## O que tem aqui

| Arquivo | Para quê |
|---|---|
| [`conferir/semelhanca.js`](conferir/semelhanca.js) | Compara o original com a sua versão em 1440, 820 e 390 px: nota de **estrutura**, nota de **cor**, prints lado a lado e mapa de diferenças. Saída 0/1/2. |
| [`conferir/funcoes.py`](conferir/funcoes.py) | Gera a lista de funções para testar (modelos `quadro-branco` com 16 funções e `generico`) e reprova enquanto faltar prova. |
| [`conferir/exemplos/funcoes-contador.js`](conferir/exemplos/funcoes-contador.js) | Teste de função automático usado no teste real (modelo para copiar). |
| [`pedidos/`](pedidos/) | 5 pedidos prontos: sala limpa, meta de semelhança, mudança de marca, provas de função, teste do quadro branco (PT, EN e ES). |
| [`COMPARACAO.md`](COMPARACAO.md) | Craft Anything × REA × nossos kits, só com fatos de fonte primária (10/11/2026). |
| [`TESTE-AQUI.md`](TESTE-AQUI.md) | O teste real do Craft Anything 0.6.0 nesta máquina, com números e o que barrou. |
| [`tests/rodar.sh`](tests/rodar.sh) | Testes do kit (sem internet). |

## Uso rápido

```bash
git clone https://github.com/inematds/craft-anything-vs-rea && cd craft-anything-vs-rea
npm install -g playwright && npx playwright install chromium   # uma vez só

# 1) ficou parecido? (estrutura nas 3 larguras; saída 0 = passou)
node conferir/semelhanca.js https://original.exemplo minha-versao/index.html --meta 85 --saida conferencia

# 2) funciona? (o agente marca [x] e escreve a prova em cada linha)
python3 conferir/funcoes.py gerar quadro-branco --nome "Rabisco" --saida checklist.md
python3 conferir/funcoes.py conferir checklist.md

# testes do kit
bash tests/rodar.sh
```

## O processo, do início ao fim

Quem faz: 🧠 você (ou sessão com o Nei) · ⚙️ script · 🤖 agente de código (Claude Code pela assinatura).

1. 🧠 Escolher o original e conferir que pode estudá-lo (é seu, é aberto, ou só o que um visitante vê).
2. 🧠 Instalar o Craft Anything da página de versões e conferir o SHA256 (`sha256sum` × `SHA256SUMS.txt`).
3. 🧠 Instalar e logar o Claude Code (`claude auth status`); no app, Settings → AI → Harnesses → Detect.
4. 🧠 Settings → Safety → Auto mode **desligado**; Settings → General → pasta dos projetos.
5. 🤖 Make → Clean room → pedido (`pedidos/1-sala-limpa.md` ou `pedidos/5-teste-do-quadro-branco.md`) → Start: o Craft Anything estuda, o agente constrói e ele confere.
6. ⚙️ `node conferir/semelhanca.js <original> <sua versão> --meta 85` → tabela + `diferencas-*.png`.
7. ⚙️ `python3 conferir/funcoes.py gerar <modelo> --nome X --saida checklist.md`.
8. 🤖 O agente testa cada função e escreve a prova (`pedidos/4-provas-de-funcao.md`).
9. ⚙️ `python3 conferir/funcoes.py conferir checklist.md` → 0 só com todas provadas.
10. 🤖 Mudança de marca (`pedidos/3-mudanca-de-marca.md`) e de novo os passos 6 e 9.
11. ⚙️ Antes de mudar o kit: `bash tests/rodar.sh` → "TUDO OK".

## Craft Anything × REA em 4 linhas

- **Craft Anything** (`storytold/craft-anything`, Rust, MIT ou Apache-2.0, 0.6.0 "early alpha"): estuda, manda construir e **confere sozinho**; sala limpa de fábrica.
- **REA** (`morluto/rea`, TypeScript, MIT): dá ao **seu** agente ferramentas de engenharia reversa (Hopper, Ghidra, IDA, Kuna…); o agente estuda e pode escrever a sua versão.
- O REA nasceu antes (14/04/2026 × 31/10/2026): o Craft Anything não é "o pai do REA".
- Nenhum dos dois é caixa isolada: o agente age como você. Detalhes em [COMPARACAO.md](COMPARACAO.md).

## Kits relacionados

[rea-engenharia-reversa](https://inematds.github.io/rea-engenharia-reversa/guia/) ·
[rea-com-provas](https://inematds.github.io/rea-com-provas/guia/) ·
[rea-sem-travas](https://inematds.github.io/rea-sem-travas/guia/) (tudo local: dsh + Ollama + REA) ·
[caixa-do-agente](https://inematds.github.io/caixa-do-agente/guia/) ·
[site-inspirado](https://inematds.github.io/site-inspirado/guia/) ·
[site-que-vende](https://inematds.github.io/site-que-vende/guia/)

## Licença

MIT. Craft Anything e REA são projetos de terceiros, com as licenças deles.
Feito para a comunidade [INEMA.CLUB](https://inema.club).
