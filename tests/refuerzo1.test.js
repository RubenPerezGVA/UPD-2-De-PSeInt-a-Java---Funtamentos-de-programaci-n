const assert = require('node:assert/strict');
const {validate, exercises} = require('../validator-r1.js');
const {wrap, build} = require('./_javac.js');

// Una solución correcta y realista por ejercicio (identificadores distintos a los del enunciado). Se compilan con javac y se ejecutan.
const sols = [
 {id:1, cls:'Bienvenida', input:'Lucía Gómez Ruiz\n', expect:['Sr/a. Lucía Gómez Ruiz.', 'Bienvenido/a a 1.º de DAW.'], src:wrap('Bienvenida', `
        System.out.print("Nombre completo: ");
        String persona = in.nextLine();
        System.out.println("Buenas tardes.");
        System.out.println("Sr/a. " + persona + ".");
        System.out.println("Bienvenido/a a 1.º de DAW.");`)},
 {id:2, cls:'OperaReales', input:'7.5 2\n', expect:['Suma: 9.5', 'Resto: 1.5', 'Tras ++: 8.5', 'Tras --: 1.0'], src:wrap('OperaReales', `
        float x = in.nextFloat();
        float y = in.nextFloat();
        System.out.println("Suma: " + (x + y));
        System.out.println("Resta: " + (x - y));
        System.out.println("Producto: " + x * y);
        System.out.println("División: " + x / y);
        System.out.println("Resto: " + x % y);
        x++;
        y--;
        System.out.println("Tras ++: " + x);
        System.out.println("Tras --: " + y);`)},
 {id:3, cls:'MillasAMetros', input:'3\n', expect:['4828.0', '4.828'], src:wrap('MillasAMetros', `
        final double METROS_MILLA = 1609.344;
        double millas = in.nextDouble();
        double metros = millas * METROS_MILLA;
        double km = metros / 1000;
        System.out.println(millas + " millas = " + metros + " m = " + km + " km");`)},
 {id:4, cls:'Comparador', input:'4 9\n', expect:['iguales? false', 'distintos? true', 'menor o igual? true'], src:wrap('Comparador', `
        int p = in.nextInt(), q = in.nextInt();
        boolean iguales = p == q;
        boolean distintos = p != q;
        boolean mayor = p > q;
        boolean menor = p < q;
        boolean mayorIgual = p >= q;
        boolean menorIgual = p <= q;
        System.out.println("¿Son iguales? " + iguales);
        System.out.println("¿Son distintos? " + distintos);
        System.out.println("¿Primero mayor? " + mayor);
        System.out.println("¿Primero menor? " + menor);
        System.out.println("¿Mayor o igual? " + mayorIgual);
        System.out.println("¿Menor o igual? " + menorIgual);`).replace('¿Son iguales? ','iguales? ').replace('¿Son distintos? ','distintos? ').replace('¿Menor o igual? ','menor o igual? ')},
 {id:5, cls:'Esfera', input:'3\n', expect:['18.85', '28.27', '113.10'], src:wrap('Esfera', `
        double r = in.nextDouble();
        double longitud = 2 * Math.PI * r;
        double area = Math.PI * Math.pow(r, 2);
        double volumen = 4.0 / 3 * Math.PI * Math.pow(r, 3);
        System.out.printf("Longitud %.2f cm, área %.2f cm2, volumen %.2f cm3%n", longitud, area, volumen);`)},
 {id:6, cls:'Nomina', input:'Lucía\n80\n12.5\n', expect:['Lucía', '1000.0', '150.0', '850.0'], src:wrap('Nomina', `
        String trabajadora = in.nextLine();
        int horas = in.nextInt();
        double precioHora = in.nextDouble();
        double bruto = horas * precioHora;
        double retencion = bruto * 0.15;
        double neto = bruto - retencion;
        System.out.println(trabajadora);
        System.out.println("Bruto: " + bruto);
        System.out.println("Retención: " + retencion);
        System.out.println("Neto: " + neto);`)}
];
build('refuerzo1', sols);
assert.equal(exercises.length, 6);
for (const s of sols) { const r = validate(s.id, s.src); assert.ok(r.complete, `R2.1 ejercicio ${s.id}: faltan ${r.results.filter(x => !x.pass).map(x => x.id).join(', ')}`); }

// Todas las plantillas (con pistas) quedan incompletas.
for (const e of exercises) assert.ok(!validate(e.id, e.template).complete, `La plantilla ${e.id} no debe superar el ejercicio`);

// Casos negativos.
const w = s => wrap('Prueba', s);
// 1. Nombre fijo en el mensaje, sin leer nada.
assert.ok(!validate(1, w('System.out.println("Buenas tardes."); System.out.println("Sr/a. Lucía Gómez Ruiz."); System.out.println("Bienvenido/a a 1.º de DAW.");')).complete);
// 2. Sin el operador % (resto) ni ++/--.
assert.ok(!validate(2, w('float a=in.nextFloat(), b=in.nextFloat(); System.out.println(a+b); System.out.println(a-b); System.out.println(a*b); System.out.println(a/b);')).complete);
// 3. El factor solo aparece en un comentario y en un literal.
assert.ok(!validate(3, w('// final double F = 1609.344;\n double m=in.nextDouble(); System.out.println("1609.344 " + m*1609);')).complete);
// 4. Solo tres operadores relacionales.
assert.ok(!validate(4, w('int a=in.nextInt(), b=in.nextInt(); boolean i=a==b; boolean d=a!=b; boolean m=a>b; System.out.println(i+" "+d+" "+m);')).complete);
// 5. 4 / 3 con enteros (vale 1).
assert.ok(!validate(5, w('double r=in.nextDouble(); double l=2*Math.PI*r; double a=Math.PI*Math.pow(r,2); double v=4/3*Math.PI*Math.pow(r,3); System.out.println(l+" "+a+" "+v);')).complete);
// 6. Sin leer el nombre (solo dos lecturas) y sin neto.
assert.ok(!validate(6, w('int h=in.nextInt(); double p=in.nextDouble(); double b=h*p; System.out.println(b*0.15);')).complete);
// 7. El pseudocódigo en comentarios no cuenta.
assert.ok(!validate(2, w('// float s=a+b, r=a%b; a++; b--;\n float a=in.nextFloat(), b=in.nextFloat(); System.out.println(a);')).complete);
console.log('✓ Refuerzo 2.1: 6 soluciones (compiladas con javac y ejecutadas) completas, 6 plantillas incompletas y 7 casos negativos correctos.');
