# Java paso a paso · 1.º DAW

**Autor:** Rubén Pérez Ibáñez · IES Álvaro Falomir · Curso 2026/27.

| Evaluación | Horas | RA | Fechas previstas |
|---|---|---|---|
| 1.ª | 24 h | RA1, RA2, RA5 | 25/09 – 16/10 |

**Contenidos:** del pseudocódigo a Java, IntelliJ IDEA, estructura de un programa, variables, tipos primitivos, literales y constantes, operadores, conversiones de tipo, entrada con `Scanner`, salida con formato y métodos estáticos de `Math`.

Web estática basada en la dinámica del proyecto `pseint-1daw`, adaptada a Java y a los **11 ejercicios** de «Introducción a Java. Sentencias simples» (10 ejercicios y uno de ampliación), más un ejercicio 12 básico de conversiones de tipo (*casting*: int → double, double → int y double → String). Incluye la teoría PDF de «Elementos básicos del lenguaje» como material complementario.

## Utilización y publicación

- Abre `index.html` en un navegador moderno o, preferentemente, publícalo mediante GitHub Pages. No necesita servidor de aplicaciones, cuenta de alumno ni instalación de Java para mostrar la web.
- Para publicar: crea un repositorio nuevo, por ejemplo `java-1daw`, sube **todo el contenido** de esta carpeta a la rama `main`, ve a Settings → Pages → Deploy from a branch → `main` → `/(root)`. El enlace será `https://TU_USUARIO.github.io/java-1daw/` si mantienes ese nombre de repositorio.
- Si se abre como archivo local, el comportamiento de `localStorage` y las descargas depende del navegador; GitHub Pages (HTTPS) es preferible.
- Cada estudiante debe resolver y ejecutar sus programas reales en IntelliJ IDEA, pegar el contenido del archivo `.java`, validar y corregir. No es necesario utilizar los nombres de variables de los enunciados.
- Para la entrega en Aules, pide el justificante impreso/guardado como PDF **y los archivos `.java`** o un ZIP con ellos. El botón «Exportar código» descarga un JSON complementario con las fuentes y el desglose de validación; no reemplaza necesariamente al proyecto Java.

## Archivos

- `index.html`, `styles.css`, `app.js`: interfaz, persistencia local, justificante y exportación.
- `validator.js`: ejercicios, pistas y reglas de comprobación **independientes por criterio**.
- `material/`: los dos documentos PDF aportados.
- `tests/validator.test.js`: pruebas automáticas de la validación estática.

## Qué valida y qué no

- Acepta variables, nombres de clase y mensajes distintos, `Scanner` y `BufferedReader` para entradas; permite sumar o multiplicar en asignaciones o directamente en salidas; admite Java clásico y el formato compacto de **Java 25 y 26** (`void main()` sin clase, `IO.println`/`IO.print` e `IO.readln`, `var`); la salida es libre: basta con al menos un `System.out` (varios `println`, uno solo con todo junto o `printf`, en cualquier orden); ofrece un resultado **parcial** por criterio sin exigir el mismo código que una solución modelo.
- La comprobación no compila Java, no ejecuta los programas ni verifica su resultado con casos de prueba. **Puede dar falsos positivos o falsos negativos** ante código semánticamente erróneo o soluciones alternativas. El docente puede revisar el archivo `.java` en IntelliJ y comprobar ejecución y resultados. El justificante solo refleja el análisis local en el instante de su generación y no incluye autenticación, firma ni validación remota.
- Al editar un ejercicio se invalida su resultado anterior; al generar un justificante se recalculan todos los criterios con el código que esté guardado. Los datos no salen del navegador ni se sincronizan entre dispositivos.
- Se puede generar un justificante parcial o completo; únicamente muestra «Todos los ejercicios validados» cuando se han superado los 12 mediante las reglas heurísticas.

## Observación sobre el documento original

En la tabla del ejercicio 7 aparece cola: `100 000 × 0,17 → 170 000` y un total de `340 700`. Al multiplicar los datos del propio enunciado, el importe de cola sería `17 000` y el total de los tres productos `187 700`. La web conserva las cantidades y precios originales y señala expresamente la discrepancia en el ejemplo de resultados.

