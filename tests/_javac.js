/* Utilidad de las pruebas de refuerzo/ampliación: compila con javac (y ejecuta con datos de entrada) cada solución de prueba. */
const fs = require('node:fs'), os = require('node:os'), path = require('node:path');
const {execFileSync} = require('node:child_process');
const assert = require('node:assert/strict');
const wrap = (cls, body) => `import java.util.Scanner;\n\npublic class ${cls} {\n    public static void main(String[] args) {\n        Scanner in = new Scanner(System.in);\n${body}\n    }\n}\n`;
/* sols: [{id, cls, src, input?, expect?}] → compila todas en /tmp/up2-extras/<name> y comprueba la salida esperada (subcadena). */
function build(name, sols) {
  const dir = path.join(os.tmpdir(), 'up2-extras', name), out = path.join(dir, 'out');
  fs.rmSync(dir, {recursive: true, force: true}); fs.mkdirSync(out, {recursive: true});
  const files = sols.map(s => { const f = path.join(dir, s.cls + '.java'); fs.writeFileSync(f, s.src); return f; });
  try { execFileSync('javac', ['-encoding', 'UTF-8', '-d', out, ...files], {stdio: 'pipe'}); }
  catch (e) { throw new Error('javac ha fallado en ' + name + ':\n' + String(e.stderr || e.message)); }
  for (const s of sols) {
    if (s.input === undefined) continue;
    const res = execFileSync('java', ['-Duser.language=en', '-Duser.country=US', '-Dfile.encoding=UTF-8', '-Dstdout.encoding=UTF-8', '-cp', out, s.cls], {input: s.input, stdio: 'pipe'}).toString();
    for (const e of [].concat(s.expect || [])) assert.ok(res.includes(e), `${s.cls}: la salida no contiene «${e}». Salida:\n${res}`);
  }
}
module.exports = {wrap, build};
