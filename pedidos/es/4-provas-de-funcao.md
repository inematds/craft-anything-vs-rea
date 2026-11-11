# Pedido 4 — Probar cada función (estilo rea-con-pruebas)

«Que se parezca no significa que funcione». El agente dice que todo funciona; este pedido le exige mostrar la prueba
de cada función, en una lista que `conferir/funcoes.py` verifica automáticamente.

Primero, genera la lista:

```bash
python3 conferir/funcoes.py gerar quadro-branco --nome "<NOMBRE>" --saida checklist.md
# otro tipo de app: python3 conferir/funcoes.py gerar generico --nome "<NOMBRE>" --saida checklist.md
```

Después, pégalo en el agente:

```text
Abre checklist.md. Para cada línea, prueba la función de verdad en mi versión (abre en el navegador,
haz clic, arrastra, escribe; usa Playwright si hace falta) y solo entonces:
- cambia [ ] por [x];
- escribe después de "prova:" lo que viste: el archivo de la captura (guárdalo en provas/), o el comando y la salida.

Ejemplo de línea completa:
- [x] F01 Rectángulo — Elige el rectángulo, arrastra en la pantalla… | prova: provas/f01-retangulo.png muestra el rectángulo de 200x120

Reglas:
- No marques [x] sin haberlo probado. Si una función no funciona, déjala en [ ] y escribe por qué después de "prova:".
- No borres líneas ni cambies los números F01, F02…
- Al final, ejecuta: python3 conferir/funcoes.py conferir checklist.md y muéstrame la salida.
```

("prova" significa "prueba" en portugués; el verificador también acepta "prueba:").

El verificador solo aprueba (salida 0) cuando todas las líneas tienen `[x]` y una prueba de al menos 8 letras.
Acepta `prova:`, `proof:` y `prueba:`.