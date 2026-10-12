const assert = require('node:assert/strict');
const {validate, exercises} = require('../validator-a1.js');
const {wrap, build} = require('./_javac.js');

// Una solución correcta y realista por ejercicio. Se compilan con javac y se ejecutan con datos de entrada.
const sols = [
 {id:1, cls:'TicketFormato', input:'Cuaderno\n3\n2.45\n', expect:['Cuaderno        3 x     2.45 =     7.35'], src:wrap('TicketFormato', `
        String articulo = in.nextLine();
        int cantidad = in.nextInt();
        double precio = in.nextDouble();
        double importe = cantidad * precio;
        System.out.printf("%-12s %4d x %8.2f = %8.2f%n", articulo, cantidad, precio, importe);`)},
 {id:2, cls:'Redondeos', input:'7.456\n', expect:['floor 7.0', 'ceil 8.0', 'round 7', '2 decimales 7.46'], src:wrap('Redondeos', `
        double valor = in.nextDouble();
        double abajo = Math.floor(valor);
        double arriba = Math.ceil(valor);
        long cercano = Math.round(valor);
        double dosDecimales = Math.round(valor * 100) / 100.0;
        System.out.println("floor " + abajo);
        System.out.println("ceil " + arriba);
        System.out.println("round " + cercano);
        System.out.println("2 decimales " + dosDecimales);`)},
 {id:3, cls:'InteresCompuesto', input:'1000\n3\n5\n', expect:['1159.27', '159.27'], src:wrap('InteresCompuesto', `
        double capital = in.nextDouble();
        double tasa = in.nextDouble();
        int anios = in.nextInt();
        double finalC = capital * Math.pow(1 + tasa / 100, anios);
        double ganado = finalC - capital;
        System.out.printf("Capital final: %.2f EUR%n", finalC);
        System.out.printf("Intereses: %.2f EUR%n", ganado);`)},
 {id:4, cls:'SegundoGrado', input:'1 -3 2\n', expect:['x1 = 2.000', 'x2 = 1.000'], src:wrap('SegundoGrado', `
        double a = in.nextDouble(), b = in.nextDouble(), c = in.nextDouble();
        double disc = Math.pow(b, 2) - 4 * a * c;
        double raiz = Math.sqrt(disc);
        double x1 = (-b + raiz) / (2 * a);
        double x2 = (-b - raiz) / (2 * a);
        System.out.printf("x1 = %.3f%nx2 = %.3f%n", x1, x2);`)},
 {id:5, cls:'CuboDeposito', input:'1000\n', expect:['10.00 dm', '1.00 m', '600.00', '17.32'], src:wrap('CuboDeposito', `
        double litros = in.nextDouble();
        double ladoDm = Math.cbrt(litros);
        double ladoM = ladoDm / 10;
        double superficie = 6 * ladoDm * ladoDm;
        double diagonal = ladoDm * Math.sqrt(3);
        System.out.printf("Lado: %.2f dm = %.2f m%n", ladoDm, ladoM);
        System.out.printf("Superficie: %.2f dm2%n", superficie);
        System.out.printf("Diagonal: %.2f dm%n", diagonal);`)}
];
// Variantes válidas del mismo ejercicio (otra forma de resolverlo).
const alt = [
 {id:2, cls:'RedondeoRint', input:'2.5\n', expect:['2.5'], src:wrap('RedondeoRint', `
        double v = in.nextDouble();
        System.out.println(Math.floor(v) + " " + Math.ceil(v) + " " + Math.round(v) + " " + Math.rint(v * 100) / 100.0);`)},
 {id:5, cls:'CuboPow', input:'8\n', expect:['2.00'], src:wrap('CuboPow', `
        double l = in.nextDouble();
        double lado = Math.pow(l, 1.0 / 3);
        double sup = 6 * Math.pow(lado, 2);
        double diag = Math.sqrt(3) * lado;
        System.out.printf("%.2f %.2f %.2f %.2f%n", lado, lado / 10, sup, diag);`)},
 {id:1, cls:'TicketFormat', input:'Boli\n2\n1.1\n', expect:['Boli'], src:wrap('TicketFormat', `
        String p = in.nextLine(); int u = in.nextInt(); double pr = in.nextDouble();
        System.out.println(String.format("%-12s%4d%8.2f%8.2f", p, u, pr, u * pr));`)}
];
build('ampliacion1', sols.concat(alt));
assert.equal(exercises.length, 5);
for (const s of sols.concat(alt)) { const r = validate(s.id, s.src); assert.ok(r.complete, `A2.1 ejercicio ${s.id} (${s.cls}): faltan ${r.results.filter(x => !x.pass).map(x => x.id).join(', ')}`); }

// Todas las plantillas (con pistas) quedan incompletas.
for (const e of exercises) assert.ok(!validate(e.id, e.template).complete, `La plantilla ${e.id} no debe superar el ejercicio`);

// Casos negativos.
const w = s => wrap('Prueba', s);
// 1. println con concatenación en lugar de printf con formato.
assert.ok(!validate(1, w('String p=in.nextLine(); int u=in.nextInt(); double pr=in.nextDouble(); System.out.println(p + " " + u + " " + pr + " " + u*pr);')).complete);
// 2. Redondeo a dos decimales con división entera (entre 100, sin decimal).
assert.ok(!validate(2, w('double x=in.nextDouble(); System.out.println(Math.floor(x)); System.out.println(Math.ceil(x)); System.out.println(Math.round(x)); System.out.println(Math.round(x*100)/100);')).complete);
// 3. Potencia con un bucle de multiplicaciones en vez de Math.pow, y sin printf.
assert.ok(!validate(3, w('double c=in.nextDouble(), t=in.nextDouble(); int n=in.nextInt(); double f=c; for(int i=0;i<n;i++){f=f*(1+t/100);} System.out.println(f); System.out.println(f-c);')).complete);
// 4. Una única solución (solo suma de la raíz) y sin formato.
assert.ok(!validate(4, w('double a=in.nextDouble(), b=in.nextDouble(), c=in.nextDouble(); double d=b*b-4*a*c; double x=(-b+Math.sqrt(d))/(2*a); System.out.println(x);')).complete);
// 5. Math.cbrt solo en un comentario.
assert.ok(!validate(5, w('// double lado = Math.cbrt(l);\n double l=in.nextDouble(); double lado=l/3; System.out.printf("%.2f%n", 6*lado*lado*Math.sqrt(3)/10);')).complete);
// 6. printf sin decimales fijos.
assert.ok(!validate(3, w('double c=in.nextDouble(), t=in.nextDouble(); int n=in.nextInt(); double f=c*Math.pow(1+t/100,n); System.out.printf("%s %s%n", f, f-c);')).complete);
console.log('✓ Ampliación 2.1: 5 soluciones (+3 variantes) compiladas y ejecutadas con javac, 5 plantillas incompletas y 6 casos negativos correctos.');
