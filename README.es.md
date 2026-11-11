# craft-anything-vs-rea

[![Haz tu versión — Craft Anything × REA](guia/assets/banner-es.jpg)](https://inematds.github.io/craft-anything-vs-rea/guia/es/)

**🇧🇷 [Português](README.md) · 🇺🇸 [English](README.en.md) · 🇪🇸 [Español](README.es.md)**

## 🎬 Mira el video

**Craft Anything: apunta a una app y la IA hace tu versión** (en portugués): https://www.youtube.com/watch?v=Jx_lYjw6ioQ · versión vertical: https://www.youtube.com/watch?v=0atFUnqDXv8

## Qué es

**Craft Anything** es un programa abierto y gratuito que observa un sitio web, una app o un juego, le pide a un agente de IA (como Claude Code) que escriba su propia versión desde cero y compara el resultado con el original. Este repositorio es una guía para instalarlo y usarlo de forma segura, una comparación con **REA** (otra herramienta abierta que muestra cómo funciona un programa por dentro) y una prueba real hecha aquí. El kit incluye una regla para medir la similitud y una lista de funciones para revisar la copia con cualquier agente. Necesitas una computadora y una sesión iniciada en un agente de código; el kit requiere Node.js y Python 3.

## 📖 Guía de uso

Guía completa (página de inicio + paso a paso): **https://inematds.github.io/craft-anything-vs-rea/guia/es/**

## Qué hay aquí

| Archivo | Para qué sirve |
|---|---|
| [`conferir/semelhanca.js`](conferir/semelhanca.js) | Compara el original con tu versión en 1440, 820 y 390 px: puntuación de **estructura**, puntuación de **color**, capturas lado a lado y mapa de diferencias. Resultado 0/1/2. |
| [`conferir/funcoes.py`](conferir/funcoes.py) | Genera la lista de funciones para probar (modelos `quadro-branco` con 16 funciones y `generico`) y no aprueba mientras falten pruebas. |
| [`conferir/exemplos/funcoes-contador.js`](conferir/exemplos/funcoes-contador.js) | Prueba automática de funciones usada en la prueba real (modelo para copiar). |
| [`pedidos/`](pedidos/es/) | 5 pedidos listos: sala limpia, meta de similitud, cambio de marca, pruebas de funciones y prueba del tablero blanco (PT, EN y ES). |
| [`COMPARACAO.md`](COMPARACAO.md) (en portugués) | Craft Anything × REA × nuestros kits, solo con datos de fuentes primarias (10/11/2026). |
| [`TESTE-AQUI.md`](TESTE-AQUI.md) (en portugués) | La prueba real de Craft Anything 0.6.0 en esta computadora, con cifras y lo que lo bloqueó. |
| [`tests/rodar.sh`](tests/rodar.sh) | Pruebas del kit (sin internet). |

## Uso rápido

```bash
git clone https://github.com/inematds/craft-anything-vs-rea && cd craft-anything-vs-rea
npm install -g playwright && npx playwright install chromium   # solo una vez

# 1) ¿Se parece? (estructura en los 3 anchos; resultado 0 = aprobado)
node conferir/semelhanca.js https://original.exemplo minha-versao/index.html --meta 85 --saida conferencia

# 2) ¿Funciona? (el agente marca [x] y escribe la prueba en cada línea)
python3 conferir/funcoes.py gerar quadro-branco --nome "Rabisco" --saida checklist.md
python3 conferir/funcoes.py conferir checklist.md

# pruebas del kit
bash tests/rodar.sh
```

## El proceso, de principio a fin

Quién lo hace: 🧠 tú (o una sesión con Nei) · ⚙️ script · 🤖 agente de código (Claude Code con la suscripción).

1. 🧠 Elegir el original y confirmar que puedes estudiarlo (es tuyo, es abierto o solo observarás lo que ve un visitante).
2. 🧠 Instalar Craft Anything desde la página de versiones y comprobar el SHA256 (`sha256sum` × `SHA256SUMS.txt`).
3. 🧠 Instalar Claude Code e iniciar sesión (`claude auth status`); en la app, Settings → AI → Harnesses → Detect.
4. 🧠 Settings → Safety → Auto mode **desactivado**; Settings → General → carpeta de proyectos.
5. 🤖 Make → Clean room → pedido (`pedidos/1-sala-limpa.md` o `pedidos/5-teste-do-quadro-branco.md`) → Start: Craft Anything estudia, el agente construye y luego se revisa el resultado.
6. ⚙️ `node conferir/semelhanca.js <original> <sua versão> --meta 85` → tabla + `diferencas-*.png`.
7. ⚙️ `python3 conferir/funcoes.py gerar <modelo> --nome X --saida checklist.md`.
8. 🤖 El agente prueba cada función y escribe la prueba (`pedidos/4-provas-de-funcao.md`).
9. ⚙️ `python3 conferir/funcoes.py conferir checklist.md` → solo da 0 si todas tienen pruebas.
10. 🤖 Cambio de marca (`pedidos/3-mudanca-de-marca.md`) y repetir los pasos 6 y 9.
11. ⚙️ Antes de cambiar el kit: `bash tests/rodar.sh` → «TODO OK».

## Craft Anything × REA en 4 líneas

- **Craft Anything** (`storytold/craft-anything`, Rust, MIT o Apache-2.0, 0.6.0 "early alpha"): estudia, pide que lo construyan y **lo revisa por sí solo**; incluye sala limpia de fábrica.
- **REA** (`morluto/rea`, TypeScript, MIT): ofrece a **tu** agente herramientas de ingeniería inversa (Hopper, Ghidra, IDA, Kuna…); el agente estudia y puede escribir su versión.
- REA nació antes (14/04/2026 × 31/10/2026): Craft Anything no es «el padre de REA».
- Ninguno de los dos funciona de forma aislada: el agente actúa como tú. Más detalles en [COMPARACAO.md](COMPARACAO.md) (en portugués).

## Kits relacionados

[rea-engenharia-reversa](https://inematds.github.io/rea-engenharia-reversa/guia/) ·
[rea-com-provas](https://inematds.github.io/rea-com-provas/guia/) ·
[rea-sem-travas](https://inematds.github.io/rea-sem-travas/guia/) (todo local: dsh + Ollama + REA) ·
[caixa-do-agente](https://inematds.github.io/caixa-do-agente/guia/) ·
[site-inspirado](https://inematds.github.io/site-inspirado/guia/) ·
[site-que-vende](https://inematds.github.io/site-que-vende/guia/)

## Licencia

MIT. Craft Anything y REA son proyectos de terceros, cada uno con su propia licencia.
Hecho para la comunidad [INEMA.CLUB](https://inema.club).