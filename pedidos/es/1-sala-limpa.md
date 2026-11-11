# Pedido 1 — Recrear en una sala limpia

Úsalo cuando el original NO sea tuyo. «Sala limpia» = el agente solo usa lo que cualquier visitante puede ver:
la página abierta en el navegador, las capturas de pantalla, los colores, las medidas y el texto visible. Nada de código,
archivos internos ni código fuente de la página.

**En Craft Anything:** elige "Clean room" (es la opción predeterminada) y pega el pedido en el campo "What do you want to make?".
**Con tu agente directo (Claude Code, Codex, dsh):** pega el pedido completo en el chat.

```text
Quiero mi propia versión de esta app: <DIRECCIÓN DEL ORIGINAL>
Llámala <NOMBRE NUEVO>. Usa mis colores: <COLOR PRINCIPAL> y <COLOR DE ACENTO>.

Reglas de la sala limpia:
- Estudia solo lo que ve un visitante: abre la página en el navegador, toma capturas de pantalla en 1440, 820 y 390 px,
  mide los colores, las fuentes, los espacios y la posición de los bloques, y usa el texto visible como referencia.
- No leas el código fuente de la página, los scripts ni los archivos internos del original.
- No copies el logo, las fotos ni los textos del original: escribe los tuyos y diseña un logo sencillo.
- Escribe tu versión desde cero en una carpeta nueva (mi-versión/) y dime cómo abrirla.

Antes de decir que terminaste:
- Compárala con el original en funcionamiento: node conferir/semelhanca.js <DIRECCIÓN DEL ORIGINAL> minha-versao/index.html
- Prueba cada función que tenga el original (haz clic, escribe, arrastra) y muéstrame qué pasó.
```

Cambia lo que está entre `< >`. Si la app es tuya (tienes el código y quieres estudiarla por dentro),
usa el modo Deep de Craft Anything o REA; consulta la guía.