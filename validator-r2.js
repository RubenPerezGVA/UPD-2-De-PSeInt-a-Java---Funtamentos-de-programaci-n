/* R2.2 · Refuerzo (opcional) de la P2.2 · División entera y resto. Autovalidación ORIENTATIVA por criterios independientes.
   Reutiliza el analizador de validator.js (debe cargarse antes). No ejecuta ni compila Java. */
(function (root, factory) {
  const base = (typeof module === 'object' && module.exports) ? require('./validator.js') : root.JavaPractice;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JavaPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  const PREFIX = 'R22E';
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
    1:['PISTA 1 · Lee los días de vacaciones en un int:','int dias = teclado.nextInt();','','PISTA 2 · Una semana tiene 7 días. Semanas completas con la división entera:','int semanas = dias / ___;','','PISTA 3 · Los días que sobran (elige una opción):','  opción A →  int sueltos = dias % 7;','  opción B →  int sueltos = dias - semanas * ___;','','PISTA 4 · Muestra semanas y días. Prueba con 45 → 6 semanas y 3 días.'],
    2:['PISTA 1 · Lee los segundos totales (int o long).','','PISTA 2 · Días: un día tiene 24 · 3600 = 86400 segundos:','int dias = total / ___;','int resto = total % 86400;','','PISTA 3 · Con lo que sobra, repite la idea con las horas (3600) y los minutos (60):','int horas = resto / ___;','resto = resto % 3600;','int minutos = ___ / 60;','int segundos = resto % ___;','','PISTA 4 · Muestra los cuatro valores. Prueba con 100000 → 1 día, 3 h, 46 min y 40 s.'],
    3:['PISTA 1 · Lee el cambio en céntimos (int).','','PISTA 2 · Monedas de 50 céntimos y lo que queda por repartir:','int m50 = cambio / 50;','cambio = cambio % ___;       // o: cambio = cambio - m50 * 50;','','PISTA 3 · Repite la misma idea con 20, 10, 5 y 2:','int m20 = cambio / ___;','cambio = ___;','...','','PISTA 4 · Lo que quede al final son monedas de 1 céntimo.','PISTA 5 · Muestra cuántas monedas hay de cada tipo. Prueba con 93 → 1 de 50, 2 de 20, 0 de 10, 0 de 5, 1 de 2 y 1 de 1.'],
    4:['PISTA 1 · Lee la hora (0-23), los minutos (0-59) y los minutos que van a pasar.','','PISTA 2 · Pasa todo a minutos desde las 00:00:','int total = hora * ___ + minutos + paso;','','PISTA 3 · Nueva hora: las horas completas, pero vuelve a 0 al llegar a 24:','int nuevaHora = total / 60 % ___;','','PISTA 4 · Nuevos minutos: lo que sobra de las horas completas:','int nuevosMinutos = total % ___;','','PISTA 5 · Muestra la hora con dos cifras: System.out.printf("%02d:%02d%n", nuevaHora, nuevosMinutos);'],
    5:['PISTA 1 · Lee los huevos recogidos (int).','','PISTA 2 · Cajas completas (12 huevos por caja) y huevos sueltos:','int cajas = huevos / ___;','int sueltos = huevos % ___;','','PISTA 3 · Con las cajas, repite la idea: 30 cajas por palé.','int pales = cajas / ___;','int cajasSueltas = cajas % ___;','','PISTA 4 · Muestra los cuatro datos. Prueba con 2000 → 166 cajas, 8 sueltos, 5 palés y 16 cajas sueltas.']
  };

  const e1 = ex(1,'Vacaciones en semanas','Pide un número de días de vacaciones y muéstralo como semanas completas y días sueltos. Por ejemplo, 45 días son 6 semanas y 3 días. Parte de la plantilla («Recuperar plantilla»): trae las pistas paso a paso con huecos ___ para que los completes.','Una semana tiene 7 días. Las semanas completas son la división entera dias / 7 (con int) y los días que sobran, el resto dias % 7. Sin %, también vale restar: dias - semanas * 7.','01 · División entera y resto',[
    structure,reads(1),
    c('int','Trabaja con enteros (int o long) para usar la división entera.',a=>/\b(?:int|long)\b/.test(a.s)),
    c('weeks','Calcula las semanas completas dividiendo entre 7.',a=>a.hasNum(7)&&n(a,'div')>=1),
    c('days','Calcula los días sueltos (con % o restando las semanas por 7).',a=>rests(a)>=1),
    shows('Muestra las semanas y los días sueltos.')
  ],'Ejemplo: 45 días → 6 semanas y 3 días. Prueba también con 7, 6 y 0.');

  const e2 = ex(2,'Días, horas, minutos y segundos','Pide una cantidad de segundos y conviértela a días, horas, minutos y segundos. Es la versión ampliada del ejercicio del tiempo de la práctica. Parte de la plantilla («Recuperar plantilla»): trae las pistas paso a paso con huecos ___.','Un día tiene 86400 segundos, una hora 3600 y un minuto 60. Cada vez que sacas una unidad con /, lo que sobra se obtiene con % (o restando). También puedes ir de pequeño a grande: segundos = total % 60; total = total / 60; minutos = total % 60; ...','02 · Tiempo',[
    structure,reads(1),
    c('int','Trabaja con enteros (int o long) para usar la división entera.',a=>/\b(?:int|long)\b/.test(a.s)),
    c('units','Utiliza las equivalencias del tiempo (86400, 3600 y 60; o bien 60, 60 y 24).',a=>(a.hasNum(86400)&&a.hasNum(3600)&&a.hasNum(60))||(a.hasNum(24)&&a.hasNum(60))),
    c('divisions','Obtiene días, horas y minutos con división entera (al menos tres divisiones).',a=>n(a,'div')>=3),
    c('rests','Obtiene lo que sobra en cada paso (al menos tres veces, con % o restando).',a=>rests(a)>=3),
    shows('Muestra los días, las horas, los minutos y los segundos.')
  ],'Ejemplo: 100000 s → 1 día, 3 h, 46 min y 40 s. Prueba también con 59, 3600 y 86400.');

  const e3 = ex(3,'El cambio de la máquina expendedora','Una máquina expendedora devuelve el cambio solo en monedas de 50, 20, 10, 5, 2 y 1 céntimos. Pide el cambio en céntimos (un número entero) y calcula cuántas monedas de cada tipo devuelve, usando siempre las de mayor valor posible. Parte de la plantilla («Recuperar plantilla»): trae las pistas paso a paso con huecos ___.','Sin if ni bucles: m50 = cambio / 50; cambio = cambio % 50; m20 = cambio / 20; cambio = cambio % 20… Puedes reutilizar la variable. Sin %, también vale restar: cambio = cambio - m50 * 50.','02 · Cajero',[
    structure,reads(1),
    c('values','Trabaja con los valores 50, 20, 10, 5 y 2.',allNums(50,20,10,5,2)),
    c('divisions','Calcula el número de monedas con división entera (cinco divisiones).',a=>n(a,'div')>=5),
    c('rest','Calcula lo que queda por devolver tras cada tipo de moneda (con % o restando).',a=>rests(a)>=4),
    shows('Muestra el número de monedas de cada tipo.')
  ],'Ejemplo: 93 céntimos → 1 × 50, 2 × 20, 0 × 10, 0 × 5, 1 × 2 y 1 × 1. Comprueba: 50 + 40 + 2 + 1 = 93.','Medio');

  const e4 = ex(4,'El reloj del instituto','Pide una hora (de 0 a 23), unos minutos (de 0 a 59) y una cantidad de minutos que van a pasar. Muestra la hora que marcará el reloj (de 0 a 23 horas y de 0 a 59 minutos) pasado ese tiempo. Por ejemplo, a las 22:45 más 130 minutos el reloj marcará las 00:55. Parte de la plantilla («Recuperar plantilla»): trae las pistas paso a paso con huecos ___.','Pasa todo a minutos desde las 00:00 (hora × 60 + minutos + lo que pasa). Las horas completas son total / 60, pero el reloj da la vuelta cada 24: usa % 24. Los minutos son total % 60. Con printf("%02d:%02d%n", ...) se muestran siempre dos cifras.','03 · Tiempo circular',[
    structure,reads(3),
    c('minutes','Pasa la hora a minutos (hora × 60) y suma los minutos.',a=>a.hasNum(60)&&n(a,'mul')>=1&&n(a,'add')>=2),
    c('hours','Calcula la nueva hora dividiendo entre 60 y volviendo a 0 tras las 23 (% 24).',a=>a.hasNum(24)&&n(a,'div')>=1&&n(a,'mod')>=1),
    c('mins','Calcula los nuevos minutos con el resto entre 60.',a=>n(a,'mod')>=2||(n(a,'mod')>=1&&rests(a)>=2)),
    shows('Muestra la nueva hora y los nuevos minutos.')
  ],'Ejemplo: 22:45 y 130 minutos → 00:55. Con 9:30 y 45 → 10:15. Con 23:59 y 1 → 00:00.','Medio');

  const e5 = ex(5,'Huevos, cajas y palés','En una granja se recogen huevos que se empaquetan en cajas de 12, y las cajas se apilan en palés de 30 cajas. Pide cuántos huevos se han recogido y calcula las cajas completas, los huevos sueltos, los palés completos y las cajas sueltas que no llenan un palé. Parte de la plantilla («Recuperar plantilla»): trae las pistas paso a paso con huecos ___.','Dos repartos encadenados: cajas = huevos / 12 y sueltos = huevos % 12; después, con las cajas: pales = cajas / 30 y cajasSueltas = cajas % 30. Usa int.','04 · Repartos encadenados',[
    structure,reads(1),
    c('values','Utiliza los tamaños 12 (huevos por caja) y 30 (cajas por palé).',allNums(12,30)),
    c('divisions','Calcula las cajas y los palés con división entera.',a=>n(a,'div')>=2),
    c('rest','Calcula los huevos sueltos y las cajas sueltas (con % o restando).',a=>rests(a)>=2),
    shows('Muestra cajas, huevos sueltos, palés y cajas sueltas.')
  ],'Ejemplo: 2000 huevos → 166 cajas, 8 huevos sueltos, 5 palés y 16 cajas sueltas.','Medio');

  const exercises=[e1,e2,e3,e4,e5];
  function validate(id,code){const exercise=exercises.find(x=>x.id===Number(id));if(!exercise)throw new Error('Ejercicio desconocido');const analyzed=assessCode(code);const results=exercise.criteria.map(test=>({id:test.id,label:test.label,pass:!!test.test(analyzed)}));return {id:exercise.id,results,passed:results.filter(x=>x.pass).length,total:results.length,complete:results.every(x=>x.pass),note:'Análisis estático orientativo: no se ha compilado ni ejecutado el programa.'};}
  return {exercises,validate,assessCode,sanitize,
    config:{storageKey:'falomir_up2_r2_2026_27_v1',activity:'UP2 · R2.2 · Refuerzo (opcional) · División entera y resto',receiptPrefix:'UP2R2',filePrefix:'up2_refuerzo2'}};
});
