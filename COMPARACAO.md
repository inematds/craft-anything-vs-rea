# Craft Anything × REA × kits do INEMA

Fatos conferidos em **10/11/2026**, só com fonte primária: o README e os docs de cada repositório
e a API do GitHub. Craft Anything lido no commit `55aa8d3` (10/11/2026) e na versão 0.6.0 rodando
aqui; REA lido no README atual do `main` (10/11/2026).

## Em uma frase

- **Craft Anything** estuda o original, manda um agente de código construir a sua versão e
  **confere sozinho** se ficou parecida, num app de janela (e numa linha de comando).
- **REA** liga o **seu** agente a ferramentas de engenharia reversa; o agente estuda, explica com
  prova e, se você pedir, escreve e testa a sua versão. A conferência fica com você e o agente.

## Tabela

| | Craft Anything | REA (Reverse Engineer Anything) |
|---|---|---|
| Repositório | `storytold/craft-anything` | `morluto/rea` |
| Criado no GitHub | 31/10/2026 | 14/04/2026 |
| Estrelas (10/11/2026) | ~26,2 mil | ~450 mil |
| Linguagem | Rust | TypeScript (Node.js) |
| Licença | MIT **ou** Apache-2.0, à sua escolha | MIT |
| Versão | 0.6.0 (09/11/2026), "early alpha" | `rea-agents` 6.8.0 (25/10/2026) |
| Como se usa | App de janela (modo simples e avançado), CLI `craft-anything-cli` e servidor MCP | Servidor MCP + CLI `rea` para o seu agente; instala com `npx rea-agents setup` |
| Quem estuda | O próprio Craft Anything (320 ferramentas no README; a CLI 0.6.0 lista 322 comandos) | O seu agente, chamando as ferramentas do REA |
| Quem constrói | Um agente de código que ele chama: Claude Code primeiro; Copilot CLI e Grok por ACP; adaptador do Codex "ainda não verificado" | O seu próprio agente (Claude Code, Codex, Cursor, Gemini CLI, Grok Build e outros) |
| Como confere | Sozinho: compara prints em 3 larguras (padrão 1440, 768 e 390 px) e refina até "Good enough" (padrão 90%) | Não tem etapa de conferência visual pronta; o agente testa o que escreveu |
| Sala limpa | **Padrão.** Só usa o que um visitante vê; ferramentas que olham por dentro são recusadas | Não tem um modo com esse nome; o README pede uso só em software seu ou que você pode examinar |
| Olhar por dentro | Modo **Deep**: lê código e arquivos com motores próprios e Ghidra, se instalado | É o forte dele: Hopper, Ghidra, IDA ou Kuna; JS/Electron, .NET, Android, Go, Rust, firmware, sites e muito mais |
| Alvos | Sites, apps de computador, apps de celular, jogos e arquivos | Binários nativos, JS/Electron, .NET, Android, sites, capturas de rede, firmware, bancos SQLite, entre outros |
| Sistemas | Windows, macOS, Linux (inclusive ARM64), FreeBSD; visualizador web em WebAssembly | Onde roda Node.js 22/24/26; cada alvo tem seus requisitos |
| É uma caixa isolada? | **Não.** O README avisa: sala limpa é regra do que ele oferece, não um sandbox; o agente age como você | Não. As análises rodam "com as permissões do seu usuário" |
| Limites que eles mesmos declaram | Não contorna DRM, login nem anti-cheat; manda o agente não copiar logo, fotos e textos | Uso ilegal ou não autorizado não é aceito; ferramentas comerciais só com licença legal |

## "O Craft Anything é o pai do REA?"

**Não, pelas fontes.** O REA nasceu seis meses e meio antes (abril × outubro de 2026), é de outro
dono, em outra linguagem, e nenhum dos dois READMEs cita o outro. Também não é verdade que o REA
"só mostra como funciona": o README dele diz que o agente pode "construir uma versão para o seu
projeto". A diferença real é de **pacote**: o Craft Anything junta estudar + construir + conferir
num app só, com a sala limpa ligada de fábrica; o REA é a caixa de ferramentas de estudo mais
funda, e a construção fica com o agente que você já usa.

## Quando usar cada um

- **Quer refazer um site, app simples ou jogo do seu jeito, sem programar e sem ler código de
  ninguém:** Craft Anything em sala limpa, com o modo automático desligado (ele pergunta antes de
  rodar comandos). Confira depois com `conferir/funcoes.py`: a nota visual não prova que funciona.
- **Quer entender COMO uma função de um programa funciona por dentro** (um algoritmo, um formato
  de arquivo, um app instalado que é seu): REA. Guia testado:
  [rea-engenharia-reversa](https://inematds.github.io/rea-engenharia-reversa/guia/).
- **Quer que o agente prove o que diz que entendeu:** [rea-com-provas](https://inematds.github.io/rea-com-provas/guia/)
  (conferidor em Python) e, para funções da cópia, o `conferir/funcoes.py` deste kit.
- **Quer tudo local, sem nuvem e sem recusa do modelo:** [rea-sem-travas](https://inematds.github.io/rea-sem-travas/guia/)
  (harness dsh + modelo aberto no Ollama + REA). O Craft Anything usa servidores locais só para
  perguntas e análise; para construir, ele precisa de um agente de código instalado.
- **Quer que o agente trabalhe numa caixa de verdade:** [caixa-do-agente](https://inematds.github.io/caixa-do-agente/guia/)
  (Docker descartável, sem rede e sem os seus `.env`). Vale para os dois, já que nenhum é sandbox.
- **Qualquer agente, qualquer ferramenta:** a etapa "Conferir" deste kit (`conferir/semelhanca.js`)
  não depende do Craft Anything nem do REA.

## Outros fatos do Craft Anything usados no guia (README e docs/claude-code.md, 10/11/2026)

- O Claude Code roda como processo filho, `claude -p … --output-format stream-json`, com o seu login;
  o Craft Anything "nunca vê" a sua conta.
- Com o modo automático desligado, cada tipo de ação nova mostra um cartão
  "Allow once / Always for this project / Don't allow"; com ele ligado (padrão), "commands: allow"
  confia no construtor. No nosso teste (ligado) ele rodou `npm install` sem perguntar.
- O Flatpak "não consegue abrir um navegador", e estudar sites precisa disso.
- O AppImage traz a CLI também: `<AppImage> --cli <comando>` (não testado aqui; usamos o `.tar.gz`).
- "Good enough" (Settings) = quão parecido tem que ficar antes de parar de refinar; padrão 90%, de 50 a 100%.
- Pasta de projetos padrão: `Documents/Craft Anything`, com `craft.json`, `capture/`, `app/`, `checks/`,
  `investigation.cany/` e `inbox/`.

## Fontes

- Craft Anything: README.md, docs/claude-code.md e saída da CLI 0.6.0 (`doctor`, `commands`,
  `settings-show`), em https://github.com/storytold/craft-anything (10/11/2026).
- REA: README.md do `main` em https://github.com/morluto/rea (10/11/2026).
- Datas de criação, estrelas e versões: API do GitHub (`gh api repos/<dono>/<repo>` e `/releases/latest`), 10/11/2026.
