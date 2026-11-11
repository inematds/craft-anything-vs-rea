# Pedido 5 — O teste do quadro branco

Um bom teste para qualquer ferramenta que "refaz apps": um quadro branco de desenho (como o
Excalidraw, que é aberto). Tem muitas funções fáceis de conferir e um visual simples, então é
fácil ver se a cópia só ficou bonita ou se desenha de verdade.

**No Craft Anything:** em Settings, suba "Good enough" (quão parecido tem que ficar antes de parar
de refinar; o padrão é 90%) para 95%. Depois: Make → Website → endereço do quadro branco →
Clean room → cole o pedido abaixo → Start.

```text
Make my own version of this whiteboard app and call it <NOME>. Keep the same drawing tools and
layout, but use my own name and colors.
```

Em português (funciona igual):

```text
Faça a minha própria versão deste app de quadro branco e chame de <NOME>. Mantenha as mesmas
ferramentas de desenho e o mesmo layout, mas use o meu nome e as minhas cores.
```

Quando ficar pronto, gere e preencha a lista de funções:

```bash
python3 conferir/funcoes.py gerar quadro-branco --nome "<NOME>" --saida checklist.md
```

São 16 funções: retângulo, círculo, losango, linha, seta, lápis, texto, cor, mover, redimensionar,
apagar, desfazer/refazer, zoom, tema claro/escuro, exportar imagem e marca própria.
Use o endereço de uma instância que você pode testar; não use site com login.
