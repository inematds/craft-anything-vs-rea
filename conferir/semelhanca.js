#!/usr/bin/env node
// semelhanca.js — a etapa "Conferir": compara o ORIGINAL com a SUA VERSÃO em 3 larguras de tela.
// Tira print das duas páginas, mede a semelhança de ESTRUTURA (luz e sombra, onde está cada coisa)
// separada da semelhança de COR, e salva lado a lado + mapa de diferenças.
// Funciona com qualquer agente (com ou sem Craft Anything). Só precisa de Node 18+ e Playwright.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

const AJUDA = `semelhanca.js — quão parecida a sua versão está do original (etapa "Conferir").

Uso:  node conferir/semelhanca.js <original> <sua-versao> [opções]
      <original> e <sua-versao>: endereço http(s)://… ou caminho de um arquivo .html

Opções:
  --larguras 1440,820,390   larguras de tela (padrão: notebook, tablet, celular)
  --altura 900              altura da janela (padrão 900)
  --pagina-inteira          compara a página toda, não só a primeira tela
  --meta 85                 nota mínima de ESTRUTURA em cada largura (padrão 85)
  --meta-cor N              também exige nota de COR ≥ N (padrão: cor só informa)
  --saida pasta             onde salvar prints e relatório (padrão: ./conferencia)
  --esperar 300             ms de espera depois de carregar (padrão 300)
  --json                    imprime o relatório em JSON

Saída: 0 = todas as larguras bateram a meta · 1 = alguma ficou abaixo · 2 = erro
       (página não abriu, 404, arquivo faltando, Playwright ausente, opção errada).`;

function sair(msg, codigo) { console.error(msg); process.exit(codigo); }

function carregarPlaywright() {
  const lugares = [process.env.PLAYWRIGHT_DIR, __dirname, path.join(__dirname, '..'), process.cwd()].filter(Boolean);
  for (const l of lugares) { const p = path.join(l, 'node_modules', 'playwright'); if (fs.existsSync(p)) return require(p); }
  try { return require('playwright'); } catch (_) { /* tenta o global */ }
  try { const g = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); const p = path.join(g, 'playwright'); if (fs.existsSync(p)) return require(p); } catch (_) { /* segue */ }
  sair('Playwright não encontrado. Rode uma vez (baixa o Chromium, uns 150 MB):\n  npm install -g playwright && npx playwright install chromium', 2);
}

function lerArgs(argv) {
  const o = { larguras: [1440, 820, 390], altura: 900, inteira: false, meta: 85, metaCor: null, saida: 'conferencia', esperar: 300, json: false, alvos: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const val = () => { if (i + 1 >= argv.length) sair(`Falta o valor de ${a}.\n\n${AJUDA}`, 2); return argv[++i]; };
    if (a === '-h' || a === '--help') { console.log(AJUDA); process.exit(0); }
    else if (a === '--larguras') { o.larguras = val().split(',').map(Number); if (o.larguras.some(n => !Number.isInteger(n) || n < 200 || n > 4000)) sair('--larguras: use números entre 200 e 4000, separados por vírgula.', 2); }
    else if (a === '--altura') { o.altura = Number(val()); if (!(o.altura >= 200 && o.altura <= 6000)) sair('--altura: entre 200 e 6000.', 2); }
    else if (a === '--pagina-inteira') o.inteira = true;
    else if (a === '--meta') { o.meta = Number(val()); if (!(o.meta >= 0 && o.meta <= 100)) sair('--meta: entre 0 e 100.', 2); }
    else if (a === '--meta-cor') { o.metaCor = Number(val()); if (!(o.metaCor >= 0 && o.metaCor <= 100)) sair('--meta-cor: entre 0 e 100.', 2); }
    else if (a === '--saida') o.saida = val();
    else if (a === '--esperar') { o.esperar = Number(val()); if (!(o.esperar >= 0 && o.esperar <= 60000)) sair('--esperar: entre 0 e 60000.', 2); }
    else if (a === '--json') o.json = true;
    else if (a.startsWith('--')) sair(`Opção desconhecida: ${a}\n\n${AJUDA}`, 2);
    else o.alvos.push(a);
  }
  if (o.alvos.length !== 2) sair(`Passe o original e a sua versão.\n\n${AJUDA}`, 2);
  return o;
}

