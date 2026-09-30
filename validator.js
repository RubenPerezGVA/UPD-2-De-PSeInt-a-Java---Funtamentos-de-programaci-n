/* Autovalidación ORIENTATIVA, basada en criterios independientes. No ejecuta ni compila Java. */
(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JavaPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  /* Pistas en la plantilla: comentarios paso a paso con huecos (___) que el alumno completa. No son la solución. */
  const HINTS = {
    1:['PISTA 1 · Lee el nombre (texto) con nextLine():','String nombre = teclado.nextLine();','','PISTA 2 · Lee la edad (número entero):','int edad = ___;','','PISTA 3 · Muestra el saludo uniendo textos y variables con +:','System.out.println("Hola " + nombre + ___);'],
    2:['PISTA 1 · Lee los dos números:','double a = teclado.nextDouble();','double b = ___;','','PISTA 2 · Súmalos (en una variable o directamente al mostrar):','double suma = ___;','','PISTA 3 · Muestra el resultado.'],
    3:['PISTA 1 · Lee dos números enteros (int).','','PISTA 2 · Calcula las cinco operaciones:','int suma = a + b;','int resta = ___;','int producto = ___;','double division = (double) a / b;   // prueba también a / b con int','int resto = a ___ b;','','PISTA 3 · Muestra los cinco resultados. ¡Que b no sea 0!'],
    4:['PISTA 1 · Lee la base y la altura (double).','','PISTA 2 · Área = base × altura:','double area = ___;','','PISTA 3 · Muestra el área.'],
    5:['PISTA 1 · Lee el radio (double).','','PISTA 2 · Área = π × radio²:','double area = Math.PI * ___;   // radio * radio o Math.pow(radio, 2)','','PISTA 3 · Perímetro = 2 × π × radio:','double perimetro = ___;','','PISTA 4 · Muestra área y perímetro.'],
    6:['PISTA 1 · Lee A y B.','','PISTA 2 · Guarda A en una auxiliar antes de perderlo:','int aux = a;','a = ___;','b = ___;','','PISTA 3 · Muestra los nuevos valores de A y B.'],
    7:['PISTA 1 · Lee unidades y precio de cada refresco:','int unidadesCola = teclado.nextInt();','double precioCola = teclado.nextDouble();','// ...lo mismo para naranja y limón','','PISTA 2 · Importe de cada producto = unidades × precio:','double totalCola = ___;','','PISTA 3 · Total general = suma de los tres importes:','double totalGeneral = ___;','','PISTA 4 · Muestra el informe: cola, naranja, limón y total.'],
    8:['PISTA 1 · Lee el precio (double).','','PISTA 2 · IVA del 21 %:','double iva = precio * ___;','','PISTA 3 · Precio final:','double total = ___;','','PISTA 4 · Muestra el IVA y el total.'],
    9:['PISTA 1 · Lee el precio y el porcentaje de IVA.','','PISTA 2 · Pasa el porcentaje a tanto por uno:','double iva = precio * porcentaje / ___;','','PISTA 3 · Precio final:','double total = ___;','','PISTA 4 · Muestra el impuesto y el total.'],
    10:['PISTA 1 · Guarda el cambio en una constante:','final double PESETAS_POR_EURO = ___;','','PISTA 2 · Lee los euros (double).','','PISTA 3 · Convierte:','double pesetas = ___;','','PISTA 4 · Muestra el resultado.'],
    11:['PISTA 1 · Medidas de las piscinas (en cm):','double largo1 = 300, ancho1 = 150, prof1 = 20;','double largo2 = ___, ancho2 = ___, prof2 = ___;','','PISTA 2 · Áreas y volúmenes de cada piscina:','double area1 = largo1 * ancho1;','double vol1 = area1 * ___;','// ...lo mismo para la piscina 2','','PISTA 3 · Conjunto lado a lado:','double anchoTotal = ___;   // se suman los anchos','double areaTotal = ___;','double volTotal = ___;','','PISTA 4 · Muestra todo lo anterior.','','PISTA 5 · Intercambia las profundidades con una auxiliar,','// recalcula los dos volúmenes y muéstralos de nuevo.']
  };
  const skeleton = (name, id) => {
    const body = (HINTS[id] || ['Escribe aquí las instrucciones de tu programa'])
      .map(l => l === '' ? '' : l.startsWith('// ') ? '        ' + l : '        // ' + l).join('\n');
    return `import java.util.Scanner;\n\npublic class ${name} {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n\n${body}\n    }\n}`;
  };
  const ex = (id, title, desc, hint, groups, criteria, example='', level='Base') => ({id,title,desc,hint,groups,criteria,example,level,template:skeleton('Ejercicio'+id, id)});
  const c = (id, label, test) => ({id,label,test});

  function sanitize(source){
    // Sustituye los literales por espacios y borra comentarios sin perder los saltos de línea.
    const rx = /"(?:\\[\s\S]|[^"\\])*"|'(?:\\[\s\S]|[^'\\])*'|\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
    return String(source || '').replace(rx, m => m.replace(/[^\n]/g,' '));
  }
  function balanced(s,open,close){let n=0;for(const ch of s){if(ch===open)n++;if(ch===close&&--n<0)return false;}return n===0;}
  function assessCode(source){
    const s=sanitize(source), matches=rx=>(s.match(rx)||[]).length;
    const rawOutputs=[...String(source||'').matchAll(/(?:System\s*\.\s*out|IO)\s*\.\s*(?:println|print|printf|format)\s*\(([\s\S]*?)\)\s*;/g)].map(m=>m[1]);
    const outputs=matches(/\b(?:System\s*\.\s*out|IO)\s*\.\s*(?:println|print|printf|format)\s*\(/g);
    const readCalls=matches(/\b(?:next(?:Int|Double|Float|Long|Short|Byte|Line)?|readLine|readln|readInt|readDouble|readFloat|read)\s*\(/g);
    const readTargets=[];
    const ar=/\b([A-Za-z_$][\w$]*)\s*=\s*(?:(?:Integer|Double|Float|Long|Short|Byte)\s*\.\s*parse\w+\s*\(\s*)?(?:(?:[A-Za-z_$][\w$]*\s*\.\s*)?)(?:next(?:Int|Double|Float|Long|Short|Byte|Line)?|readLine|readln)\s*\(/g;
    for(const m of s.matchAll(ar)) readTargets.push(m[1]);
    const assignments=[];
    const assignRx=/\b(?:(?:final\s+)?(?:int|long|short|byte|float|double|String|var)\s+)?([A-Za-z_$][\w$]*)\s*=(?!=)\s*([^;]+);/g;
    for(const m of s.matchAll(assignRx)) assignments.push({name:m[1],value:m[2].trim(),start:m.index,end:m.index+m[0].length});
    const mathAssignments=assignments.filter(a=>/[+*\/%-]/.test(a.value)&&!/^\s*(?:new\s+|["'])/.test(a.value));
    const calc=mathAssignments.map(a=>a.value).join(' ; ');
    const calcAndOutputs=calc+' '+s.slice(0); // Permite también operaciones en System.out.println(...).
    const ops={
      add: /\b(?:\w+|\d+|\))\s*\+\s*(?:\w+|\d+|\()/g,
      sub: /\b(?:\w+|\d+|\))\s*-\s*(?:\w+|\d+|\()/g,
      mul: /\b(?:\w+|\d+|\))\s*\*\s*(?:\w+|\d+|\()/g,
      div: /\b(?:\w+|\d+|\))\s*\/\s*(?:\w+|\d+|\()/g,
      mod: /\b(?:\w+|\d+|\))\s*%\s*(?:\w+|\d+|\()/g
    };
    const opCount=key=>(calcAndOutputs.match(ops[key])||[]).length;
    const numbers=[...s.matchAll(/\b\d+(?:\.\d+)?\b/g)].map(m=>Number(m[0]));
    const hasNum=n=>numbers.some(x=>Math.abs(x-n)<1e-5);
    const printValue=outputs>0 && /\b(?:System\s*\.\s*out|IO)\s*\.\s*(?:print|println|printf|format)\s*\(\s*(?!\s*\))/m.test(s);
    return {source:String(source||''),s,outputs,rawOutputs,readCalls,readTargets,assignments,mathAssignments,calc,opCount,hasNum,numbers,printValue};
  }
  const structure = c('structure','Tiene un método main (clásico con class y static, o compacto de Java 25/26: void main()) y llaves y paréntesis equilibrados.',a=>(/\bstatic\b[\s\S]{0,45}\bvoid\s+main\s*\(/.test(a.s)||/(?:^|[;{}\s])void\s+main\s*\(\s*(?:String\s*(?:\[\s*\]|\.\.\.)\s*[A-Za-z_$][\w$]*\s*)?\)/.test(a.s))&&balanced(a.s,'{','}')&&balanced(a.s,'(',')'));
  const reads = n => c('reads',`Lee ${n===1?'el dato solicitado':`al menos ${n} datos`} desde teclado.`,a=>a.readCalls>=n);
  const shows = n => c('shows',n===1?'Muestra el resultado mediante System.out.':`Incluye la salida de los resultados (orden y formato libres).`,a=>a.outputs>=1);
  const op = (name,label) => c('op-'+name,label,a=>a.opCount(name)>0);
  const outputMultiple = (n) => c('shows',`Muestra los ${n} resultados, en líneas distintas o en una salida compuesta.`,a=>a.outputs>=1);
  const numericMath = c('math','Incluye una operación aritmética con los datos introducidos.',a=>a.mathAssignments.length>0 || /(?:System\s*\.\s*out|IO)\s*\.\s*(?:print|println)\s*\([^;]*\w+\s*[+*\/%-]\s*\w+/m.test(a.s));
  const PI = a=>/\bMath\s*\.\s*PI\b/.test(a.s)||a.numbers.some(x=>x>=3.14&&x<=3.142);
  function swapIndex(a){
    const list=a.assignments;
    for(let i=0;i<list.length;i++) for(let j=i+1;j<list.length;j++)for(let k=j+1;k<list.length;k++){
      const t=list[i],u=list[j],v=list[k];
      if(!/^[A-Za-z_$][\w$]*$/.test(t.value)||!/^[A-Za-z_$][\w$]*$/.test(u.value)||!/^[A-Za-z_$][\w$]*$/.test(v.value)) continue;
      if(t.name!==u.name && t.name!==t.value && u.name===t.value && u.value===v.name && v.value===t.name && new Set([t.name,u.name,v.name]).size===3) return v.end;
    }
    return -1;
  }
  const one = ex(1,'Nombre y edad','Solicita al usuario su nombre y su edad. Muestra: «Hola (nombre), tu edad es (edad)».','Lee una cadena y un entero; después muestra ambos valores. No importa el nombre que des a las variables.','01 · Entrada y salida',[
    structure,reads(2),c('types','Trabaja con texto y edad numérica.',a=>/\bString\b/.test(a.s)&&/\b(?:int|short|long|Integer)\b/.test(a.s)),
    c('greeting','Muestra un saludo que incorpora el nombre y la edad.',a=>a.outputs>=1)
  ],'Ejemplo: nombre = Ana, edad = 18 → Hola Ana, tu edad es 18.');
  const two = ex(2,'Suma de dos números','Solicita dos números y muestra el resultado de sumarlos.','Puedes sumar directamente en println o almacenar primero el resultado en otra variable.','02 · Operaciones',[
    structure,reads(2),op('add','Realiza una suma aritmética.'),shows(1)
  ],'Ejemplo: 5 y 7 → 12.');
  const three = ex(3,'Cinco operaciones','Pide dos números y muestra su suma, resta, multiplicación, división y módulo (resto).','Comprueba con valores que no provoquen una división entre cero. Es válido mostrar los resultados con varios println o con una salida compuesta.','02 · Operaciones',[
    structure,reads(2),op('add','Calcula la suma.'),op('sub','Calcula la resta.'),op('mul','Calcula la multiplicación.'),op('div','Calcula la división.'),op('mod','Calcula el módulo con %.'),
    c('shows','Muestra los cinco resultados.',a=>a.outputs>=1)
  ],'Ejemplo con 10 y 3: suma 13, resta 7, producto 30, división 3 (entera) o 3,333… (real), resto 1.','Medio');
  const four = ex(4,'Área de un rectángulo','Lee la base y la altura de un rectángulo y calcula y muestra su área.','Fórmula: área = base × altura. Puedes utilizar int, float o double.','03 · Geometría',[
    structure,reads(2),op('mul','Multiplica la base por la altura.'),shows(1)
  ],'Ejemplo: base 8, altura 3 → área 24.');
  const five = ex(5,'Área y perímetro de un círculo','Lee el radio de una circunferencia y calcula el área del círculo y su perímetro (longitud de la circunferencia).','Área = π × radio². Perímetro = 2 × π × radio. Usa Math.PI y Math.pow(radio, 2) o radio * radio.','03 · Geometría',[
    structure,reads(1),c('pi','Utiliza π, preferentemente Math.PI.',PI),
    c('area','Calcula el área multiplicando por el radio al cuadrado.',a=>PI(a)&&(a.opCount('mul')>=2||/\bMath\s*\.\s*pow\s*\([^,]+,\s*2\s*\)/.test(a.s))),
    c('perimeter','Calcula el perímetro usando el factor 2.',a=>PI(a)&&a.hasNum(2)&&a.opCount('mul')>=2),
    c('shows','Muestra área y perímetro.',a=>a.outputs>=1)
  ],'Ejemplo: radio 2 → área ≈ 12,57; perímetro ≈ 12,57.','Medio');
  const six = ex(6,'Intercambio de A y B','Solicita dos valores, A y B, e intercambia sus contenidos. Muestra sus nuevos valores.','Una opción es utilizar una variable auxiliar; puedes llamarla como quieras. Debe producirse un intercambio real, no únicamente cambiar las etiquetas de salida.','04 · Variables',[
    structure,reads(2),c('swap','Intercambia las dos variables usando asignaciones y una auxiliar.',a=>swapIndex(a)>=0),
    c('shows','Muestra ambos valores después del intercambio.',a=>a.outputs>=1)
  ],'Ejemplo: A = 8, B = 3 → A = 3, B = 8.','Medio');
  const seven = ex(7,'Informe de ventas de refrescos','Una compañía vende refrescos de cola, naranja y limón. Lee unidades vendidas y precio unitario de cada producto; calcula los importes de los tres productos y las ventas totales. Muestra un informe con producto, ventas, precio, total y suma general.','Importe de cada producto = unidades × precio. El total general es la suma de los tres importes. La presentación de la tabla es libre.','05 · Aplicaciones',[
    structure,reads(6),c('products','Calcula los importes de los tres productos.',a=>a.opCount('mul')>=3),
    c('total','Suma los importes para calcular el total general.',a=>a.opCount('add')>=2),
    c('report','Muestra los tres productos y el total.',a=>a.outputs>=1),
    c('labels','Identifica cola, naranja y limón en el informe.',a=>/cola/i.test(a.source)&&/naranja/i.test(a.source)&&/lim[oó]n/i.test(a.source))
  ],'Con las cantidades y los precios de la tabla del PDF: cola 100 000 × 0,17 = 17 000; naranja 350 000 × 0,20 = 70 000; limón 530 000 × 0,19 = 100 700; total calculado = 187 700. Nota: el importe de cola y el total impresos en la tabla original no coinciden con estas operaciones.','Reto');
  const eight = ex(8,'IVA del 21 %','Solicita el precio de un producto y calcula el importe del IVA (21 %) y el precio final con IVA. Muestra ambas cantidades.','Puedes calcular IVA = precio × 0.21 y total = precio + IVA. También puedes calcular el precio final como precio × 1.21.','05 · Aplicaciones',[
    structure,reads(1),c('rate','Aplica un IVA del 21 %.',a=>a.hasNum(21)||a.hasNum(.21)||a.hasNum(1.21)),
    c('vat','Calcula el importe del IVA, no solamente el precio final.',a=>a.opCount('mul')>=1&&(a.hasNum(.21)||a.hasNum(21)||(/1\.21/.test(a.s)&&a.opCount('sub')>=1))),
    c('total','Calcula el precio final con IVA.',a=>a.opCount('add')>0||a.hasNum(1.21)),
    c('shows','Muestra el IVA y el total a pagar.',a=>a.outputs>=1)
  ],'Ejemplo: precio 100 € → IVA 21 € y total 121 €.','Medio');
  const nine = ex(9,'IVA variable','Modifica el ejercicio anterior: solicita el precio y el porcentaje de IVA. Calcula el importe del impuesto y el precio total utilizando el porcentaje introducido.','El porcentaje no debe estar fijado a 21 %. Si te introducen 10, la tasa decimal será 10 / 100.','05 · Aplicaciones',[
    structure,reads(2),c('variable-rate','El porcentaje leído interviene en el cálculo.',a=>a.readTargets.some(v=>new RegExp('\\b'+v+'\\s*(?:/\\s*100|\\*\\s*0\\.01)|(?:/\\s*100|\\*\\s*0\\.01)\\s*\\b'+v+'\\b').test(a.s))||(/\/\s*100|\*\s*0\.01/.test(a.s)&&a.readCalls>=2)),
    c('vat','Calcula el importe del impuesto.',a=>a.opCount('mul')>0&&(/\/\s*100|\*\s*0\.01/.test(a.s))),
    c('total','Calcula el precio final con el impuesto.',a=>a.opCount('add')>0),
    c('shows','Muestra el importe del IVA y el precio final.',a=>a.outputs>=1)
  ],'Ejemplo: precio 100 €, IVA 10 % → impuesto 10 € y total 110 €.','Medio');
  const ten = ex(10,'Euros a pesetas','Solicita una cantidad en euros y calcula su equivalencia en las antiguas pesetas.','Tipo de conversión fijo: 1 euro = 166,386 pesetas.','05 · Aplicaciones',[
    structure,reads(1),c('rate','Utiliza el factor de conversión 166,386 pesetas por euro.',a=>a.hasNum(166.386)||a.numbers.some(n=>Math.abs(n-0.006010121)<0.00000002)),
    c('convert','Realiza la conversión mediante una multiplicación o división.',a=>a.opCount('mul')>0||a.opCount('div')>0),shows(1)
  ],'Ejemplo: 2 € → 332,772 pesetas.');
  const eleven = ex(11,'Ampliación · Las dos piscinas','Piscina 1: largo 300, ancho 150, profundidad 20. Piscina 2: largo 300, ancho 80, profundidad 35. Calcula el área y volumen de cada piscina; el largo y ancho del conjunto lado a lado; el área y el volumen conjuntos. Después intercambia las profundidades de las dos piscinas, recalcula y muestra los nuevos volúmenes. Utiliza una unidad coherente en todos los cálculos.','Área = largo × ancho; volumen = área × profundidad. El ancho conjunto es 150 + 80 y el largo conjunto es 300. Para intercambiar profundidades, puedes usar una variable temporal.','06 · Ampliación',[
    structure,c('measures','Incluye las medidas de ambas piscinas (o las solicita al usuario).',a=>[300,150,20,80,35].every(a.hasNum)||a.readCalls>=6),
    c('areas','Calcula las áreas de las dos piscinas.',a=>a.opCount('mul')>=2),
    c('volumes','Calcula los volúmenes de las dos piscinas.',a=>a.opCount('mul')>=4),
    c('width','Calcula el ancho conjunto sumando los anchos.',a=>a.opCount('add')>=1),
    c('joint-area','Calcula el área del conjunto de las dos piscinas.',a=>a.opCount('mul')>=5),
    c('joint-volume','Calcula el volumen total del conjunto.',a=>a.opCount('add')>=2),
    c('swap','Intercambia efectivamente las profundidades.',a=>swapIndex(a)>=0),
    c('recalc','Después del intercambio, vuelve a calcular y mostrar los dos volúmenes.',a=>{const at=swapIndex(a);if(at<0)return false;const tail=a.s.slice(at);return (tail.match(/\*/g)||[]).length>=2&&(tail.match(/(?:System\s*\.\s*out|IO)\s*\.\s*(?:print|println|printf|format)\s*\(/g)||[]).length>=1}),
    c('shows','Muestra las áreas, volúmenes y medidas solicitadas.',a=>a.outputs>=1)
  ],'Resultados con las medidas originales (en cm): áreas 45 000 y 24 000 cm²; volúmenes 900 000 y 840 000 cm³; ancho conjunto 230 cm, largo 300 cm, área conjunta 69 000 cm², volumen total 1 740 000 cm³. Tras intercambiar las profundidades: 1 575 000 y 480 000 cm³.','Reto');
  const exercises=[one,two,three,four,five,six,seven,eight,nine,ten,eleven];
  function validate(id,code){const exercise=exercises.find(x=>x.id===Number(id));if(!exercise)throw new Error('Ejercicio desconocido');const analyzed=assessCode(code);const results=exercise.criteria.map(test=>({id:test.id,label:test.label,pass:!!test.test(analyzed)}));return {id:exercise.id,results,passed:results.filter(x=>x.pass).length,total:results.length,complete:results.every(x=>x.pass),note:'Análisis estático orientativo: no se ha compilado ni ejecutado el programa.'};}
  return {exercises,validate,assessCode,swapIndex,sanitize};
});
