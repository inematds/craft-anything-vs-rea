#!/usr/bin/env bash
# Testes do kit: semelhanca.js (etapa Conferir) e funcoes.py (lista de funções).
# Usa só arquivos locais (file://), sem porta e sem internet. Uso: bash tests/rodar.sh
set -u
cd "$(dirname "$0")/.."
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
P=tests/paginas; S="node conferir/semelhanca.js"; F="python3 -I conferir/funcoes.py"
falhas=0; ok(){ echo "  ok    $1"; }; ruim(){ echo "  ERRO  $1"; falhas=$((falhas+1)); }
rc_e(){ [ "$1" -eq "$2" ] && ok "$3 (saída $1)" || ruim "$3: saída $1, esperado $2"; }
campo(){ node -e 'const r=require(process.argv[1]);console.log(Math[process.argv[3]](...r.larguras.map(x=>x[process.argv[2]])))' "$1" "$2" "$3"; }

echo "1) semelhanca.js"
timeout 180 $S $P/original.html $P/original.html --saida "$T/igual" --json > /dev/null 2>&1; rc_e $? 0 "página idêntica passa"
[ "$(campo "$T/igual/relatorio.json" estrutura min)" = "100" ] && ok "idêntica: estrutura 100 nas 3 larguras" || ruim "idêntica não deu 100"
for f in lado-a-lado-1440.png diferencas-390.png relatorio.md relatorio.json; do [ -s "$T/igual/$f" ] && ok "gera $f" || ruim "não gerou $f"; done

timeout 180 $S $P/original.html $P/verde.html --saida "$T/verde" --json > /dev/null 2>&1; rc_e $? 0 "mesma página com outro nome e cor verde passa (a cor só informa)"
[ "$(campo "$T/verde/relatorio.json" estrutura min | cut -d. -f1)" -ge 90 ] && ok "verde: estrutura ≥ 90" || ruim "verde: estrutura < 90"
[ "$(campo "$T/verde/relatorio.json" cor max | cut -d. -f1)" -lt 95 ] && ok "verde: a nota de cor cai (< 95)" || ruim "verde: a nota de cor não percebeu a troca de cor"
timeout 180 $S $P/original.html $P/verde.html --saida "$T/verde2" --meta-cor 95 > /dev/null 2>&1; rc_e $? 1 "verde com --meta-cor 95 reprova"

timeout 180 $S $P/original.html $P/escura-diferente.html --saida "$T/dif" --json > /dev/null 2>&1; rc_e $? 1 "outra página escura reprova"
[ "$(campo "$T/dif/relatorio.json" pixelsIguais min | cut -d. -f1)" -ge 90 ] && ok "armadilha: mais de 90% dos pixels iguais (fundo escuro)…" || ruim "armadilha mudou: pixels iguais < 90"
[ "$(campo "$T/dif/relatorio.json" estrutura max | cut -d. -f1)" -lt 50 ] && ok "…mas a estrutura fica < 50" || ruim "estrutura de páginas diferentes ≥ 50"

timeout 60 $S $P/original.html $P/nao-existe.html > /dev/null 2>&1; rc_e $? 2 "arquivo que não existe = erro"
timeout 60 $S $P/original.html > /dev/null 2>&1; rc_e $? 2 "faltando a sua versão = erro"
timeout 60 $S $P/original.html $P/verde.html --larguras 10 > /dev/null 2>&1; rc_e $? 2 "largura inválida = erro"
timeout 60 $S $P/original.html $P/verde.html --opcao-que-nao-existe > /dev/null 2>&1; rc_e $? 2 "opção desconhecida = erro"
timeout 60 $S $P/original.html $P/verde.html --saida "$T/l" --larguras 600 --pagina-inteira > /dev/null 2>&1; rc_e $? 0 "uma largura só + página inteira"
# servidor que responde 404 numa porta livre escolhida pelo sistema (porta 0), só em 127.0.0.1
node -e 'const s=require("http").createServer((q,r)=>{r.writeHead(404);r.end("nao achei")});s.listen(0,"127.0.0.1",()=>{require("fs").writeFileSync(process.argv[1],String(s.address().port))});setTimeout(()=>s.close(),60000)' "$T/porta" & SRV=$!
for _ in 1 2 3 4 5 6 7 8 9 10; do [ -s "$T/porta" ] && break; sleep 0.3; done
timeout 60 $S $P/original.html "http://127.0.0.1:$(cat "$T/porta")/" --larguras 390 > /dev/null 2>&1; rc_e $? 2 "página que responde 404 = erro, sem nota"
kill $SRV 2>/dev/null; wait $SRV 2>/dev/null

echo "2) funcoes.py"
$F modelos | grep -q quadro-branco && ok "lista o modelo quadro-branco" || ruim "modelo quadro-branco sumiu"
$F gerar quadro-branco --nome "Rabisco" --saida "$T/lista.md" > /dev/null; rc_e $? 0 "gera a lista do quadro branco"
[ "$(grep -c '^- \[ \] F' "$T/lista.md")" -eq 16 ] && ok "16 funções no quadro branco" || ruim "quadro branco sem 16 funções"
$F conferir "$T/lista.md" > /dev/null; rc_e $? 1 "lista sem nada testado reprova"
sed 's/^- \[ \]/- [x]/; s/| prova:$/| prova: print em provas\/f.png mostra a forma/' "$T/lista.md" > "$T/cheia.md"
$F conferir "$T/cheia.md" > /dev/null; rc_e $? 0 "tudo [x] com prova passa"
sed '0,/| prova: print em provas\/f.png mostra a forma/s//| prova: ok/' "$T/cheia.md" > "$T/curta.md"
$F conferir "$T/curta.md" | grep -q "sem prova" && ok "prova curta demais é recusada" || ruim "aceitou prova de 2 letras"
sed 's/| prova:/| proof:/' "$T/cheia.md" > "$T/en.md"; $F conferir "$T/en.md" > /dev/null; rc_e $? 0 "aceita 'proof:' (pedido em inglês)"
sed 's/| prova:/| prueba:/' "$T/cheia.md" > "$T/es.md"; $F conferir "$T/es.md" > /dev/null; rc_e $? 0 "aceita 'prueba:' (pedido em espanhol)"
$F conferir "$T/nao-existe.md" > /dev/null 2>&1; rc_e $? 2 "arquivo que não existe = erro"
$F gerar modelo-que-nao-existe > /dev/null 2>&1; rc_e $? 2 "modelo que não existe = erro"
echo "nada aqui" > "$T/vazio.md"; $F conferir "$T/vazio.md" > /dev/null 2>&1; rc_e $? 2 "arquivo sem linhas F01 = erro"

echo "3) pedidos prontos nos 3 idiomas usam o formato que o funcoes.py lê"
for f in pedidos/*.md pedidos/en/*.md pedidos/es/*.md; do [ -e "$f" ] || continue; grep -q "prova:\|proof:\|prueba:" "$f" || continue; grep -q -- "- \[x\] F01" "$f" && ok "$f mostra o formato '- [x] F01 … | prova:'" || ruim "$f fala de prova sem o formato do funcoes.py"; done

echo
[ $falhas -eq 0 ] && echo "TUDO OK" || echo "$falhas falha(s)"
exit $([ $falhas -eq 0 ] && echo 0 || echo 1)
