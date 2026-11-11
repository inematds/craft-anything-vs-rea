# Request 2 — Similarity target (the agent stops only when it meets the target)

The agent tends to say “it looks the same” too soon. This request gives it a number to reach and
an independent measuring stick: this kit’s `conferir/semelhanca.js`.

```text
Target: my version must reach at least <85> in STRUCTURE at all three widths.

To measure it, run (and show me the resulting table):
  node conferir/semelhanca.js <ORIGINAL ADDRESS> <MY VERSION ADDRESS OR FILE> --meta <85> --saida conferencia

Repeat this cycle until the score is 0 (up to <5> rounds):
1. Open conferencia/diferencas-<largura>.png at the worst width: red shows what is different.
2. Fix what causes the largest red area (position, size, spacing).
3. Run it again.

Don’t change the color or name I requested just to raise the score: the COLOR score is informational only.
If it gets stuck below the target after the rounds, stop and tell me what’s missing and why.
```

**Why 85 and not 99:** the structure score drops when the name, logo, or footer changes (which is what
you want). In this kit’s test, the copy made by Craft Anything scored 93.6 / 90.7 / 85.5.
Use `--meta 90` when the goal is to copy the screen almost pixel for pixel.