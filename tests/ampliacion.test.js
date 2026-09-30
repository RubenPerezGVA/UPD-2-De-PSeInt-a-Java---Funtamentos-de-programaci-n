const assert=require('node:assert/strict');
const {validate,exercises}=require('../validator-ampliacion.js');
const wrap=s=>`import java.util.Scanner; public class Prueba { public static void main(String[] args){Scanner in=new Scanner(System.in); ${s} }}`;
const ok=[
[1,wrap('final double CAFE=1.30, TOSTADA=2.10; int c=in.nextInt(); int t=in.nextInt(); double sub=c*CAFE+t*TOSTADA; double propina=sub*0.10; double total=sub+propina; System.out.println(sub); System.out.println(propina); System.out.println(total);')],
[2,wrap('int total=in.nextInt(); int h=total/3600; int resto=total%3600; int m=resto/60; int s=resto%60; System.out.println(h+" h "+m+" min "+s+" s");')],
[3,wrap('int q=in.nextInt(); int b50=q/50; q=q%50; int b20=q/20; q=q%20; int b10=q/10; q=q%10; int b5=q/5; q=q%5; int m2=q/2; int m1=q%2; System.out.println(b50);System.out.println(b20);System.out.println(b10);System.out.println(b5);System.out.println(m2);System.out.println(m1);')],
[4,wrap('double t=in.nextDouble(),p=in.nextDouble(),a=in.nextDouble(); double n=t*0.6+p*0.3+a*0.1; System.out.printf("Nota: %.2f%n", n);')],
[5,wrap('double c=in.nextDouble(); double f=c*9/5+32; double k=c+273.15; System.out.println(f); System.out.println(k);')],
[6,wrap('int n=in.nextInt(); int ce=n/100; int de=n/10%10; int un=n%10; int suma=ce+de+un; int rev=un*100+de*10+ce; System.out.println(suma); System.out.println(rev);')],
[7,wrap('double km=in.nextDouble(),l=in.nextDouble(),pr=in.nextDouble(); double cons=l/km*100; double coste=l*pr; double ck=coste/km; System.out.println(cons);System.out.println(coste);System.out.println(ck);')],
[8,wrap('double m=in.nextDouble(); int min=in.nextInt(); int seg=in.nextInt(); int tot=min*60+seg; double v=m/tot; double kmh=v*3.6; System.out.println(v); System.out.println(kmh);')],
[9,wrap('int a=in.nextInt(); int b=in.nextInt(); int c=in.nextInt(); System.out.println(a+" "+b+" "+c); int aux=a; a=b; b=c; c=aux; System.out.println(a); System.out.println(b); System.out.println(c);')],
[10,wrap('int pz=in.nextInt(),po=in.nextInt(),pe=in.nextInt(); int tot=pz*po; int cada=tot/pe; int sobra=tot%pe; System.out.println(tot);System.out.println(cada);System.out.println(sobra);')],
[11,wrap('final double POT=0.10, IE=0.0511, IVA=0.21; double kwh=in.nextDouble(),pr=in.nextDouble(),kw=in.nextDouble(); int d=in.nextInt(); double en=kwh*pr; double po=kw*d*POT; double base=en+po; double ie=base*IE; double imp=base+ie; double iva=imp*IVA; double total=imp+iva; System.out.println(en);System.out.println(po);System.out.println(ie);System.out.println(iva);System.out.println(total);')],
[12,wrap('double x1=in.nextDouble(),y1=in.nextDouble(),x2=in.nextDouble(),y2=in.nextDouble(); double dx=x2-x1; double dy=y2-y1; double d=Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2)); double mx=(x1+x2)/2; double my=(y1+y2)/2; double pend=dy/dx; System.out.println(d);System.out.println(mx+", "+my);System.out.println(pend);')]
];
assert.equal(exercises.length,12);
for(const [id,src] of ok){const r=validate(id,src);assert.ok(r.complete,`Ampliación ${id}: faltan ${r.results.filter(x=>!x.pass).map(x=>x.id).join(', ')}`);}
// 9/5 con enteros agrupado debe detectarse.
assert.ok(!validate(5,wrap('double c=in.nextDouble(); double f=(9/5)*c+32; double k=c+273.15; System.out.println(f);System.out.println(k);')).complete);
// Sin rotación real (solo cambia el orden de salida) no supera el ejercicio 9.
assert.ok(!validate(9,wrap('int a=in.nextInt(),b=in.nextInt(),c=in.nextInt(); System.out.println(a); System.out.println(b); System.out.println(c); System.out.println(c);')).complete);
// Pseudocódigo en comentarios no cuenta.
assert.ok(!validate(10,wrap('// int t=p*q; int x=t/n; int y=t%n;\n int p=in.nextInt(); System.out.println(p);')).complete);
console.log('✓ Ampliación: 12 soluciones completas y 3 casos negativos correctos.');

