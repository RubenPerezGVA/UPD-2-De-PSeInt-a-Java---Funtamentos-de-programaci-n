const assert=require('node:assert/strict');
const {validate,exercises}=require('../validator.js');
const wrap=s=>`import java.util.Scanner; public class Ejemplo { public static void main(String[] args){Scanner dato=new Scanner(System.in); ${s} }}`;
const tests=[
[1,wrap('String apodo=dato.nextLine(); int cursos=dato.nextInt(); System.out.println("Hola " + apodo + ", tu edad es " + cursos);')],
[2,wrap('double cifraUno=dato.nextDouble(); double cifraDos=dato.nextDouble(); System.out.println("resultado " +(cifraUno+cifraDos));')],
[3,wrap('int w=dato.nextInt(),v=dato.nextInt(); System.out.println(w+v);System.out.println(w-v);System.out.println(w*v);System.out.println((double)w/v);System.out.println(w%v);')],
[4,wrap('double longitud=dato.nextDouble(), anchura=dato.nextDouble(); double producto=longitud*anchura;System.out.println(producto);')],
[5,wrap('double x=dato.nextDouble(); double y=Math.PI*Math.pow(x,2); double z=2*Math.PI*x; System.out.println(y); System.out.println(z);')],
[6,wrap('int izquierda=dato.nextInt();int derecha=dato.nextInt();int aux=izquierda;izquierda=derecha;derecha=aux;System.out.println(izquierda);System.out.println(derecha);')],
[7,wrap('int c=dato.nextInt(),n=dato.nextInt(),l=dato.nextInt(); double pc=dato.nextDouble(),pn=dato.nextDouble(),pl=dato.nextDouble(); double tc=c*pc,tn=n*pn,tl=l*pl;double global=tc+tn+tl;System.out.println("cola "+tc);System.out.println("naranja "+tn);System.out.println("limón "+tl);System.out.println("total "+global);')],
[8,wrap('double base=dato.nextDouble();double impuesto=base*0.21;double finalP=base+impuesto;System.out.println(impuesto);System.out.println(finalP);')],
[9,wrap('double base=dato.nextDouble();double porcentaje=dato.nextDouble();double impuesto=base*(porcentaje/100);double finalP=base+impuesto;System.out.println(impuesto);System.out.println(finalP);')],
[10,wrap('double amount=dato.nextDouble();double conversion=amount*166.386;System.out.println(conversion);')],
[11,wrap(`double largoA=300, anchoA=150, profA=20, largoB=300, anchoB=80, profB=35;
 double areaA=largoA*anchoA; double areaB=largoB*anchoB;
 double volA=areaA*profA;double volB=areaB*profB;
 double anchoJunto=anchoA+anchoB;double largoJunto=largoA;
 double areaJunta=largoJunto*anchoJunto;double volumenJunto=volA+volB;
 System.out.println(areaA);System.out.println(areaB);System.out.println(volA);System.out.println(volB);
 System.out.println(anchoJunto);System.out.println(largoJunto);System.out.println(areaJunta);System.out.println(volumenJunto);
 double auxiliar=profA;profA=profB;profB=auxiliar;
 double volumenNuevoA=areaA*profA, volumenNuevoB=areaB*profB;
 System.out.println(volumenNuevoA);System.out.println(volumenNuevoB);`)],
[12,wrap('int numero=dato.nextInt(); double decimal=dato.nextDouble(); double ancho=numero; int truncado=(int) decimal; String cadena=String.valueOf(decimal); System.out.println(ancho); System.out.println(truncado); System.out.println(cadena + " tiene " + cadena.length() + " caracteres");')],
[12,wrap('int a=dato.nextInt(); double b=dato.nextDouble(); double a2=(double) a; int b2=(int)(b); String t="" + b; System.out.println(a2+" "+b2+" "+t+" "+t.length());')]
];
assert.equal(exercises.length,12);
for(const [id,src] of tests){const r=validate(id,src);assert.ok(r.complete,`Ejercicio ${id}: faltan ${r.results.filter(x=>!x.pass).map(x=>x.id).join(', ')}`);}
const incomplete=validate(2,wrap('int uno=dato.nextInt();System.out.println(uno);'));
assert.ok(!incomplete.complete&&incomplete.passed>0&&incomplete.passed<incomplete.total);
const fake=validate(2,wrap('String p="dato.nextInt(); dato.nextInt(); System.out.println(7+9);"; // dato.nextInt();\n'));
assert.ok(!fake.complete&&!fake.results.find(x=>x.id==='reads').pass&&!fake.results.find(x=>x.id==='shows').pass);
const sinCast=validate(12,wrap('int a=dato.nextInt(); double b=dato.nextDouble(); double c=a; int d=Math.round(1); String t=String.valueOf(b); System.out.println(c+" "+t.length());'));
assert.equal(sinCast.results.find(x=>x.id==='double-int').pass,false);
const castComentado=validate(12,wrap('int a=dato.nextInt(); double b=dato.nextDouble(); double c=a; // int d=(int) b;\n String t=String.valueOf(b); System.out.println(c+" "+t.length());'));
assert.equal(castComentado.results.find(x=>x.id==='double-int').pass,false);
const sinTexto=validate(12,wrap('int a=dato.nextInt(); double b=dato.nextDouble(); double c=a; int d=(int) b; System.out.println(c+" "+d);'));
assert.ok(!sinTexto.complete&&!sinTexto.results.find(x=>x.id==='double-string').pass&&!sinTexto.results.find(x=>x.id==='length').pass);
assert.equal(validate(12,exercises[11].template).complete,false);
const noSwap=validate(6,wrap('int alfa=dato.nextInt(),beta=dato.nextInt();System.out.println(beta);System.out.println(alfa);'));
assert.equal(noSwap.results.find(x=>x.id==='swap').pass,false);
console.log(`PRUEBAS OK: ${tests.length} soluciones variadas completas, validación parcial, comentarios/literales y ausencia de intercambio.`);