## Comprobación técnica

Con Node.js instalado, desde esta carpeta ejecuta:

```bash
node tests/validator.test.js
```

Se comprueban 13 soluciones con identificadores libres (dos del ejercicio de casting), un caso de validación parcial, ignorar comentarios/literales que contienen pseudocódigo aparente y detectar la ausencia de intercambio real en el ejercicio 6.

## Ampliación (`ampliacion.html`)

Segunda página con **12 retos nuevos** del mismo nivel (solo sentencias simples, sin `if` ni bucles) y la misma dinámica: pistas, validación parcial por criterios, justificante y exportación. Temas: división entera y resto (tiempo, cajero, cifras, pizzas), fórmulas (nota ponderada, temperaturas), aplicaciones (viaje, carrera), rotación de tres variables, constantes con `final` y la clase `Math` (factura de la luz y distancia entre dos puntos).

- `validator-ampliacion.js`: enunciados y criterios; reutiliza el analizador de `validator.js` (se carga antes).
- `app.js` lee la configuración de cada página (clave de almacenamiento, título de la actividad y nombres de archivo), así que el progreso de ambas prácticas se guarda por separado.
- Pruebas: `node tests/ampliacion.test.js`.

## Pistas en el código y restos sin `%`

- Cada ejercicio (práctica 1 y ampliación) trae en su plantilla pistas paso a paso como comentarios con huecos `___`. Al ser comentarios, el validador las ignora: la plantilla sin completar no supera ningún ejercicio. Quien ya tenga código guardado las verá con «Recuperar plantilla».
- En la ampliación, el tiempo (h/min/s) y el cajero admiten calcular lo que sobra con `%` o dividiendo y restando (`resto = total - horas * 3600`, `q -= b50 * 50`).

---

<!-- BEGIN programacion-0485 (generado con gen/sync_ideaprojects.py desde gen/data.py; no editar a mano) -->
## Relación con la programación didáctica 2026-27

Ficha de la **UP2** en la programación del módulo 0485 (1.º DAW): 24 h · 1.ª evaluación · RA 1, 2, 5 · 25/09 – 16/10. Cada práctica evaluable (P, 10 % de la nota, Apto / No apto) tiene una actividad de **refuerzo** (R) y otra de **ampliación** (A) con el mismo número, que trabajan criterios de evaluación de la propia práctica. El examen de la evaluación (90 %) evalúa todos los criterios de las prácticas.

| Código | Actividad | Criterios de evaluación |
|---|---|---|
| **P2.1** | Java paso a paso: 12 ejercicios de sentencias simples traducidos desde PSeInt (E/S, áreas y perímetros, `Math.PI`, intercambio de variables, ventas, IVA, conversiones de unidades y de tipo con *casting*) (web autovalidada + justificante) y ficheros `.java`. | RA1 a, b, c, d, e, f, g, h, i; RA2 b, e, g, i; RA5 a, b |
| R2.1 | Refuerzo: Ejercicios resueltos y propuestos de la teoría de elementos básicos de Java y ejemplos de la guía de la UP2, rehechos con otros datos. | RA1 d, e, h; RA2 b; RA5 a |
| A2.1 | Ampliación: Variantes de los ejercicios con salida formateada (`printf`) y cálculos con `Math` (redondeo, potencias, raíces). | RA1 g, h; RA2 e; RA5 b |
| **P2.2** | Ampliación de sentencias simples: 12 retos (división entera y resto, fórmulas, `final` y `Math`) (web autovalidada + justificante). | RA1 e, f, g, h; RA2 b, e, i; RA5 a, b |
| R2.2 | Refuerzo: Retos de división entera y resto (tiempo, cajero) partiendo de la plantilla con pistas («Recuperar plantilla») y corrección por criterios del validador. | RA1 e, g; RA2 b; RA5 a |
| A2.2 | Ampliación: Desglose de un importe con céntimos en billetes y monedas: conversión `double`→`int` y redondeo, constantes `final` y salida con formato. | RA1 f, g, h; RA2 e; RA5 b |
<!-- END programacion-0485 -->
