/* A2.1 · Ampliación (opcional) de la P2.1 · printf y Math. Autovalidación ORIENTATIVA por criterios independientes.
   Reutiliza el analizador de validator.js (debe cargarse antes). No ejecuta ni compila Java. */
(function (root, factory) {
  const base = (typeof module === 'object' && module.exports) ? require('./validator.js') : root.JavaPractice;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JavaPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  const PREFIX = 'A21E';
  const {assessCode, sanitize} = base;
  const skeleton = (name, id) => {
    const body = (HINTS[id] || ['Escribe aquí las instrucciones de tu programa'])
      .map(l => l === '' ? '' : l.startsWith('// ') ? '        ' + l : '        // ' + l).join('\n');
    return `import java.util.Scanner;\n\npublic class ${name} {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n\n${body}\n    }\n}`;
  };
  const ex = (id, title, desc, hint, groups, criteria, example='', level='Base') => ({id,title,desc,hint,groups,criteria,example,level,template:skeleton(PREFIX+String(id).padStart(2,'0'), id)});
  const c = (id, label, test) => ({id,label,test});
  function balanced(s,open,close){let n=0;for(const ch of s){if(ch===open)n++;if(ch===close&&--n<0)return false;}return n===0;}
  /* Código sin comentarios pero con los literales (para comprobar cadenas de formato de printf). */
  function stripComments(src){
    const s=String(src||'');let out='',i=0;
    while(i<s.length){
      const ch=s[i],nx=s[i+1];
      if(ch==='"'||ch==="'"){let j=i+1;while(j<s.length&&s[j]!==ch&&s[j]!=='\n'){if(s[j]==='\\')j++;j++;}out+=s.slice(i,j+1);i=j+1;continue;}
      if(ch==='/'&&nx==='/'){while(i<s.length&&s[i]!=='\n')i++;continue;}
      if(ch==='/'&&nx==='*'){const e=s.indexOf('*/',i+2);i=e<0?s.length:e+2;continue;}
      out+=ch;i++;
    }
    return out;
  }
  const nc = a => stripComments(a.source);
  /* Operadores binarios contados sobre el código sin comentarios ni literales. */
  const OPS = {
    add:/[\w)\]]\s*\+=?(?!\+)\s*(?=[\w(])/g,
    sub:/[\w)\]]\s*-=?(?![-=>])\s*(?=[\w(])/g,
    mul:/[\w)\]]\s*\*=?\s*(?=[\w(])/g,
    div:/[\w)\]]\s*\/=?\s*(?=[\w(])/g,
    mod:/[\w)\]]\s*%=?\s*(?=[\w(])/g
  };
  const n = (a,key) => (a.s.match(OPS[key])||[]).length;
  const count = (a,rx) => (a.s.match(rx)||[]).length;
  // Lo que queda por repartir: con % o restando lo ya repartido (total - horas * 3600, q -= b50 * 50…).
  const rests = a => n(a,'mod') + count(a,/-=?\s*\(?\s*[\w$.]+\s*\*\s*[\w$.]+/g);
  const anyNum = (...ns) => a => ns.some(x=>a.hasNum(x));
  const allNums = (...ns) => a => ns.every(x=>a.hasNum(x));
  const hasMath = fn => a => new RegExp('\\bMath\\s*\\.\\s*'+fn+'\\s*\\(').test(a.s);
  const printf = a => /\b(?:printf|format|formatted)\s*\(/.test(a.s);
  const fmt = rx => a => printf(a) && rx.test(nc(a));
  const stringShown = a => [...a.s.matchAll(/\bString\s+([A-Za-z_$][\w$]*)/g)].some(m=>a.rawOutputs.some(o=>new RegExp('\\b'+m[1]+'\\b').test(o)));

  const structure = c('structure','Tiene un método main (cualquier forma: clásica, String args[], String..., sin public o compacta de Java 25/26).',a=>/\bmain\s*\(/i.test(a.s));
  const reads = k => c('reads',`Lee ${k===1?'el dato solicitado':`al menos ${k} datos`} desde teclado.`,a=>a.readCalls>=k);
  // Salida libre: basta con mostrar los resultados, en el orden y formato que se quiera.
  const shows = label => c('shows',label||'Muestra los resultados pedidos (orden y formato libres).',a=>a.outputs>=1);

  /* Pistas en la plantilla: comentarios paso a paso con huecos (___) que el alumno completa. No son la solución. */
  const HINTS = {
    1:['PISTA 1 · Primero el texto, después los números:','String producto = teclado.nextLine();','int unidades = teclado.nextInt();','double precio = ___;','','PISTA 2 · Importe de la línea:','double total = unidades * ___;','','PISTA 3 · Formato: %-12s texto a la izquierda en 12 huecos, %4d entero en 4, %8.2f real con 2 decimales en 8, %n salto de línea:','System.out.printf("%-12s %4d x %8.2f = %8.2f%n", producto, unidades, ___, ___);'],
    2:['PISTA 1 · Lee un número real positivo:','double x = teclado.nextDouble();','','PISTA 2 · Los tres redondeos de Math:','double abajo = Math.floor(x);   // hacia abajo','double arriba = Math.___(x);    // hacia arriba','long cercano = Math.___(x);     // al más cercano','','PISTA 3 · Redondear a 2 decimales: multiplica por 100, redondea y divide entre 100.0 (con decimal, para que la división sea real):','double dosDec = Math.round(x * ___) / ___;','','PISTA 4 · Muestra los cuatro valores. Con 7.456 → 7, 8, 7 y 7.46.'],
    3:['PISTA 1 · Lee el capital, el interés anual (en %) y los años.','','PISTA 2 · Capital final = capital · (1 + interés / 100) elevado a los años:','double factor = 1 + interes / ___;','double finalCapital = capital * Math.pow(___, anios);','','PISTA 3 · Intereses ganados:','double intereses = ___ - capital;','','PISTA 4 · Muestra capital final e intereses con 2 decimales:','System.out.printf("Capital final: %.2f €%n", finalCapital);'],
    4:['PISTA 1 · Lee los coeficientes a, b y c (double).','','PISTA 2 · Discriminante b² − 4ac:','double disc = b * b - 4 * ___ * ___;','','PISTA 3 · Raíz del discriminante (guárdala para usarla dos veces):','double raiz = Math.___(disc);','','PISTA 4 · Las dos soluciones, una con + y otra con −:','double x1 = (-b + raiz) / (2 * ___);','double x2 = (-b - raiz) / (2 * a);','','PISTA 5 · Muestra x1 y x2 con 3 decimales: %.3f. Prueba con 1, -3, 2 → 2 y 1.'],
    5:['PISTA 1 · Lee el volumen en litros (1 L = 1 dm³).','','PISTA 2 · El lado del cubo es la raíz cúbica del volumen:','double lado = Math.___(litros);   // en dm','','PISTA 3 · Superficie de las 6 caras y diagonal del cubo (lado · √3):','double superficie = 6 * Math.pow(lado, ___);','double diagonal = lado * Math.sqrt(___);','','PISTA 4 · Pasa el lado a metros (1 m = 10 dm) y muestra todo con printf y 2 decimales.']
  };
  const PF2 = /%[-+0,# ]*\d*\.2f/, PFD = /%[-+0,# ]*\d*\.\d+f/;

  const e1 = ex(1,'Ticket con formato','Pide el nombre de un producto, las unidades compradas y el precio unitario. Muestra una línea de ticket con printf en la que el nombre ocupe 12 posiciones alineado a la izquierda, las unidades 4 posiciones, y el precio y el total 8 posiciones con dos decimales. Por ejemplo: «Cuaderno        3 x     2.45 =     7.35».','Los especificadores de printf son %s (texto), %d (entero) y %f (real); con %-12s alineas a la izquierda en 12 huecos, con %8.2f usas 8 huecos y 2 decimales, y %n es el salto de línea. Lee el nombre con nextLine() antes que los números.','01 · Salida con formato',[
    structure,reads(3),
    c('printf','Muestra el ticket con System.out.printf (o String.format).',printf),
    c('decimals','Muestra los importes con dos decimales (%.2f).',fmt(PF2)),
    c('width','Fija anchuras de columna en el formato (por ejemplo %-12s, %4d o %8.2f).',fmt(/%-?\d+(?:\.\d+)?[sdf]/)),
    c('newline','Termina la línea con un salto de línea (%n, \\n o println).',a=>printf(a)&&(/\bprintln\s*\(/.test(a.s)||/%n|\\n/.test(nc(a)))),
    c('total','Calcula el total multiplicando las unidades por el precio.',a=>n(a,'mul')>=1)
  ],'Ejemplo: Cuaderno, 3 unidades a 2,45 € → «Cuaderno        3 x     2.45 =     7.35».');

  const e2 = ex(2,'Los redondeos de Math','Pide un número real positivo y muestra su valor redondeado hacia abajo (Math.floor), hacia arriba (Math.ceil), al entero más cercano (Math.round) y a dos decimales. Para redondear a dos decimales: multiplica por 100, redondea con Math.round y divide entre 100.0.','Math.floor, Math.ceil y Math.round devuelven el valor entero (floor y ceil lo dan como double, round como long). Si divides entre 100 en lugar de 100.0, la división será entera y perderás los decimales.','02 · La clase Math',[
    structure,reads(1),
    c('floor','Redondea hacia abajo con Math.floor.',hasMath('floor')),
    c('ceil','Redondea hacia arriba con Math.ceil.',hasMath('ceil')),
    c('round','Redondea al entero más cercano con Math.round.',hasMath('round')),
    c('two-decimals','Redondea a dos decimales: multiplica por 100, redondea y divide entre 100.0.',a=>(hasMath('round')(a)||hasMath('rint')(a))&&/\*\s*100(?:\.0*)?(?![\d.])/.test(a.s)&&/\/\s*100\s*(?:\.\d*|[dD])(?![\w])|\(\s*double\s*\)\s*Math\s*\.\s*round/.test(a.s)),
    shows('Muestra los cuatro redondeos.')
  ],'Ejemplo: 7,456 → floor 7; ceil 8; round 7; a dos decimales 7,46. Con 2,5 → round 3.','Medio');

  const e3 = ex(3,'Interés compuesto','Pide un capital en euros, el interés anual en porcentaje y el número de años. Calcula el capital final con la fórmula capital · (1 + interés/100)^años, y los intereses ganados. Muestra ambos importes con dos decimales.','Math.pow(base, exponente) calcula la potencia. El interés está en porcentaje: divídelo entre 100 antes de sumarle 1. Intereses = capital final − capital inicial.','03 · Potencias',[
    structure,reads(3),
    c('pow','Eleva el factor de crecimiento a los años con Math.pow.',hasMath('pow')),
    c('rate','Convierte el porcentaje a tanto por uno (dividiendo entre 100).',a=>/\/\s*100(?![\d])/.test(a.s)||/\*\s*0\.01/.test(a.s)),
    c('interest','Calcula los intereses restando el capital inicial del final.',a=>n(a,'sub')>=1),
    c('format','Muestra los importes con dos decimales mediante printf.',fmt(PF2))
  ],'Ejemplo: 1000 €, 3 % durante 5 años → capital final 1159,27 €; intereses 159,27 €.','Medio');

  const e4 = ex(4,'Ecuación de segundo grado','Pide los coeficientes a, b y c de una ecuación ax² + bx + c = 0 y calcula sus dos soluciones x = (−b ± √(b² − 4ac)) / 2a. Supón que a no es 0 y que el discriminante no es negativo (todavía no tenemos if). Muestra las soluciones con tres decimales.','Calcula primero el discriminante y guarda la raíz con Math.sqrt en una variable para usarla dos veces: una con + y otra con −. Cuidado con los paréntesis: el denominador es (2 * a).','04 · Raíces',[
    structure,reads(3),
    c('discriminant','Calcula el discriminante b² − 4ac.',a=>a.hasNum(4)&&n(a,'sub')>=1&&(/\bMath\s*\.\s*pow\s*\([^;]*,\s*2(?:\.0)?\s*\)/.test(a.s)||n(a,'mul')>=3)),
    c('sqrt','Calcula la raíz cuadrada con Math.sqrt.',hasMath('sqrt')),
    c('two-roots','Obtiene las dos soluciones (una sumando y otra restando la raíz).',a=>a.hasNum(2)&&n(a,'div')>=2&&n(a,'add')>=1&&n(a,'sub')>=2),
    c('format','Muestra las soluciones con decimales fijos mediante printf (%.3f).',fmt(PFD))
  ],'Ejemplo: a = 1, b = −3, c = 2 → x1 = 2,000 y x2 = 1,000. Con 1, 2, −8 → 2,000 y −4,000.','Reto');

  const e5 = ex(5,'Del volumen al lado del cubo','Un depósito con forma de cubo tiene una capacidad en litros (recuerda que 1 litro = 1 dm³). Pide la capacidad y calcula la longitud de su lado en decímetros y en metros, la superficie total de sus seis caras (en dm²) y la longitud de la diagonal del cubo (lado · √3). Muestra todo con dos decimales.','El lado es la raíz cúbica del volumen: Math.cbrt(litros) (o Math.pow(litros, 1.0 / 3)). La superficie es 6 · lado². La diagonal es lado · Math.sqrt(3). Pasa de dm a m dividiendo entre 10.','04 · Raíces',[
    structure,reads(1),
    c('cbrt','Calcula la raíz cúbica del volumen (Math.cbrt, o Math.pow con 1.0 / 3).',a=>hasMath('cbrt')(a)||/\bMath\s*\.\s*pow\s*\([^;]*,\s*\(?\s*1(?:\.0*)?\s*\/\s*3(?:\.0*)?\s*\)?\s*\)/.test(a.s)),
    c('surface','Calcula la superficie de las seis caras (6 · lado²).',a=>a.hasNum(6)&&(/\bMath\s*\.\s*pow\s*\([^;]*,\s*2(?:\.0)?\s*\)/.test(a.s)||n(a,'mul')>=2)),
    c('diagonal','Calcula la diagonal con lado · Math.sqrt(3).',a=>hasMath('sqrt')(a)&&a.hasNum(3)),
    c('meters','Convierte el lado de decímetros a metros dividiendo entre 10.',a=>a.hasNum(10)&&n(a,'div')>=1),
    c('format','Muestra los resultados con dos decimales mediante printf.',fmt(PF2))
  ],'Ejemplo: 1000 L → lado 10,00 dm = 1,00 m; superficie 600,00 dm²; diagonal 17,32 dm.','Reto');

  const exercises=[e1,e2,e3,e4,e5];
  function validate(id,code){const exercise=exercises.find(x=>x.id===Number(id));if(!exercise)throw new Error('Ejercicio desconocido');const analyzed=assessCode(code);const results=exercise.criteria.map(test=>({id:test.id,label:test.label,pass:!!test.test(analyzed)}));return {id:exercise.id,results,passed:results.filter(x=>x.pass).length,total:results.length,complete:results.every(x=>x.pass),note:'Análisis estático orientativo: no se ha compilado ni ejecutado el programa.'};}
  return {exercises,validate,assessCode,sanitize,
    config:{storageKey:'falomir_up2_a1_2026_27_v1',activity:'UP2 · A2.1 · Ampliación (opcional) · printf y Math',receiptPrefix:'UP2A1',filePrefix:'up2_ampliacion1'}};
});
