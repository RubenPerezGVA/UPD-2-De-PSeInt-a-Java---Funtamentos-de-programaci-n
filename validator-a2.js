/* A2.2 · Ampliación (opcional) de la P2.2 · Importes con céntimos. Autovalidación ORIENTATIVA por criterios independientes.
   Reutiliza el analizador de validator.js (debe cargarse antes). No ejecuta ni compila Java. */
(function (root, factory) {
  const base = (typeof module === 'object' && module.exports) ? require('./validator.js') : root.JavaPractice;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JavaPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  const PREFIX = 'A22E';
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
    1:['PISTA 1 · Lee el importe en euros (double).','double importe = teclado.nextDouble();','','PISTA 2 · Céntimos TRUNCANDO: el casting (int) descarta los decimales:','int truncado = (int) (importe * ___);','','PISTA 3 · Céntimos REDONDEANDO: Math.round devuelve un long, así que hace falta casting:','int redondeado = (int) Math.round(importe * ___);','','PISTA 4 · Muestra los dos resultados. Con 19.99 el truncado da 1998 (¡se pierde un céntimo!) y el redondeado 1999.'],
    2:['PISTA 1 · Lee el importe y pásalo a céntimos redondeando:','double importe = teclado.nextDouble();','int centimos = (int) Math.___(importe * 100);','','PISTA 2 · Euros enteros y céntimos que sobran:','int euros = centimos / ___;','int cent = centimos % ___;','','PISTA 3 · Muestra «euros,cc €» con los céntimos siempre en dos cifras (%02d):','System.out.printf("%d,%02d €%n", euros, ___);','','PISTA 4 · Prueba con 7.05 → 7,05 € y con 12.5 → 12,50 €.'],
    3:['PISTA 1 · Constantes con el valor de cada pieza EN CÉNTIMOS:','final int BILLETE_50 = 5000;','final int BILLETE_20 = ___;','// ...BILLETE_10, BILLETE_5, MONEDA_2E, MONEDA_1E, y las de 50, 20, 10, 5, 2 céntimos','','PISTA 2 · Lee el importe y pásalo a céntimos redondeando:','int centimos = (int) Math.round(teclado.nextDouble() * ___);','','PISTA 3 · Para cada pieza, de mayor a menor: cuántas caben y qué queda:','int b50 = centimos / BILLETE_50;','centimos = centimos % BILLETE_50;      // o: centimos -= b50 * BILLETE_50;','int b20 = centimos / ___;','centimos = ___;','...','','PISTA 4 · Lo que quede al final son monedas de 1 céntimo.','PISTA 5 · Muestra cuántas piezas hay de cada tipo. Prueba con 187.65.'],
    4:['PISTA 1 · Lee el precio y lo entregado, y pásalos a céntimos ANTES de restar:','int precio = (int) Math.round(teclado.nextDouble() * ___);','int entregado = (int) Math.round(teclado.nextDouble() * 100);','','PISTA 2 · Cambio en céntimos (enteros: la resta es exacta):','int cambio = ___ - ___;','','PISTA 3 · Piezas de cambio (billetes de 10 y 5 €; monedas de 2 €, 1 €, 50, 20, 10, 5, 2 y 1 céntimos), de mayor a menor:','int b10 = cambio / 1000;','cambio = cambio % ___;','...','','PISTA 4 · Una línea por pieza con formato: cantidad (%2d) y valor en euros con 2 decimales (%6.2f):','System.out.printf("%2d x %6.2f €%n", b10, 1000 / ___);','','PISTA 5 · Prueba con precio 17.85 y entregado 20 → cambio 2,15 €.'],
    5:['PISTA 1 · La comisión va en una constante:','final double COMISION = ___;   // 1,5 %','','PISTA 2 · Lee el importe y pásalo a céntimos redondeando:','int importe = (int) Math.round(teclado.nextDouble() * 100);','','PISTA 3 · Comisión en céntimos, redondeada, y total cargado:','int comision = (int) Math.round(importe * ___);','int total = importe + ___;','','PISTA 4 · Muestra los tres importes en euros con 2 decimales y alineados:','System.out.printf("Importe:  %8.2f €%n", importe / 100.0);','System.out.printf("Comisión: %8.2f €%n", ___ / 100.0);','','PISTA 5 · Prueba con 125.50 → comisión 1,88 € y total 127,38 €.']
  };
  const PF2 = /%[-+0,# ]*\d*\.2f/;
  // Constantes final int/long declaradas (cuenta también las de una declaración múltiple: final int A = 1, B = 2;).
  const finals = a => [...a.s.matchAll(/\bfinal\s+(?:int|long)\s+([^;]+);/g)].reduce((t,m)=>t+(m[1].match(/=/g)||[]).length,0);
  const cast = /\(\s*(?:int|long)\s*\)/;
  const cents = a => hasMath('round')(a)&&/\*\s*100(?:\.0*)?(?![\d.])/.test(a.s);

  const e1 = ex(1,'El céntimo que desaparece','Pide un importe en euros (double) y calcula cuántos céntimos son de dos formas: truncando con (int) (importe * 100) y redondeando con (int) Math.round(importe * 100). Muestra los dos resultados y comprueba con 19.99, 0.29 y 4.35 por qué no se debe truncar. Parte de la plantilla («Recuperar plantilla») si necesitas ayuda.','Los double no representan exactamente los decimales: 19.99 * 100 vale 1998.9999999999998. El casting (int) trunca (1998); Math.round redondea al más cercano (1999) y devuelve un long, que se convierte a int con otro casting.','01 · double a int',[
    structure,reads(1),
    c('truncate','Calcula los céntimos truncando con un casting a int.',a=>cast.test(a.s)&&/\*\s*100(?:\.0*)?(?![\d.])/.test(a.s)),
    c('round','Calcula los céntimos redondeando con Math.round.',cents),
    c('cast','Convierte el resultado de Math.round a int con casting explícito.',a=>/\(\s*int\s*\)\s*Math\s*\.\s*round\s*\(/.test(a.s)||/\bint\s+[A-Za-z_$][\w$]*\s*=\s*\(\s*int\s*\)/.test(a.s)),
    shows('Muestra los céntimos truncados y los redondeados.')
  ],'Ejemplo: 19.99 € → truncado 1998 y redondeado 1999. Con 0.29 → 28 y 29. Con 4.35 → 434 y 435.','Medio');

  const e2 = ex(2,'Euros y céntimos','Pide un importe en euros con céntimos (por ejemplo, 7.05), conviértelo a céntimos enteros redondeando, sepáralo en euros enteros y céntimos sueltos, y muéstralo con el formato «7,05 €»: los céntimos siempre con dos cifras. Parte de la plantilla («Recuperar plantilla») si necesitas ayuda.','Céntimos = (int) Math.round(importe * 100). Euros = céntimos / 100 y céntimos sueltos = céntimos % 100 (con int). El especificador %02d muestra un entero con dos cifras, rellenando con ceros.','01 · double a int',[
    structure,reads(1),
    c('round','Convierte el importe a céntimos redondeando con Math.round.',cents),
    c('cast','Guarda los céntimos en un int mediante casting.',a=>cast.test(a.s)),
    c('split','Separa euros (/ 100) y céntimos (% 100).',a=>a.hasNum(100)&&n(a,'div')>=1&&rests(a)>=1),
    c('two-digits','Muestra los céntimos con dos cifras mediante printf (%02d).',fmt(/%0\d*d/)),
    shows()
  ],'Ejemplo: 7.05 → 7,05 €. 12.5 → 12,50 €. 0.07 → 0,07 €.','Medio');

  const DENOM = [5000,2000,1000,500,200,100,50,20,10,5,2];
  const e3 = ex(3,'Billetes y monedas de un importe','Pide un importe en euros con céntimos (por ejemplo, 187.65) y desglósalo en el menor número posible de piezas: billetes de 50, 20, 10 y 5 €, monedas de 2 € y 1 €, y monedas de 50, 20, 10, 5, 2 y 1 céntimos. Trabaja con céntimos enteros (convierte el importe redondeando) y guarda el valor de cada pieza en una constante final. Parte de la plantilla («Recuperar plantilla») si necesitas ayuda.','Convierte una sola vez: centimos = (int) Math.round(importe * 100). Después, para cada pieza de mayor a menor: cuántas = centimos / VALOR; centimos = centimos % VALOR (o centimos -= cuántas * VALOR). El valor de cada pieza, en céntimos: 5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5, 2 y 1.','02 · Desglose',[
    structure,reads(1),
    c('cents','Convierte el importe a céntimos enteros redondeando (Math.round y casting).',a=>cents(a)&&cast.test(a.s)),
    c('constants','Declara el valor de las piezas como constantes (al menos tres con final int).',a=>finals(a)>=3),
    c('values','Trabaja con todos los valores en céntimos (5000, 2000, 1000, 500, 200, 100, 50, 20, 10, 5 y 2).',allNums(...DENOM)),
    c('divisions','Calcula el número de piezas con división entera (al menos diez divisiones).',a=>n(a,'div')>=10),
    c('rest','Calcula lo que queda por repartir tras cada pieza (con % o restando).',a=>rests(a)>=9),
    shows('Muestra el número de piezas de cada tipo.')
  ],'Ejemplo: 187.65 € → 3 × 50 €, 1 × 20 €, 1 × 10 €, 1 × 5 €, 1 × 2 €, 0 × 1 €, 1 × 50 cént., 0 × 20, 1 × 10, 1 × 5, 0 × 2 y 0 × 1 cént. Comprueba: 150 + 20 + 10 + 5 + 2 + 0,50 + 0,10 + 0,05 = 187,65.','Reto');

  const e4 = ex(4,'El cambio de la compra','Pide el precio de una compra y el dinero que entrega el cliente (los dos con céntimos). Calcula el cambio y desglósalo en billetes de 10 y 5 €, monedas de 2 € y 1 €, y monedas de 50, 20, 10, 5, 2 y 1 céntimos. Muestra una línea por pieza con printf: la cantidad (%2d) y el valor de la pieza en euros con dos decimales (%6.2f). Usa constantes final para los valores y no restes nunca dos double. Parte de la plantilla («Recuperar plantilla») si necesitas ayuda.','Pasa primero cada importe a céntimos enteros con Math.round(importe * 100) y resta ya con enteros: 20.0 - 17.85 en double da 2.1500000000000021. Después desglosa como en el ejercicio anterior. Para mostrar el valor de una pieza: VALOR / 100.0.','02 · Desglose',[
    structure,reads(2),
    c('round-both','Convierte el precio y lo entregado a céntimos con Math.round antes de restar.',a=>count(a,/\bMath\s*\.\s*round\s*\(/g)>=2&&/\*\s*100(?:\.0*)?(?![\d.])/.test(a.s)),
    c('change','Calcula el cambio restando los dos importes en céntimos.',a=>n(a,'sub')>=1&&cast.test(a.s)),
    c('constants','Declara el valor de las piezas como constantes (al menos tres con final int).',a=>finals(a)>=3),
    c('values','Trabaja con los valores en céntimos (1000, 500, 200, 100, 50, 20, 10, 5 y 2).',allNums(1000,500,200,100,50,20,10,5,2)),
    c('breakdown','Desglosa el cambio con divisiones enteras y restos (al menos ocho piezas).',a=>n(a,'div')>=8&&rests(a)>=7),
    c('table','Muestra cada pieza con printf: cantidad entera y valor con dos decimales.',a=>printf(a)&&/%[-+0,# ]*\d*d/.test(nc(a))&&PF2.test(nc(a)))
  ],'Ejemplo: precio 17.85 € y entregado 20 € → cambio 2,15 €: 1 × 2,00 €, 1 × 0,10 € y 1 × 0,05 €; el resto de piezas, 0.','Reto');

  const e5 = ex(5,'Retirada con comisión','Un cajero cobra una comisión del 1,5 % por cada retirada. Pide el importe a retirar (con céntimos), calcula la comisión redondeada al céntimo (Math.round) y el total que se cargará en la cuenta, y muéstralos en tres líneas alineadas con printf: importe, comisión y total, con dos decimales. Guarda el porcentaje en una constante final. Parte de la plantilla («Recuperar plantilla») si necesitas ayuda.','Trabaja en céntimos enteros: importe = (int) Math.round(entrada * 100); comision = (int) Math.round(importe * COMISION); total = importe + comision. Para mostrarlo en euros, divide entre 100.0. Con %8.2f las tres líneas quedan alineadas por la derecha.','03 · Formato de salida',[
    structure,reads(1),
    c('constant','Guarda la comisión en una constante con final.',a=>/\bfinal\s+(?:double|float)\b/.test(a.s)),
    c('rate','Aplica una comisión del 1,5 % (0.015 o 1.5 / 100).',anyNum(0.015,1.5)),
    c('round','Redondea la comisión al céntimo con Math.round.',a=>count(a,/\bMath\s*\.\s*round\s*\(/g)>=2||(hasMath('round')(a)&&cast.test(a.s))),
    c('total','Calcula el total cargado sumando importe y comisión.',a=>n(a,'add')>=1),
    c('format','Muestra los importes con dos decimales y anchura fija (por ejemplo %8.2f).',fmt(/%[-+0,# ]*\d+\.2f/)),
    c('lines','Muestra al menos tres líneas con importe, comisión y total.',a=>count(a,/\b(?:printf|format|println|print)\s*\(/g)>=3||(printf(a)&&/%n|\\n/.test(nc(a))))
  ],'Ejemplo: 125.50 € → comisión 1,88 € y total 127,38 €. Con 200 € → 3,00 € y 203,00 €.','Reto');

  const exercises=[e1,e2,e3,e4,e5];
  function validate(id,code){const exercise=exercises.find(x=>x.id===Number(id));if(!exercise)throw new Error('Ejercicio desconocido');const analyzed=assessCode(code);const results=exercise.criteria.map(test=>({id:test.id,label:test.label,pass:!!test.test(analyzed)}));return {id:exercise.id,results,passed:results.filter(x=>x.pass).length,total:results.length,complete:results.every(x=>x.pass),note:'Análisis estático orientativo: no se ha compilado ni ejecutado el programa.'};}
  return {exercises,validate,assessCode,sanitize,
    config:{storageKey:'falomir_up2_a2_2026_27_v1',activity:'UP2 · A2.2 · Ampliación (opcional) · Importes con céntimos',receiptPrefix:'UP2A2',filePrefix:'up2_ampliacion2'}};
});
