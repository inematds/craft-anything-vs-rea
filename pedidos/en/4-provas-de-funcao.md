# Request 4 — Prove every feature (rea-com-provas style)

“Looking right isn’t the same as working.” The agent says everything works; this request requires it to show proof
for every feature, in a list that `conferir/funcoes.py` checks automatically.

First, generate the list:

```bash
python3 conferir/funcoes.py gerar quadro-branco --nome "<NAME>" --saida checklist.md
# another app type: python3 conferir/funcoes.py gerar generico --nome "<NAME>" --saida checklist.md
```

Then paste this into the agent:

```text
Open checklist.md. For each line, test the feature for real in my version (open it in the browser,
click, drag, type; use Playwright if needed), and only then:
- change [ ] to [x];
- after "prova:" write what you saw: the screenshot file (save it in provas/), or the command and its output.

Example of a completed line:
- [x] F01 Rectangle — Select the rectangle, drag on the canvas… | prova: provas/f01-retangulo.png shows the 200x120 rectangle

Rules:
- Do not mark [x] without testing. If a feature does not work, leave [ ] and write why after "prova:".
- Do not delete lines or change the F01, F02… numbers.
- At the end, run: python3 conferir/funcoes.py conferir checklist.md and show me the output.
```

The checker only passes (exit code 0) when every line has `[x]` and proof with at least 8 letters.
It accepts `prova:`, `proof:` and `prueba:`.