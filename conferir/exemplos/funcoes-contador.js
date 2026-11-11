#!/usr/bin/env node
// Exemplo de teste de FUNÇÃO automático (o que fizemos no teste real do kit):
// os botões da sua versão fazem o mesmo que os do original? Roda igual nos dois.
// Uso: node conferir/exemplos/funcoes-contador.js <url-ou-arquivo.html>
// Serve para a página de contador de água do teste. Para o seu app, copie e troque os passos.
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { execSync } = require('node:child_process');

function carregarPlaywright() {
  try { return require('playwright'); } catch (_) { /* tenta o global */ }
  try { const g = execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim(); return require(path.join(g, 'playwright')); }
  catch (_) { console.error('Playwright não encontrado: npm install -g playwright && npx playwright install chromium'); process.exit(2); }
}

(async () => {
  let url = process.argv[2];
  if (!url) { console.error('Uso: node conferir/exemplos/funcoes-contador.js <url-ou-arquivo.html>'); process.exit(2); }
  if (!/^(https?|file):\/\//.test(url)) { if (!fs.existsSync(url)) { console.error('Arquivo não encontrado: ' + url); process.exit(2); } url = 'file://' + path.resolve(url); }
  const { chromium } = carregarPlaywright();
  const nav = await chromium.launch();
  const p = await nav.newPage({ viewport: { width: 390, height: 900 } });
  await p.goto(url); await p.evaluate(() => { try { localStorage.clear(); } catch (_) {} }); await p.reload();
  const r = [];
  const bot = t => p.getByRole('button', { name: t }).first().click();
  // o número grande: no original é #numero; na versão do Craft Anything virou #copos
  const num = async () => (await p.locator('#numero, #copos').first().innerText()).trim();
  const ok = (nome, cond) => r.push((cond ? 'ok    ' : 'FALHA ') + nome);
  try {
    ok('começa em 0', (await num()) === '0');
    for (let i = 0; i < 3; i++) await bot(/1 copo|mais um copo/i);
    ok('+1 copo três vezes → 3', (await num()) === '3');
    ok('mostra 750 ml', (await p.locator('body').innerText()).includes('750'));
    await bot(/−|tirar|menos/i);
    ok('− → 2', (await num()) === '2');
    await bot(/Zerar/i);
    ok('Zerar → 0', (await num()) === '0');
    await bot(/−|tirar|menos/i);
    ok('− no zero não fica negativo', (await num()) === '0');
    for (let i = 0; i < 10; i++) await bot(/1 copo|mais um copo/i);
    await p.waitForTimeout(400); // a barra tem animação curta
    const larg = await p.evaluate(() => { const b = document.querySelector('#progresso, #barra'); return b ? b.getBoundingClientRect().width / b.parentElement.getBoundingClientRect().width : null; });
    ok('10 copos: barra cheia sem passar de 100%', larg !== null && larg > 0.98 && larg <= 1.001);
    ok('celular 390 px sem rolagem lateral', (await p.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0);
  } catch (e) { r.push('FALHA não achei um botão ou o número: ' + e.message.split('\n')[0]); }
  console.log(r.join('\n'));
  await nav.close();
  process.exit(r.some(x => x.startsWith('FALHA')) ? 1 : 0);
})();
