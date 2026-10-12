const assert = require('node:assert/strict');
const {validate, exercises} = require('../validator-a2.js');
const {wrap, build} = require('./_javac.js');

const desglose3 = `
        final int B50 = 5000, B20 = 2000, B10 = 1000, B5 = 500, E2 = 200, E1 = 100;
        final int C50 = 50, C20 = 20, C10 = 10, C5 = 5, C2 = 2;
        int cent = (int) Math.round(in.nextDouble() * 100);
        int b50 = cent / B50;  cent = cent % B50;
        int b20 = cent / B20;  cent = cent % B20;
        int b10 = cent / B10;  cent = cent % B10;
        int b5 = cent / B5;    cent = cent % B5;
        int e2 = cent / E2;    cent = cent % E2;
        int e1 = cent / E1;    cent = cent % E1;
        int c50 = cent / C50;  cent = cent % C50;
        int c20 = cent / C20;  cent = cent % C20;
        int c10 = cent / C10;  cent = cent % C10;
        int c5 = cent / C5;    cent = cent % C5;
        int c2 = cent / C2;    int c1 = cent % C2;
        System.out.println("Billetes 50/20/10/5: " + b50 + " " + b20 + " " + b10 + " " + b5);
        System.out.println("Monedas 2E/1E: " + e2 + " " + e1);
        System.out.println("Centimos 50/20/10/5/2/1: " + c50 + " " + c20 + " " + c10 + " " + c5 + " " + c2 + " " + c1);`;

// Una solución correcta y realista por ejercicio. Se compilan con javac y se ejecutan con datos de entrada.
const sols = [
 {id:1, cls:'CentimoPerdido', input:'19.99\n', expect:['truncado 1998', 'redondeado 1999'], src:wrap('CentimoPerdido', `
        double euros = in.nextDouble();
        int truncado = (int) (euros * 100);
        int redondeado = (int) Math.round(euros * 100);
        System.out.println("truncado " + truncado);
        System.out.println("redondeado " + redondeado);`)},
 {id:2, cls:'EurosCentimos', input:'7.05\n', expect:['7,05 EUR'], src:wrap('EurosCentimos', `
        double importe = in.nextDouble();
        int centimos = (int) Math.round(importe * 100);
        int euros = centimos / 100;
        int resto = centimos % 100;
        System.out.printf("%d,%02d EUR%n", euros, resto);`)},
 {id:3, cls:'DesgloseImporte', input:'187.65\n', expect:['Billetes 50/20/10/5: 3 1 1 1', 'Monedas 2E/1E: 1 0', 'Centimos 50/20/10/5/2/1: 1 0 1 1 0 0'], src:wrap('DesgloseImporte', desglose3)},
 {id:4, cls:'CambioCompra', input:'17.85\n20\n', expect:[' 1 x   2.00', ' 0 x   1.00', ' 1 x   0.10', ' 1 x   0.05'], src:wrap('CambioCompra', `
        final int B10 = 1000, B5 = 500, M2 = 200, M1 = 100, C50 = 50, C20 = 20, C10 = 10, C5 = 5, C2 = 2, C1 = 1;
        int precio = (int) Math.round(in.nextDouble() * 100);
        int entregado = (int) Math.round(in.nextDouble() * 100);
        int cambio = entregado - precio;
        int[] valores = {B10, B5, M2, M1, C50, C20, C10, C5, C2, C1};
        int b10 = cambio / B10;  cambio = cambio % B10;
        int b5 = cambio / B5;    cambio = cambio % B5;
        int m2 = cambio / M2;    cambio = cambio % M2;
        int m1 = cambio / M1;    cambio = cambio % M1;
        int c50 = cambio / C50;  cambio = cambio % C50;
        int c20 = cambio / C20;  cambio = cambio % C20;
        int c10 = cambio / C10;  cambio = cambio % C10;
        int c5 = cambio / C5;    cambio = cambio % C5;
        int c2 = cambio / C2;    int c1 = cambio % C2;
        int[] cuantas = {b10, b5, m2, m1, c50, c20, c10, c5, c2, c1};
        for (int i = 0; i < valores.length; i++) System.out.printf("%2d x %6.2f EUR%n", cuantas[i], valores[i] / 100.0);`)},
 {id:5, cls:'RetiradaComision', input:'125.50\n', expect:['Comision:     1.88 EUR', 'Total:      127.38 EUR'], src:wrap('RetiradaComision', `
        final double COMISION = 0.015;
        int importe = (int) Math.round(in.nextDouble() * 100);
        int comision = (int) Math.round(importe * COMISION);
        int total = importe + comision;
        System.out.printf("Importe:  %8.2f EUR%n", importe / 100.0);
        System.out.printf("Comision: %8.2f EUR%n", comision / 100.0);
        System.out.printf("Total:    %8.2f EUR%n", total / 100.0);`)}
];
// Variantes válidas: desglose restando en lugar de %, comisión con porcentaje, un solo printf.
const alt = [
 {id:2, cls:'EurosCentimosB', input:'12.5\n', expect:['12,50'], src:wrap('EurosCentimosB', `
        long c = Math.round(in.nextDouble() * 100);
        int cents = (int) c;
        System.out.println((cents / 100) + "," + String.format("%02d", cents % 100));`)},
 {id:3, cls:'DesgloseResta', input:'187.65\n', expect:['3 1 1 1 1 0 1 0 1 1 0 0'], src:wrap('DesgloseResta', `
        final int B50 = 5000, B20 = 2000, B10 = 1000, B5 = 500, M2 = 200, M1 = 100;
        int q = (int) Math.round(in.nextDouble() * 100);
        int a = q / B50; q -= a * B50;
        int b = q / B20; q -= b * B20;
        int c = q / B10; q -= c * B10;
        int d = q / B5;  q -= d * B5;
        int e = q / M2;  q -= e * M2;
        int f = q / M1;  q -= f * M1;
        int g = q / 50;  q -= g * 50;
        int h = q / 20;  q -= h * 20;
        int i = q / 10;  q -= i * 10;
        int j = q / 5;   q -= j * 5;
        int k = q / 2;   q -= k * 2;
        System.out.println(a + " " + b + " " + c + " " + d + " " + e + " " + f + " " + g + " " + h + " " + i + " " + j + " " + k + " " + q);`)},
 {id:5, cls:'RetiradaPct', input:'200\n', expect:['3.00', '203.00'], src:wrap('RetiradaPct', `
        final double PCT = 1.5;
        int imp = (int) Math.round(in.nextDouble() * 100);
        long com = Math.round(imp * PCT / 100);
        long tot = imp + com;
        System.out.printf("%8.2f%n%8.2f%n%8.2f%n", imp / 100.0, com / 100.0, tot / 100.0);`)}
];
build('ampliacion2', sols.concat(alt));
assert.equal(exercises.length, 5);
for (const s of sols.concat(alt)) { const r = validate(s.id, s.src); assert.ok(r.complete, `A2.2 ejercicio ${s.id} (${s.cls}): faltan ${r.results.filter(x => !x.pass).map(x => x.id).join(', ')}`); }