function paraUrl(alvo) {
  if (/^https?:\/\//i.test(alvo) || /^file:\/\//i.test(alvo)) return alvo;
  const p = path.resolve(alvo);
  if (!fs.existsSync(p)) sair(`Arquivo não encontrado: ${alvo}`, 2);
  return 'file://' + p;
}

const CONGELAR = `*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important;scroll-behavior:auto!important}`;

async function fotografar(contexto, url, largura, o) {
  const pag = await contexto.newPage();
  await pag.setViewportSize({ width: largura, height: o.altura });
  let resp;
  try { resp = await pag.goto(url, { waitUntil: 'load', timeout: 30000 }); }
  catch (e) { await pag.close(); throw new Error(`não abriu ${url}: ${e.message.split('\n')[0]}`); }
  if (resp && resp.status() >= 400) { await pag.close(); throw new Error(`${url} respondeu ${resp.status()}`); }
  await pag.addStyleTag({ content: CONGELAR }).catch(() => {});
  await pag.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
  if (o.esperar) await pag.waitForTimeout(o.esperar);
  const titulo = await pag.title();
  const png = await pag.screenshot({ fullPage: o.inteira, type: 'png' });
  await pag.close();
  return { titulo, png };
}

// Toda a conta roda dentro do próprio Chromium (canvas), assim não precisa de outra biblioteca.
async function comparar(contexto, pngA, pngB) {
  const pag = await contexto.newPage();
  const r = await pag.evaluate(async ([a64, b64]) => {
    const carregar = src => new Promise((ok, erro) => { const im = new Image(); im.onload = () => ok(im); im.onerror = erro; im.src = src; });
    const [A, B] = await Promise.all([carregar('data:image/png;base64,' + a64), carregar('data:image/png;base64,' + b64)]);
    // mesma largura (a da janela); alturas diferentes: completa com cinza, sem esticar
    const W = Math.max(A.width, B.width), H = Math.max(A.height, B.height);
    const tela = img => { const c = document.createElement('canvas'); c.width = W; c.height = H; const x = c.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, W, H); x.drawImage(img, 0, 0); return x.getImageData(0, 0, W, H).data; };
    const da = tela(A), db = tela(B);

    // 1) pixels iguais (tolerância 24 por canal) + mapa de diferenças
    const mapa = document.createElement('canvas'); mapa.width = W; mapa.height = H;
    const mx = mapa.getContext('2d'); const md = mx.createImageData(W, H);
    let iguais = 0;
    for (let i = 0; i < da.length; i += 4) {
      const d = Math.max(Math.abs(da[i] - db[i]), Math.abs(da[i + 1] - db[i + 1]), Math.abs(da[i + 2] - db[i + 2]));
      const cinza = (da[i] * 0.299 + da[i + 1] * 0.587 + da[i + 2] * 0.114) * 0.35;
      if (d <= 24) { iguais++; md.data[i] = md.data[i + 1] = md.data[i + 2] = cinza; }
      else { md.data[i] = 255; md.data[i + 1] = Math.max(0, 120 - d / 2); md.data[i + 2] = 40; }
      md.data[i + 3] = 255;
    }
    mx.putImageData(md, 0, 0);

    // 2) estrutura: SSIM em tons de cinza, por blocos de 8x8, numa cópia reduzida (até 480 px de largura).
    //    Conta só blocos onde ALGUMA das duas tem conteúdo (variação de luz): fundo liso igual nos dois
    //    não infla a nota. Duas páginas escuras com conteúdo diferente ficam com nota baixa.
    const esc = Math.min(1, 480 / W); const w = Math.max(8, Math.round(W * esc)), h = Math.max(8, Math.round(H * esc));
    const reduz = img => { const c = document.createElement('canvas'); c.width = w; c.height = h; const x = c.getContext('2d'); x.fillStyle = '#808080'; x.fillRect(0, 0, w, h); x.drawImage(img, 0, 0, img.width * esc, img.height * esc); return x.getImageData(0, 0, w, h).data; };
    const ra = reduz(A), rb = reduz(B);
    const lum = d => { const L = new Float32Array(w * h); for (let i = 0, j = 0; i < d.length; i += 4, j++) L[j] = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114; return L; };
    const La = lum(ra), Lb = lum(rb);
    const C1 = (0.01 * 255) ** 2, C2 = (0.03 * 255) ** 2, LIMIAR = 25; // variância mínima para "tem conteúdo"
    let soma = 0, n = 0, somaTudo = 0, nTudo = 0;
    for (let by = 0; by + 8 <= h; by += 8) for (let bx = 0; bx + 8 <= w; bx += 8) {
      let ma = 0, mb = 0;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const k = (by + y) * w + bx + x; ma += La[k]; mb += Lb[k]; }
      ma /= 64; mb /= 64;
      let va = 0, vb = 0, cov = 0;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) { const k = (by + y) * w + bx + x; const ea = La[k] - ma, eb = Lb[k] - mb; va += ea * ea; vb += eb * eb; cov += ea * eb; }
      va /= 63; vb /= 63; cov /= 63;
      const s = ((2 * ma * mb + C1) * (2 * cov + C2)) / ((ma * ma + mb * mb + C1) * (va + vb + C2));
      somaTudo += s; nTudo++;
      if (Math.max(va, vb) > LIMIAR) { soma += s; n++; }
    }
    const estrutura = n ? soma / n : (nTudo ? somaTudo / nTudo : 1);

    // 3) cor: histograma de cores (8x8x8 faixas) SEM a cor de fundo (a faixa mais comum de cada página),
    //    para o fundo igual não esconder que os botões e destaques mudaram de cor. Mede o fundo à parte.
    const hist = d => { const hs = new Float64Array(512); for (let i = 0; i < d.length; i += 4) hs[(d[i] >> 5) * 64 + (d[i + 1] >> 5) * 8 + (d[i + 2] >> 5)]++; return hs; };
    const ha = hist(ra), hb = hist(rb);
    const topo = hs => hs.indexOf(Math.max(...hs));
    const fa = topo(ha), fb = topo(hb);
    const resto = (hs, f) => { const r = Float64Array.from(hs); r[f] = 0; const t = r.reduce((s, v) => s + v, 0); return { r, t }; };
    const A2 = resto(ha, fa), B2 = resto(hb, fb), total = w * h;
    let inter = 0;
    if (A2.t < total * 0.01 || B2.t < total * 0.01) { for (let k = 0; k < 512; k++) inter += Math.min(ha[k], hb[k]) / total; }
    else { for (let k = 0; k < 512; k++) inter += Math.min(A2.r[k] / A2.t, B2.r[k] / B2.t); if (fa !== fb) inter *= 0.5; }

    // lado a lado: original | sua versão
    const lado = document.createElement('canvas'); lado.width = W * 2 + 16; lado.height = H;
    const lx = lado.getContext('2d'); lx.fillStyle = '#FACC15'; lx.fillRect(0, 0, lado.width, H); lx.drawImage(A, 0, 0); lx.drawImage(B, W + 16, 0);

    return {
      largura: W, altura: H, alturaOriginal: A.height, alturaSua: B.height,
      estrutura: Math.max(0, Math.min(100, estrutura * 100)), cor: inter * 100, pixelsIguais: iguais / (W * H) * 100,
      blocosComConteudo: n, blocos: nTudo,
      mapa: mapa.toDataURL('image/png').split(',')[1], lado: lado.toDataURL('image/png').split(',')[1],
    };
  }, [pngA.toString('base64'), pngB.toString('base64')]);
  await pag.close();
  return r;
}