// --- Java 25/26: archivo compacto (void main sin clase) e IO.println / IO.readln ---
const P1=require('../validator.js');
const j25=s=>`void main() {\n${s}\n}`;
const modern=[
 [P1,2,j25('int a = Integer.parseInt(IO.readln("Primer número: "));\nint b = Integer.parseInt(IO.readln("Segundo: "));\nIO.println("Suma: " + (a + b));')],
 [P1,6,j25('var x = Integer.parseInt(IO.readln());\nvar y = Integer.parseInt(IO.readln());\nvar aux = x; x = y; y = aux;\nIO.println("A=" + x + " B=" + y);')],
 [P1,10,j25('double euros = Double.parseDouble(IO.readln("Euros: "));\nIO.println(euros * 166.386);')],
 [require('../validator-ampliacion.js'),2,j25('int total = Integer.parseInt(IO.readln("Segundos: "));\nint h = total / 3600; int m = total % 3600 / 60; int s = total % 60;\nIO.println(h + "h " + m + "min " + s + "s");')],
 [require('../validator-ampliacion.js'),9,j25('int a = Integer.parseInt(IO.readln()), b = Integer.parseInt(IO.readln()), c = Integer.parseInt(IO.readln());\nint aux = a; a = b; b = c; c = aux;\nIO.println(a + " " + b + " " + c);')],
 [require('../validator-ampliacion.js'),12,j25('double x1=Double.parseDouble(IO.readln()), y1=Double.parseDouble(IO.readln()), x2=Double.parseDouble(IO.readln()), y2=Double.parseDouble(IO.readln());\ndouble dx = x2 - x1; double dy = y2 - y1;\nIO.println(Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2)) + " (" + (x1+x2)/2 + ", " + (y1+y2)/2 + ") " + dy/dx);')],
 [P1,4,'public class Rect { public static void main(String[] args) { var t = new java.util.Scanner(System.in); double b = t.nextDouble(), h = t.nextDouble(); System.out.println(b*h); } }'],
];
for(const [V,id,src] of modern){const r=V.validate(id,src);assert.ok(r.complete,`Java 25 · ejercicio ${id}: faltan ${r.results.filter(x=>!x.pass).map(x=>x.id).join(', ')}`);}
assert.ok(!P1.validate(2,j25('int a = 3;')).complete);
console.log('✓ Java 25/26: archivos compactos, void main() e IO.readln/IO.println aceptados.');

// --- Sin %: dividiendo y restando ---
const A=require('../validator-ampliacion.js');
const sinMod=[
 [2,wrap('int t=in.nextInt(); int h=t/3600; int r=t-h*3600; int m=r/60; int s=r-m*60; System.out.println(h+" h "+m+" min "+s+" s");')],
 [2,wrap('int t=in.nextInt(); int h=t/3600; int m=(t-h*3600)/60; int s=t-h*3600-m*60; System.out.println(h+":"+m+":"+s);')],
 [2,j25('int t=Integer.parseInt(IO.readln()); int h=t/3600; t-=h*3600; int m=t/60; t-=m*60; IO.println(h+" "+m+" "+t);')],
 [3,wrap('int q=in.nextInt(); int b50=q/50; q=q-b50*50; int b20=q/20; q=q-b20*20; int b10=q/10; q=q-b10*10; int b5=q/5; q=q-b5*5; int m2=q/2; int m1=q-m2*2; System.out.println(b50+" "+b20+" "+b10+" "+b5+" "+m2+" "+m1);')],
 [3,wrap('int q=in.nextInt(); int b50=q/50; q-=b50*50; int b20=q/20; q-=b20*20; int b10=q/10; q-=b10*10; int b5=q/5; q%=5; int m2=q/2; int m1=q%2; System.out.println(b50+" "+b20+" "+b10+" "+b5+" "+m2+" "+m1);')],
];
for(const [id,src] of sinMod){const r=A.validate(id,src);assert.ok(r.complete,`Sin % · ejercicio ${id}: faltan ${r.results.filter(x=>!x.pass).map(x=>x.id).join(', ')}`);}
// Solo divisiones, sin calcular lo que sobra: no debe superarse.
assert.ok(!A.validate(3,wrap('int q=in.nextInt(); System.out.println(q/50+" "+q/20+" "+q/10+" "+q/5+" "+q/2+" "+q/1);')).complete);
console.log('✓ Tiempo y cajero: aceptados con % y también dividiendo y restando.');
