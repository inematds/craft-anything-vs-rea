# Pedido 2 — Meta de similitud (el agente solo se detiene cuando alcanza la meta)

El agente tiende a decir «quedó igual» demasiado pronto. Este pedido le da un número que debe alcanzar y
un criterio que no depende de él mismo: el `conferir/semelhanca.js` de este kit.

```text
Meta: mi versión tiene que alcanzar al menos <85> de ESTRUCTURA en los tres anchos.

Para medir, ejecuta (y muéstrame la tabla que aparece):
  node conferir/semelhanca.js <DIRECCIÓN DEL ORIGINAL> <DIRECCIÓN O ARCHIVO DE MI VERSIÓN> --meta <85> --saida conferencia

Repite este ciclo hasta que el resultado sea 0 (como máximo <5> rondas):
1. Abre conferencia/diferencas-<largura>.png del ancho con el peor resultado: lo rojo es lo que está diferente.
2. Corrige lo que causa la mancha roja más grande (posición, tamaño, espaciado).
3. Vuelve a ejecutarlo.

No cambies el color ni el nombre que pedí solo para subir la nota: la nota de COLOR solo informa.
Si te quedas por debajo de la meta después de las rondas, detente y dime qué falta y por qué.
```

**Por qué 85 y no 99:** la nota de estructura baja cuando cambian el nombre, el logo o el pie de página (eso es lo que
quieres). En la prueba de este kit, la copia hecha por Craft Anything obtuvo 93,6 / 90,7 / 85,5.
Usa `--meta 90` cuando la idea sea copiar la pantalla casi píxel por píxel.