// Todas las plantillas (con pistas) quedan incompletas.
for (const e of exercises) assert.ok(!validate(e.id, e.template).complete, `La plantilla ${e.id} no debe superar el ejercicio`);

// Casos negativos.
const w = s => wrap('Prueba', s);
// 1. Solo trunca: no redondea con Math.round.
assert.ok(!validate(1, w('double e=in.nextDouble(); int t=(int)(e*100); System.out.println(t);')).complete);
// 2. Sin formato de dos cifras (%02d) para los céntimos.
assert.ok(!validate(2, w('double i=in.nextDouble(); int c=(int)Math.round(i*100); System.out.println(c/100+","+c%100);')).complete);
// 3. Trunca en lugar de redondear al convertir a céntimos y sin constantes final.
assert.ok(!validate(3, w('int q=(int)(in.nextDouble()*100); int a=q/5000; q%=5000; int b=q/2000; q%=2000; int c=q/1000; q%=1000; int d=q/500; q%=500; int e=q/200; q%=200; int f=q/100; q%=100; int g=q/50; q%=50; int h=q/20; q%=20; int i=q/10; q%=10; int j=q/5; q%=5; int k=q/2; System.out.println(a+b+c+d+e+f+g+h+i+j+k+" "+q%2);')).complete);
// 4. Resta dos double directamente (sin pasar a céntimos): faltan los redondeos.
assert.ok(!validate(4, w('final int B10=1000,B5=500,M2=200; double p=in.nextDouble(), e=in.nextDouble(); int cambio=(int)((e-p)*100); System.out.printf("%2d x %6.2f%n", cambio/B10, B10/100.0);')).complete);
// 5. Comisión fija en el texto y sin constante ni lectura.
assert.ok(!validate(5, w('System.out.println("Comisión 1.5 %: " + 125.5 * 0.015);')).complete);
// 6. El código clave está solo en un comentario.
assert.ok(!validate(2, w('// int c=(int)Math.round(x*100); printf("%02d")\n double x=in.nextDouble(); System.out.println(x);')).complete);
console.log('✓ Ampliación 2.2: 5 soluciones (+3 variantes) compiladas y ejecutadas con javac, 5 plantillas incompletas y 6 casos negativos correctos.');