const um = x => Math.round(x * 10) / 10;

async function principal() {
  const o = lerArgs(process.argv.slice(2));
  const [urlA, urlB] = o.alvos.map(paraUrl);
  const { chromium } = carregarPlaywright();
  let nav;
  try { nav = await chromium.launch(); }
  catch (e) { sair(`Não consegui abrir o Chromium: ${e.message.split('\n')[0]}\n  Rode: npx playwright install chromium`, 2); }
  const contexto = await nav.newContext({ deviceScaleFactor: 1, reducedMotion: 'reduce', colorScheme: 'dark' });
  fs.mkdirSync(o.saida, { recursive: true });
  const rel = { original: urlA, sua: urlB, meta: o.meta, metaCor: o.metaCor, paginaInteira: o.inteira, larguras: [] };
  try {
    for (const L of o.larguras) {
      const a = await fotografar(contexto, urlA, L, o);
      const b = await fotografar(contexto, urlB, L, o);
      rel.tituloOriginal = a.titulo; rel.tituloSua = b.titulo;
      const c = await comparar(contexto, a.png, b.png);
      fs.writeFileSync(path.join(o.saida, `original-${L}.png`), a.png);
      fs.writeFileSync(path.join(o.saida, `sua-${L}.png`), b.png);
      fs.writeFileSync(path.join(o.saida, `lado-a-lado-${L}.png`), Buffer.from(c.lado, 'base64'));
      fs.writeFileSync(path.join(o.saida, `diferencas-${L}.png`), Buffer.from(c.mapa, 'base64'));
      const passa = c.estrutura >= o.meta && (o.metaCor == null || c.cor >= o.metaCor);
      rel.larguras.push({ largura: L, estrutura: um(c.estrutura), cor: um(c.cor), pixelsIguais: um(c.pixelsIguais),
        alturaOriginal: c.alturaOriginal, alturaSua: c.alturaSua, blocosComConteudo: c.blocosComConteudo, passa });
    }
  } catch (e) { await nav.close(); sair(`Erro: ${e.message}`, 2); }
  await nav.close();
  rel.passa = rel.larguras.every(x => x.passa);
  const nome = { 1440: 'notebook', 820: 'tablet', 768: 'tablet', 390: 'celular' };
  const linhas = rel.larguras.map(x => `| ${x.largura} px ${nome[x.largura] ? '(' + nome[x.largura] + ')' : ''} | ${x.estrutura} | ${x.cor} | ${x.pixelsIguais}% | ${x.alturaOriginal} / ${x.alturaSua} | ${x.passa ? 'passa' : 'ABAIXO'} |`);
  const md = [`# Conferência de semelhança`, '', `- Original: ${urlA} — título: "${rel.tituloOriginal}"`, `- Sua versão: ${urlB} — título: "${rel.tituloSua}"`,
    `- Meta de estrutura: ${o.meta}${o.metaCor != null ? ` · meta de cor: ${o.metaCor}` : ' · cor só informa'}${o.inteira ? ' · página inteira' : ' · primeira tela'}`, '',
    '| Largura | Estrutura | Cor | Pixels iguais | Altura (orig / sua) | Resultado |', '|---|---|---|---|---|---|', ...linhas, '',
    `**${rel.passa ? 'Passa' : 'Ainda não passa'}.** Veja \`lado-a-lado-*.png\` e \`diferencas-*.png\` (vermelho = diferente).`,
    '', 'Estrutura = onde está cada coisa (luz e sombra, ignora a cor). Cor = se as paletas batem. Pixels iguais = só referência.',
    'Nota alta NÃO prova que funciona: confira as funções com `conferir/funcoes.py`.'].join('\n');
  fs.writeFileSync(path.join(o.saida, 'relatorio.md'), md + '\n');
  fs.writeFileSync(path.join(o.saida, 'relatorio.json'), JSON.stringify(rel, null, 2) + '\n');
  if (o.json) console.log(JSON.stringify(rel, null, 2)); else console.log(md + `\n\nArquivos em: ${path.resolve(o.saida)}`);
  process.exit(rel.passa ? 0 : 1);
}

principal().catch(e => sair(`Erro: ${e.message}`, 2));
