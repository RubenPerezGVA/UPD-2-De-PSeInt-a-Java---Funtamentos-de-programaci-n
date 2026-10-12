const assert = require('node:assert/strict');
const {validate, exercises} = require('../validator-r2.js');
const {wrap, build} = require('./_javac.js');

// Una solución correcta y realista por ejercicio. Se compilan con javac y se ejecutan con datos de entrada.
const sols = [
 {id:1, cls:'Vacaciones', input:'45\n', expect:['6 semanas', '3 dias'], src:wrap('Vacaciones', `
        int dias = in.nextInt();
        int semanas = dias / 7;
        int sueltos = dias % 7;
        System.out.println(semanas + " semanas y " + sueltos + " dias");`)},
 {id:2, cls:'TiempoCompleto', input:'100000\n', expect:['1 d 3 h 46 min 40 s'], src:wrap('TiempoCompleto', `
        long total = in.nextLong();
        long d = total / 86400;
        long resto = total % 86400;
        long h = resto / 3600;
        resto = resto % 3600;
        long m = resto / 60;
        long s = resto % 60;
        System.out.println(d + " d " + h + " h " + m + " min " + s + " s");`)},
 {id:3, cls:'CambioMonedas', input:'93\n', expect:['50:1', '20:2', '10:0', '5:0', '2:1', '1:1'], src:wrap('CambioMonedas', `
        int cambio = in.nextInt();
        int m50 = cambio / 50;
        cambio = cambio % 50;
        int m20 = cambio / 20;
        cambio = cambio % 20;
        int m10 = cambio / 10;
        cambio = cambio % 10;
        int m5 = cambio / 5;
        cambio = cambio % 5;
        int m2 = cambio / 2;
        int m1 = cambio % 2;
        System.out.println("50:" + m50 + " 20:" + m20 + " 10:" + m10 + " 5:" + m5 + " 2:" + m2 + " 1:" + m1);`)},
 {id:4, cls:'RelojInstituto', input:'22 45 130\n', expect:['00:55'], src:wrap('RelojInstituto', `
        int hora = in.nextInt();
        int minutos = in.nextInt();
        int paso = in.nextInt();
        int total = hora * 60 + minutos + paso;
        int nuevaHora = total / 60 % 24;
        int nuevosMin = total % 60;
        System.out.printf("%02d:%02d%n", nuevaHora, nuevosMin);`)},
 {id:5, cls:'GranjaHuevos', input:'2000\n', expect:['166 cajas', '8 sueltos', '5 pales', '16 cajas sueltas'], src:wrap('GranjaHuevos', `
        int huevos = in.nextInt();
        int cajas = huevos / 12;
        int sueltos = huevos % 12;
        int pales = cajas / 30;
        int cajasSueltas = cajas % 30;
        System.out.println(cajas + " cajas, " + sueltos + " sueltos, " + pales + " pales, " + cajasSueltas + " cajas sueltas");`)}
];
// Variantes válidas: restando en lugar de %, o yendo de la unidad pequeña a la grande.
const alt = [
 {id:1, cls:'VacacionesResta', input:'45\n', expect:['6 3'], src:wrap('VacacionesResta', `
        int d = in.nextInt(); int s = d / 7; int r = d - s * 7;
        System.out.println(s + " " + r);`)},
 {id:2, cls:'TiempoCadena', input:'100000\n', expect:['1 3 46 40'], src:wrap('TiempoCadena', `
        int t = in.nextInt();
        int seg = t % 60; t /= 60;
        int min = t % 60; t /= 60;
        int hor = t % 24; t /= 24;
        System.out.println(t + " " + hor + " " + min + " " + seg);`)},
 {id:3, cls:'CambioResta', input:'93\n', expect:['1 2 0 0 1 1'], src:wrap('CambioResta', `
        int q = in.nextInt();
        int a = q / 50; q -= a * 50;
        int b = q / 20; q -= b * 20;
        int c = q / 10; q -= c * 10;
        int d = q / 5; q -= d * 5;
        int e = q / 2; q -= e * 2;
        System.out.println(a + " " + b + " " + c + " " + d + " " + e + " " + q);`)},
 {id:4, cls:'RelojResto', input:'9 30 45\n', expect:['10:15'], src:wrap('RelojResto', `
        int h = in.nextInt(), m = in.nextInt(), p = in.nextInt();
        int minutosDia = (h * 60 + m + p) % (24 * 60);
        System.out.println(minutosDia / 60 + ":" + minutosDia % 60);`)}
];
build('refuerzo2', sols.concat(alt));
assert.equal(exercises.length, 5);
for (const s of sols.concat(alt)) { const r = validate(s.id, s.src); assert.ok(r.complete, `R2.2 ejercicio ${s.id} (${s.cls}): faltan ${r.results.filter(x => !x.pass).map(x => x.id).join(', ')}`); }

// Todas las plantillas (con pistas) quedan incompletas.
for (const e of exercises) assert.ok(!validate(e.id, e.template).complete, `La plantilla ${e.id} no debe superar el ejercicio`);

// Casos negativos.
const w = s => wrap('Prueba', s);
// 1. Solo divide: no calcula los días sueltos.
assert.ok(!validate(1, w('int d=in.nextInt(); System.out.println(d/7);')).complete);
// 2. Se queda en horas y minutos (sin días).
assert.ok(!validate(2, w('int t=in.nextInt(); int h=t/3600; int r=t%3600; int m=r/60; int s=r%60; System.out.println(h+" "+m+" "+s);')).complete);
// 3. Solo divisiones sueltas, sin calcular lo que queda por devolver.
assert.ok(!validate(3, w('int q=in.nextInt(); System.out.println(q/50+" "+q/20+" "+q/10+" "+q/5+" "+q/2+" "+q/1);')).complete);
// 4. No da la vuelta a las 24 horas (sin % 24).
assert.ok(!validate(4, w('int h=in.nextInt(), m=in.nextInt(), p=in.nextInt(); int t=h*60+m+p; System.out.println(t/60+":"+t%60);')).complete);
// 5. El código clave está solo en comentarios.
assert.ok(!validate(5, w('// int c=h/12; int s=h%12; int p=c/30; int cs=c%30;\n int h=in.nextInt(); System.out.println(h);')).complete);
// 6. Sin leer el dato (valor fijo).
assert.ok(!validate(1, w('int d=45; System.out.println(d/7+" "+d%7);')).complete);
console.log('✓ Refuerzo 2.2: 5 soluciones (+4 variantes) compiladas y ejecutadas con javac, 5 plantillas incompletas y 6 casos negativos correctos.');
