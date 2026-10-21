/* R2.1 · Refuerzo (opcional) de la P2.1 · Elementos básicos de Java. Autovalidación ORIENTATIVA por criterios independientes.
   Reutiliza el analizador de validator.js (debe cargarse antes). No ejecuta ni compila Java. */
(function (root, factory) {
  const base = (typeof module === 'object' && module.exports) ? require('./validator.js') : root.JavaPractice;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JavaPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  const PREFIX = 'R21E';
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
    1:['PISTA 1 · Lee el nombre completo (con espacios) usando nextLine():','String nombre = teclado.nextLine();','','PISTA 2 · Muestra las tres líneas. Puedes usar tres println o uno solo con \\n:','System.out.println("Buenas tardes.");','System.out.println("Sr/a. " + ___ + ".");','System.out.println(___);'],
    2:['PISTA 1 · Lee los dos números como float:','float a = teclado.nextFloat();','float b = ___;','','PISTA 2 · Las cinco operaciones (el resto es el operador %):','float suma = a + b;','float resto = a ___ b;','// resta, producto y división de forma parecida','','PISTA 3 · Incremento y decremento unarios:','a++;','___;          // decrementa b','','PISTA 4 · Muestra los resultados y los dos valores finales.'],
    3:['PISTA 1 · El factor de conversión va en una constante:','final double METROS_POR_MILLA = ___;','','PISTA 2 · Lee las millas (double).','','PISTA 3 · Pasa a metros y de metros a kilómetros:','double metros = millas * ___;','double km = metros / ___;','','PISTA 4 · Muestra metros y kilómetros.'],
    4:['PISTA 1 · Lee los dos enteros:','int a = teclado.nextInt();','int b = ___;','','PISTA 2 · Cada comparación da un boolean (true o false):','boolean iguales = a == b;','boolean distintos = a ___ b;','boolean mayor = a > b;','boolean menorIgual = ___;','// ...y las dos que faltan (menor, mayor o igual)','','PISTA 3 · Muestra cada resultado con su etiqueta:','System.out.println("¿Iguales? " + iguales);'],
    5:['PISTA 1 · Lee el radio (double).','','PISTA 2 · Longitud de la circunferencia máxima y área del círculo:','double longitud = 2 * Math.PI * ___;','double area = Math.PI * Math.pow(radio, ___);','','PISTA 3 · Volumen de la esfera. ¡Ojo! 4 / 3 con enteros vale 1:','double volumen = 4.0 / 3 * Math.PI * Math.pow(radio, ___);','','PISTA 4 · Muestra los tres resultados.'],
    6:['PISTA 1 · Primero el texto, después los números (así no queda ningún salto de línea pendiente):','String nombre = teclado.nextLine();','int horas = teclado.nextInt();','double precioHora = ___;','','PISTA 2 · Salario bruto y retención del 15 %:','double bruto = horas * ___;','double retencion = bruto * ___;','','PISTA 3 · Salario neto:','double neto = ___ - ___;','','PISTA 4 · Muestra el nombre y los tres importes.']
  };

  const e1 = ex(1,'Bienvenida en tres líneas','Pide el nombre y los apellidos de una persona y muéstrale esta bienvenida en tres líneas (con el nombre que haya escrito): «Buenas tardes.», «Sr/a. Lucía Gómez Ruiz.» y «Bienvenido/a a 1.º de DAW.». Está basado en el ejercicio Saludo2.java de la teoría.','Lee el nombre completo con nextLine(), no con next(): así se leen también los espacios. Puedes mostrar las tres líneas con tres println o con un solo println y saltos de línea (\\n).','01 · Entrada y salida',[
    structure,
    c('text','Lee el nombre como texto (String) con nextLine() o IO.readln().',a=>/\bString\b/.test(a.s)&&/\b(?:nextLine|readLine|readln)\s*\(/.test(a.s)),
    c('lines','Muestra el mensaje en tres líneas (tres println, o uno solo con \\n o %n).',a=>a.outputs>=3||(a.outputs>=1&&/\\n|%n/.test(nc(a)))),
    c('name','Incluye en el mensaje el nombre que ha escrito la persona (no un nombre fijo).',stringShown)
  ],'Ejemplo: Lucía Gómez Ruiz → Buenas tardes. / Sr/a. Lucía Gómez Ruiz. / Bienvenido/a a 1.º de DAW.');

  const e2 = ex(2,'Operaciones con float','Pide dos números reales de tipo float y muestra su suma, resta, multiplicación, división y resto de la división. Después incrementa en una unidad el primero con ++, decrementa el segundo con -- y muestra los dos valores resultantes. Está basado en Opera2.java de la teoría.','Declara los dos números como float y léelos con nextFloat(). El resto de la división es el operador %. Los operadores unarios ++ y -- suman o restan 1 a la propia variable.','02 · Operadores',[
    structure,reads(2),
    c('float','Trabaja con el tipo float (y nextFloat() para leerlos).',a=>/\bfloat\b/.test(a.s)),
    c('add','Calcula la suma.',a=>n(a,'add')>=1),
    c('sub','Calcula la resta.',a=>n(a,'sub')>=1),
    c('mul','Calcula la multiplicación.',a=>n(a,'mul')>=1),
    c('div','Calcula la división.',a=>n(a,'div')>=1),
    c('mod','Calcula el resto de la división con %.',a=>n(a,'mod')>=1),
    c('unary','Usa el incremento (++) y el decremento (--) unarios.',a=>/\+\+/.test(a.s)&&/--/.test(a.s)),
    shows('Muestra los resultados de las operaciones y los valores tras ++ y --.')
  ],'Ejemplo: 7,5 y 2 → suma 9,5; resta 5,5; producto 15,0; división 3,75; resto 1,5. Tras ++ y --: 8,5 y 1,0.');

  const e3 = ex(3,'De millas a metros y kilómetros','Pide una distancia en millas y muéstrala en metros y en kilómetros. Una milla terrestre equivale a 1609,344 metros. Guarda el factor de conversión en una constante (final). Está basado en Millas.java de la teoría.','En Java el separador decimal es el punto: 1609.344. La constante se declara con final double y se escribe en MAYÚSCULAS. Kilómetros = metros / 1000.','03 · Constantes y conversiones',[
    structure,reads(1),
    c('const','Declara el factor de conversión como constante con final.',a=>/\bfinal\s+(?:double|float)\b/.test(a.s)),
    c('factor','Utiliza el factor 1609,344 metros por milla.',a=>a.hasNum(1609.344)),
    c('meters','Convierte las millas a metros multiplicando.',a=>n(a,'mul')>=1),
    c('km','Convierte los metros a kilómetros dividiendo entre 1000.',a=>a.hasNum(1000)&&n(a,'div')>=1),
    shows('Muestra la distancia en metros y en kilómetros.')
  ],'Ejemplo: 3 millas → 4828,032 m → 4,828032 km.');

  const REL=[/==/,/!=/,/>=/,/<=/,/(?<![-=<>!])>(?![=>])/,/(?<![<])<(?![=<])/];
  const e4 = ex(4,'Comparaciones','Pide dos números enteros y comprueba la relación entre ellos. Guarda cada resultado en una variable boolean y muéstralo con una etiqueta: ¿son iguales?, ¿son distintos?, ¿el primero es mayor?, ¿el primero es menor?, ¿el primero es mayor o igual? y ¿el primero es menor o igual? Está basado en Relacional.java de la teoría.','Los operadores relacionales son ==, !=, >, <, >= y <=. Cada comparación devuelve true o false, que se puede guardar en una variable boolean (boolean iguales = a == b;).','02 · Operadores',[
    structure,reads(2),
    c('relational','Utiliza al menos cinco operadores relacionales distintos (==, !=, >, <, >=, <=).',a=>REL.filter(r=>r.test(a.s)).length>=5),
    c('boolean','Guarda los resultados en variables boolean.',a=>count(a,/\bboolean\b/g)>=3),
    shows('Muestra el resultado (true o false) de cada comparación.')
  ],'Ejemplo: 4 y 9 → iguales false; distintos true; mayor false; menor true; mayor o igual false; menor o igual true.','Medio');

  const e5 = ex(5,'Círculo máximo y volumen de una esfera','Pide el radio de una esfera (en cm) y calcula la longitud de su circunferencia máxima (2·π·r), el área del círculo máximo (π·r²) y el volumen de la esfera (4/3·π·r³). Muestra los tres resultados. Está basado en Circunferencia.java de la teoría.','Usa Math.PI y Math.pow(radio, 3) (o radio * radio * radio). Cuidado: 4 / 3 con enteros vale 1; escribe 4.0 / 3 para que la división sea real.','03 · Constantes y conversiones',[
    structure,reads(1),
    c('pi','Utiliza π mediante Math.PI.',a=>/\bMath\s*\.\s*PI\b/.test(a.s)),
    c('length','Calcula la longitud de la circunferencia (2 · π · radio).',a=>/\bMath\s*\.\s*PI\b/.test(a.s)&&a.hasNum(2)&&n(a,'mul')>=2),
    c('area','Calcula el área elevando el radio al cuadrado (Math.pow o multiplicando).',a=>/\bMath\s*\.\s*PI\b/.test(a.s)&&(/\bMath\s*\.\s*pow\s*\([^;]*,\s*2(?:\.0)?\s*\)/.test(a.s)||n(a,'mul')>=3)),
    c('volume','Calcula el volumen con el radio al cubo y la fracción 4/3.',a=>a.hasNum(4)&&a.hasNum(3)&&(/\bMath\s*\.\s*pow\s*\([^;]*,\s*3(?:\.0)?\s*\)/.test(a.s)||n(a,'mul')>=4)),
    c('real-div','Evita la división entera 4 / 3 (usa 4.0 / 3 o 4 / 3.0).',a=>!/(?<![\d.])4\s*\/\s*3(?![\d.])/.test(a.s)),
    shows('Muestra la longitud, el área y el volumen.')
  ],'Ejemplo: radio 3 → longitud 18,85; área 28,27; volumen 113,10.','Medio');

  const e6 = ex(6,'Nómina del mes','Pide el nombre de un trabajador, las horas trabajadas en el mes (entero) y lo que cobra por hora (real). Calcula el salario bruto, la retención del 15 % y el salario neto, y muestra el nombre y los tres importes. Está basado en el ejemplo «Pagos» de la teoría.','Lee primero el nombre con nextLine() y después los números: si lees un número con nextInt() y luego un texto con nextLine(), queda un salto de línea pendiente. bruto = horas × precio; retención = bruto × 0.15; neto = bruto − retención.','04 · Aplicaciones',[
    structure,reads(3),
    c('types','Trabaja con texto (String), horas enteras (int) y precio real (double).',a=>/\bString\b/.test(a.s)&&/\bint\b/.test(a.s)&&/\bdouble\b/.test(a.s)),
    c('gross','Calcula el salario bruto multiplicando horas por precio.',a=>n(a,'mul')>=1),
    c('withholding','Calcula la retención del 15 %.',anyNum(0.15,15,0.85)),
    c('net','Calcula el salario neto restando la retención del bruto.',a=>n(a,'sub')>=1||a.hasNum(0.85)),
    c('name','Muestra el nombre leído junto con los importes.',a=>a.outputs>=1&&stringShown(a)),
    shows('Muestra el salario bruto, la retención y el neto.')
  ],'Ejemplo: Lucía, 80 h y 12,50 €/h → bruto 1000,00 €; retención 150,00 €; neto 850,00 €.','Medio');

  const exercises=[e1,e2,e3,e4,e5,e6];
  function validate(id,code){const exercise=exercises.find(x=>x.id===Number(id));if(!exercise)throw new Error('Ejercicio desconocido');const analyzed=assessCode(code);const results=exercise.criteria.map(test=>({id:test.id,label:test.label,pass:!!test.test(analyzed)}));return {id:exercise.id,results,passed:results.filter(x=>x.pass).length,total:results.length,complete:results.every(x=>x.pass),note:'Análisis estático orientativo: no se ha compilado ni ejecutado el programa.'};}
  return {exercises,validate,assessCode,sanitize,
    config:{storageKey:'falomir_up2_r1_2026_27_v1',activity:'UP2 · R2.1 · Refuerzo (opcional) · Elementos básicos de Java',receiptPrefix:'UP2R1',filePrefix:'up2_refuerzo1'}};
});
