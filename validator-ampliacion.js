/* Ampliación · Sentencias simples. Autovalidación ORIENTATIVA por criterios independientes.
   Reutiliza el analizador de validator.js (debe cargarse antes). No ejecuta ni compila Java. */
(function (root, factory) {
  const base = (typeof module === 'object' && module.exports) ? require('./validator.js') : root.JavaPractice;
  const api = factory(base);
  if (typeof module === 'object' && module.exports) module.exports = api;
  root.JavaPractice = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function (base) {
  'use strict';
  const {assessCode, sanitize, swapIndex} = base;
  const skeleton = (name) => `import java.util.Scanner;\n\npublic class ${name} {\n    public static void main(String[] args) {\n        Scanner teclado = new Scanner(System.in);\n        // Escribe aquí las instrucciones de tu programa\n    }\n}`;
  const ex = (id, title, desc, hint, groups, criteria, example='', level='Base') => ({id,title,desc,hint,groups,criteria,example,level,template:skeleton('Ampliacion'+String(id).padStart(2,'0'))});
  const c = (id, label, test) => ({id,label,test});
  function balanced(s,open,close){let n=0;for(const ch of s){if(ch===open)n++;if(ch===close&&--n<0)return false;}return n===0;}

  const structure = c('structure','Declara una clase con main y mantiene las llaves y paréntesis equilibrados.',a=>/\bclass\s+[A-Za-z_$][\w$]*\b/.test(a.s)&&/\bstatic\b[\s\S]{0,45}\bvoid\s+main\s*\(/.test(a.s)&&balanced(a.s,'{','}')&&balanced(a.s,'(',')'));
  const reads = n => c('reads',`Lee ${n===1?'el dato solicitado':`al menos ${n} datos`} desde teclado.`,a=>a.readCalls>=n);
  // Salida libre: basta con mostrar los resultados, en el orden y formato que se quiera (uno o varios print/println/printf).
  const shows = (n,label) => c('shows',label||'Muestra los resultados pedidos (orden y formato libres).',a=>a.outputs>=1);
  const op = (name,label,min=1) => c('op-'+name,label,a=>a.opCount(name)>=min);
  const anyNum = (...ns) => a => ns.some(n=>a.hasNum(n));

  /* Rotación de tres variables: aux = A; A = B; B = C; C = aux (en cualquier orden de nombres). */
  function rotateIndex(a){
    const L=a.assignments.filter(x=>/^[A-Za-z_$][\w$]*$/.test(x.value));
    for(let i=0;i<L.length;i++)for(let j=i+1;j<L.length;j++)for(let k=j+1;k<L.length;k++)for(let m=k+1;m<L.length;m++){
      const t=L[i],u=L[j],v=L[k],w=L[m];
      if(u.name===t.value&&v.name===u.value&&w.name===v.value&&w.value===t.name&&new Set([t.name,u.name,v.name,w.name]).size===4) return w.end;
    }
    return -1;
  }

  const e1 = ex(1,'Ticket de la cafetería','En la cafetería del instituto un café cuesta 1,30 € y una tostada 2,10 €. Pide cuántos cafés y cuántas tostadas se han tomado en una mesa. Calcula el subtotal, una propina del 10 % y el total a pagar, y muéstralo como un pequeño ticket.','Guarda los precios en constantes (final double PRECIO_CAFE = 1.30;). Subtotal = cafés × precio + tostadas × precio. Propina = subtotal × 0.10.','01 · Del mundo real',[
    structure,reads(2),
    c('prices','Utiliza los precios 1,30 € y 2,10 €, preferentemente como constantes.',a=>a.hasNum(1.3)&&a.hasNum(2.1)),
    op('mul','Multiplica cada cantidad por su precio.',2),
    op('add','Suma los importes para obtener el subtotal y el total.',1),
    c('tip','Calcula una propina del 10 %.',anyNum(0.1,10,1.1)),
    shows(3,'Muestra subtotal, propina y total.')
  ],'Ejemplo: 3 cafés y 2 tostadas → subtotal 8,10 €; propina 0,81 €; total 8,91 €.');

  const e2 = ex(2,'¿Cuánto dura la película?','Pide una duración en segundos (por ejemplo, la de una película o una partida) y muéstrala en horas, minutos y segundos.','Aquí brillan la división entera (/) y el resto (%) con int: horas = total / 3600; lo que sobra = total % 3600…','02 · División entera y resto',[
    structure,reads(1),
    c('int','Trabaja con enteros (int o long) para usar la división entera.',a=>/\b(?:int|long)\b/.test(a.s)),
    c('hours','Calcula las horas usando 3600.',a=>a.hasNum(3600)&&a.opCount('div')>=1),
    c('minutes','Calcula los minutos a partir del resto, usando 60.',a=>a.hasNum(60)&&a.opCount('mod')>=1),
    c('seconds','Obtiene los segundos sobrantes con el operador %.',a=>a.opCount('mod')>=2||(a.opCount('mod')>=1&&a.opCount('sub')>=1)),
    shows(1,'Muestra las horas, minutos y segundos.')
  ],'Ejemplo: 3725 s → 1 h 2 min 5 s. Prueba también con 59, 60 y 7200.','Medio');

  const e3 = ex(3,'El cajero automático','Un cajero entrega billetes de 50, 20, 10 y 5 € y monedas de 2 y 1 €. Pide una cantidad entera de euros y calcula cuántos billetes y monedas de cada tipo entrega, usando siempre los de mayor valor posible.','Sin if ni bucles: billetes50 = cantidad / 50; resto = cantidad % 50; billetes20 = resto / 20; resto = resto % 20… Puedes reutilizar la variable del resto.','02 · División entera y resto',[
    structure,reads(1),
    c('values','Trabaja con los valores 50, 20, 10, 5 y 2.',a=>[50,20,10,5,2].every(a.hasNum)),
    op('div','Calcula el número de piezas con división entera.',4),
    op('mod','Calcula lo que queda por repartir con %.',4),
    shows(6,'Muestra el número de billetes y monedas de cada tipo.')
  ],'Ejemplo: 188 € → 3 × 50, 1 × 20, 1 × 10, 1 × 5, 1 × 2, 1 × 1. Comprueba: 150 + 20 + 10 + 5 + 2 + 1 = 188.','Reto');

  const e4 = ex(4,'Nota final ponderada','Pide la nota de teoría, la de prácticas y la de actitud. La nota final pondera la teoría un 60 %, las prácticas un 30 % y la actitud un 10 %. Muestra la nota final con dos decimales.','nota = teoria * 0.6 + practicas * 0.3 + actitud * 0.1. Para dos decimales: System.out.printf("%.2f%n", nota);','03 · Fórmulas',[
    structure,reads(3),
    c('weights','Aplica los pesos 60 %, 30 % y 10 %.',a=>(a.hasNum(0.6)||a.hasNum(60))&&(a.hasNum(0.3)||a.hasNum(30))&&(a.hasNum(0.1)||a.hasNum(10))),
    op('mul','Multiplica cada nota por su peso.',3),
    op('add','Suma las tres partes.',2),
    shows(1,'Muestra la nota final (printf con dos decimales es opcional).'),
  ],'Ejemplo: teoría 7, prácticas 8, actitud 9 → 4,2 + 2,4 + 0,9 = 7,50.');

  const e5 = ex(5,'Estación meteorológica','Pide una temperatura en grados Celsius y muéstrala convertida a Fahrenheit y a Kelvin.','F = C × 9 / 5 + 32. K = C + 273.15. Cuidado: en Java 9 / 5 con enteros vale 1; usa 9.0 / 5 o 1.8.','03 · Fórmulas',[
    structure,reads(1),
    c('fahrenheit','Convierte a Fahrenheit (× 9/5 o × 1,8, y + 32).',a=>a.hasNum(32)&&(a.hasNum(1.8)||(a.hasNum(9)&&a.hasNum(5)))&&a.opCount('mul')>=1),
    c('int-div','Evita la división entera en 9/5.',a=>!/[=(,+]\s*9\s*\/\s*5(?![\w.])/.test(a.s.replace(/\(\s*(?:double|float)\s*\)\s*9/g,'9.0'))),
    c('kelvin','Convierte a Kelvin sumando 273,15.',a=>a.hasNum(273.15)&&a.opCount('add')>=1),
    shows(2,'Muestra la temperatura en °F y en K.')
  ],'Ejemplo: 25 °C → 77 °F y 298,15 K. −40 °C → −40 °F (¡coinciden!).','Medio');

  const e6 = ex(6,'Las cifras de un número','Pide un número entero de tres cifras. Separa sus cifras (centenas, decenas, unidades), calcula la suma de sus cifras y construye el número al revés.','centenas = n / 100; decenas = n / 10 % 10; unidades = n % 10. El inverso: unidades * 100 + decenas * 10 + centenas.','02 · División entera y resto',[
    structure,reads(1),
    c('digits','Extrae las cifras con / 100, / 10 y % 10.',a=>/\/\s*100\b/.test(a.s)&&/%\s*10\b/.test(a.s)&&/\/\s*10\b/.test(a.s)),
    c('sum','Suma las tres cifras.',a=>a.opCount('add')>=2),
    c('reverse','Construye el número invertido multiplicando por 100 y 10.',a=>/\*\s*100\b|\b100\s*\*/.test(a.s)&&/\*\s*10\b|\b10\s*\*/.test(a.s)),
    shows(2,'Muestra la suma de las cifras y el número invertido.')
  ],'Ejemplo: 472 → cifras 4, 7 y 2; suma 13; al revés 274.','Medio');

  const e7 = ex(7,'Viaje en coche','Tras un viaje, pide los kilómetros recorridos, los litros consumidos y el precio del litro de combustible. Calcula el consumo medio en litros cada 100 km, el coste total del viaje y lo que ha costado cada kilómetro.','consumo = litros / km × 100; coste = litros × precio; costeKm = coste / km. Muestra los resultados con printf y 2 o 3 decimales.','04 · Aplicaciones',[
    structure,reads(3),
    c('consumption','Calcula el consumo cada 100 km.',a=>a.hasNum(100)&&a.opCount('div')>=1),
    op('mul','Calcula el coste total del viaje.',1),
    c('per-km','Calcula el coste por kilómetro con una segunda división.',a=>a.opCount('div')>=2),
    shows(3,'Muestra consumo, coste total y coste por km.')
  ],'Ejemplo: 450 km, 27 L, 1,65 €/L → 6,00 L/100 km; 44,55 €; 0,099 €/km.','Medio');

  const e8 = ex(8,'La carrera popular','Pide la distancia de una carrera en metros y el tiempo del corredor en minutos y segundos. Calcula su velocidad media en m/s y en km/h.','Primero pasa todo a segundos: total = minutos × 60 + segundos. Velocidad = metros / total. Para km/h, multiplica los m/s por 3,6.','04 · Aplicaciones',[
    structure,reads(3),
    c('seconds','Pasa el tiempo a segundos (× 60 + segundos).',a=>a.hasNum(60)&&a.opCount('mul')>=1&&a.opCount('add')>=1),
    op('div','Divide la distancia entre el tiempo.',1),
    c('kmh','Convierte a km/h (× 3,6 o con 1000 y 3600).',a=>a.hasNum(3.6)||(a.hasNum(1000)&&a.hasNum(3600))),
    shows(2,'Muestra la velocidad en m/s y en km/h.')
  ],'Ejemplo: 10 000 m en 50 min 0 s → 3000 s → 3,33 m/s → 12,00 km/h.');

  const e9 = ex(9,'Rotación de tres variables','Pide tres valores A, B y C. Rótalos hacia la izquierda: A recibe el valor de B, B el de C y C el que tenía A. Muestra el resultado de la rotación (si quieres, también los valores originales).','Es el intercambio de dos variables, pero con una más. Con una sola variable auxiliar basta: aux = A; A = B; B = C; C = aux.','05 · Variables',[
    structure,reads(3),
    c('rotate','Realiza la rotación real con una variable auxiliar.',a=>rotateIndex(a)>=0),
    c('after','Muestra los valores tras la rotación (juntos o por separado).',a=>{const at=rotateIndex(a);return at>=0&&/System\s*\.\s*out/.test(a.s.slice(at));})
  ],'Ejemplo: A = 1, B = 2, C = 3 → A = 2, B = 3, C = 1.','Medio');

  const e10 = ex(10,'Noche de pizzas','Pide cuántas pizzas se han pedido, en cuántas porciones se corta cada una y cuántas personas hay. Calcula el total de porciones, cuántas le tocan a cada persona (enteras) y cuántas sobran.','total = pizzas × porciones; porPersona = total / personas; sobran = total % personas. Usa int.','02 · División entera y resto',[
    structure,reads(3),
    op('mul','Calcula el total de porciones.',1),
    op('div','Reparte las porciones con división entera.',1),
    op('mod','Calcula las porciones sobrantes con %.',1),
    shows(3,'Muestra total, porciones por persona y sobrantes.')
  ],'Ejemplo: 3 pizzas × 8 porciones = 24; 5 personas → 4 cada una y sobran 4.');

  const e11 = ex(11,'Ampliación · La factura de la luz','Pide los kWh consumidos, el precio del kWh, la potencia contratada en kW y los días facturados. La potencia se paga a 0,10 € por kW y día. Sobre energía + potencia se aplica el impuesto eléctrico del 5,11 %; sobre todo ello, el IVA del 21 %. Muestra un desglose de la factura.','energia = kwh × precio; potencia = kW × dias × 0.10; base = energia + potencia; impElec = base × 0.0511; imponible = base + impElec; iva = imponible × 0.21; total = imponible + iva. Usa constantes para los porcentajes.','06 · Ampliación',[
    structure,reads(4),
    c('energy','Calcula el término de energía.',a=>a.opCount('mul')>=1),
    c('power','Calcula el término de potencia con 0,10 € por kW y día.',a=>a.hasNum(0.1)&&a.opCount('mul')>=3),
    c('elec-tax','Aplica el impuesto eléctrico del 5,11 %.',anyNum(5.11,0.0511,1.0511)),
    c('vat','Aplica el IVA del 21 % sobre la base con impuesto eléctrico.',anyNum(21,0.21,1.21)),
    op('add','Suma los conceptos para obtener bases y total.',2),
    c('constants','Declara al menos una constante con final.',a=>/\bfinal\s+(?:double|float|int)\b/.test(a.s)),
    shows(5,'Muestra el desglose de la factura (orden y formato libres).')
  ],'Ejemplo: 300 kWh a 0,15 €; 4,6 kW; 30 días → energía 45,00; potencia 13,80; impuesto eléctrico 3,00; base imponible 61,80; IVA 12,98; total 74,78 €.','Reto');

  const e12 = ex(12,'Ampliación · Dos puntos en el mapa','Pide las coordenadas de dos puntos del plano, (x1, y1) y (x2, y2). Calcula la distancia entre ellos, el punto medio y la pendiente de la recta que los une.','Distancia = Math.sqrt(Math.pow(x2 − x1, 2) + Math.pow(y2 − y1, 2)). Punto medio = ((x1 + x2) / 2, (y1 + y2) / 2). Pendiente = (y2 − y1) / (x2 − x1). Prueba con puntos que no tengan la misma x.','06 · Ampliación',[
    structure,reads(4),
    op('sub','Calcula las diferencias de coordenadas.',2),
    c('squares','Eleva las diferencias al cuadrado (Math.pow o multiplicando).',a=>/\bMath\s*\.\s*pow\s*\(/.test(a.s)||a.opCount('mul')>=2),
    c('sqrt','Calcula la raíz cuadrada con Math.sqrt.',a=>/\bMath\s*\.\s*sqrt\s*\(/.test(a.s)||/\bMath\s*\.\s*hypot\s*\(/.test(a.s)),
    c('midpoint','Calcula el punto medio dividiendo entre 2.',a=>/\/\s*2(?:\.0)?\b/.test(a.s)&&a.opCount('add')>=2),
    c('slope','Calcula la pendiente dividiendo las diferencias.',a=>a.opCount('div')>=3||/\)\s*\/\s*\(/.test(a.s)),
    shows(3,'Muestra distancia, punto medio y pendiente.')
  ],'Ejemplo: (1, 2) y (4, 6) → distancia 5,00; punto medio (2,5; 4,0); pendiente 1,33.','Reto');

  const exercises=[e1,e2,e3,e4,e5,e6,e7,e8,e9,e10,e11,e12];
  function validate(id,code){const exercise=exercises.find(x=>x.id===Number(id));if(!exercise)throw new Error('Ejercicio desconocido');const analyzed=assessCode(code);const results=exercise.criteria.map(test=>({id:test.id,label:test.label,pass:!!test.test(analyzed)}));return {id:exercise.id,results,passed:results.filter(x=>x.pass).length,total:results.length,complete:results.every(x=>x.pass),note:'Análisis estático orientativo: no se ha compilado ni ejecutado el programa.'};}
  return {exercises,validate,assessCode,sanitize,swapIndex,rotateIndex,
    config:{storageKey:'falomir_java_ampliacion_2026_27_v1',activity:'Java · Ampliación de sentencias simples',receiptPrefix:'JAVA-AMP',filePrefix:'ampliacion_java'}};
});
