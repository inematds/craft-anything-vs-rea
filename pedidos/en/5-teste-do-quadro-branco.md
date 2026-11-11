# Request 5 — The whiteboard test

A good test for any tool that “rebuilds apps”: a drawing whiteboard (like Excalidraw, which is open source). It has many features that are easy to check and a simple look, so it’s easy to see whether the copy only looks good or actually draws.

**In Craft Anything:** in Settings, raise “Good enough” (how close it needs to be before it stops refining; the default is 90%) to 95%. Then: Make → Website → whiteboard URL → Clean room → paste the prompt below → Start.

```text
Make my own version of this whiteboard app and call it <NAME>. Keep the same drawing tools and
layout, but use my own name and colors.
```

In Portuguese (works just as well):

```text
Faça a minha própria versão deste app de quadro branco e chame de <NOME>. Mantenha as mesmas
ferramentas de desenho e o mesmo layout, mas use o meu nome e as minhas cores.
```

When it’s ready, generate and fill in the feature checklist:

```bash
python3 conferir/funcoes.py gerar quadro-branco --nome "<NOME>" --saida checklist.md
```

There are 16 features: rectangle, circle, diamond, line, arrow, pencil, text, color, move, resize, erase, undo/redo, zoom, light/dark theme, export image, and custom branding.
Use the URL of an instance you can test; don’t use a site that requires login.