# Pedido 4 — Provar cada função (estilo rea-com-provas)

"Parecido não é funcionar." O agente diz que tudo funciona; este pedido obriga a mostrar a prova
de cada função, numa lista que o `conferir/funcoes.py` confere sozinho.

Antes, gere a lista:

```bash
python3 conferir/funcoes.py gerar quadro-branco --nome "<NOME>" --saida checklist.md
# outro tipo de app: python3 conferir/funcoes.py gerar generico --nome "<NOME>" --saida checklist.md
```

Depois cole no agente:

```text
Abra checklist.md. Para cada linha, teste a função de verdade na minha versão (abra no navegador,
clique, arraste, digite; use Playwright se precisar) e só então:
- troque [ ] por [x];
- escreva depois de "prova:" o que você viu: o arquivo do print (salve em provas/), ou o comando e a saída.

Exemplo de linha pronta:
- [x] F01 Retângulo — Escolha o retângulo, arraste na tela… | prova: provas/f01-retangulo.png mostra o retângulo 200x120

Regras:
- Não marque [x] sem ter testado. Se uma função não funciona, deixe [ ] e escreva por quê depois de "prova:".
- Não apague linhas nem mude os números F01, F02…
- No fim rode: python3 conferir/funcoes.py conferir checklist.md e me mostre a saída.
```

O conferidor só aprova (saída 0) quando todas as linhas têm `[x]` e uma prova com pelo menos 8 letras.
Ele aceita `prova:`, `proof:` e `prueba:`.
