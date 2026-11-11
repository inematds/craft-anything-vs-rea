# Pedido 5 — La prueba de la pizarra

Una buena prueba para cualquier herramienta que “recrea apps”: una pizarra para dibujar (como
Excalidraw, que es de código abierto). Tiene muchas funciones fáciles de comprobar y un aspecto
sencillo, así que es fácil ver si la copia solo quedó bonita o si realmente permite dibujar.

**En Craft Anything:** en Settings, sube “Good enough” (qué tan parecida debe quedar antes de dejar
de refinar; el valor predeterminado es 90%) a 95%. Luego: Make → Website → dirección de la pizarra →
Clean room → pega el pedido de abajo → Start.

```text
Crea mi propia versión de esta app de pizarra y llámala <NOMBRE>. Mantén las mismas herramientas de dibujo y
el mismo diseño, pero usa mi nombre y mis colores.
```

En portugués (funciona igual):

```text
Faça a minha própria versão deste app de quadro branco e chame de <NOME>. Mantenha as mesmas
ferramentas de desenho e o mesmo layout, mas use o meu nome e as minhas cores.
```

Cuando esté lista, genera y completa la lista de funciones:

```bash
python3 conferir/funcoes.py gerar quadro-branco --nome "<NOME>" --saida checklist.md
```

Son 16 funciones: rectángulo, círculo, rombo, línea, flecha, lápiz, texto, color, mover, cambiar el tamaño,
borrar, deshacer/rehacer, zoom, tema claro/oscuro, exportar imagen y marca propia.
Usa la dirección de una instancia que puedas probar; no uses un sitio con inicio de sesión.