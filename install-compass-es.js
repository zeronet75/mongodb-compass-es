const fs = require('fs');
const path = require('path');
const { readAsar, walk, repack } = require('./repack.js');

function readEntry(asarPath, header, base, entryPath) {
  const fd = fs.openSync(asarPath, 'r');
  const e = walk(header).find((x) => x.path === entryPath);
  if (!e) {
    fs.closeSync(fd);
    return null;
  }
  const buf = Buffer.alloc(e.node.size);
  if (e.node.size) fs.readSync(fd, buf, 0, e.node.size, base + Number(e.node.offset));
  fs.closeSync(fd);
  return buf.toString('utf8');
}

function main() {
  const appDir = process.argv[2];
  if (!appDir) {
    console.error('uso: node install-compass-es.js <carpeta app-X.Y.Z>');
    process.exit(1);
  }
  const resources = path.join(appDir, 'resources');
  const asarPath = path.join(resources, 'app.asar');
  const backupPath = path.join(resources, 'app.asar.orig');
  if (!fs.existsSync(asarPath)) {
    console.error('no existe', asarPath);
    process.exit(1);
  }
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(asarPath, backupPath);
    console.log('copia de seguridad creada:', backupPath);
  }

  const pristine = readAsar(backupPath);
  const html = readEntry(backupPath, pristine.header, pristine.base, 'build/index.html');
  const mainJs = readEntry(backupPath, pristine.header, pristine.base, 'build/main.js');
  const appJs = readEntry(backupPath, pristine.header, pristine.base, 'build/463.js');
  if (!html || !mainJs) {
    console.error('estructura inesperada del asar');
    process.exit(1);
  }

  let patchedHtml = html.replace('<html lang=en>', '<html lang=es>');
  if (!patchedHtml.includes('i18n-es.js')) {
    patchedHtml = patchedHtml.replace('</head>', '<script src=i18n-es.js></script></head>');
  }

  const hook =
    'require("./menu-es.js");\n' +
    'process.env.COMPASS_ES_DEBUG&&process.env.COMPASS_ES_DEBUG!=="0"&&require("electron").app.commandLine.appendSwitch("remote-debugging-port","9222");\n';
  let main = mainJs.startsWith(hook) ? mainJs : hook + mainJs;

  const dialogs = [
    ['title:"Log file for this session"', 'title:"Registro de esta sesión"'],
    ['message:`The log file for this session can be found at ${e}`', 'message:`El archivo de registro de esta sesión se encuentra en ${e}`'],
    ['detail:"Some tools may not be able to read the log file until Compass has exited."', 'detail:"Algunas herramientas podrían no poder leer el archivo de registro hasta que Compass se cierre."'],
    ['buttons:["OK","Copy to clipboard","Open Folder","Extract and open as .txt"]', 'buttons:["Aceptar","Copiar al portapapeles","Abrir carpeta","Extraer y abrir como .txt"]'],
    ['title:"Connect to a MongoDB deployment"', 'title:"Conectar con una implementación de MongoDB"'],
    ['message:"Are you sure that you want to proceed?"', 'message:"¿Seguro que quieres continuar?"'],
    ['detail:`This MongoDB connection string contains options that are typically not set by default and may present a security risk. Are you sure that you want to connect to this cluster?\\n\\n${e}`', 'detail:`Esta cadena de conexión de MongoDB contiene opciones que normalmente no se establecen de forma predeterminada y pueden suponer un riesgo de seguridad. ¿Seguro que quieres conectarte a este clúster?\\n\\n${e}`'],
    ['buttons:["Connect","Cancel"],defaultId:1', 'buttons:["Conectar","Cancelar"],defaultId:1'],
    ['buttons:["OK","darwin"===process.platform?"Copy Error":"Copy error"]', 'buttons:["Aceptar","darwin"===process.platform?"Copiar error":"Copiar error"]'],
  ];
  for (const [from, to] of dialogs) {
    if (main.includes(from)) main = main.split(from).join(to);
  }

  // Dialogos nativos y "Acerca de" del proceso principal (build/463.js).
  let appPatched = 0;
  let appTotal = 0;
  let app = appJs;
  if (app) {
    const appStrings = [
      ['title:"About "+r.app.getName()', 'title:"Acerca de "+r.app.getName()'],
      ['detail:"Version "+r.app.getVersion()', 'detail:"Versión "+r.app.getVersion()'],
      ['buttons:["OK"]', 'buttons:["Aceptar"]'],
      // Dialogo de salida (Conexiones > Salir / Ctrl+Q)
      ['title:`Quit ${r.app.getName()}`', 'title:`Salir de ${r.app.getName()}`'],
      ['message:"Are you sure you want to quit?"', 'message:"¿Seguro que quieres salir?"'],
      ['buttons:["Quit","Cancel"]', 'buttons:["Salir","Cancelar"]'],
      ['checkboxLabel:"Do not ask me again"', 'checkboxLabel:"No volver a preguntar"'],
      // Dialogos de actualizaciones
      ['message:"There are currently no updates available."', 'message:"Actualmente no hay actualizaciones disponibles."'],
      ['message:`The version of your operating system is no longer supported. Expected at least ${s.expectedVersion}.`', 'message:`La versión de tu sistema operativo ya no es compatible. Se requiere al menos ${s.expectedVersion}.`'],
      ['buttons:["OK","Visit Documentation on System Requirements"]', 'buttons:["Aceptar","Ver documentación de requisitos del sistema"]'],
      ['title:"New version available"', 'title:"Nueva versión disponible"'],
      ['message:`Compass ${s.to} is available`', 'message:`Compass ${s.to} está disponible`'],
      ['detail:`You are currently using ${s.from}. Update now for the latest Compass features.`', 'detail:`Actualmente usas ${s.from}. Actualiza ahora para obtener las últimas funciones de Compass.`'],
      ['buttons:["Visit download center","Ask me later"]', 'buttons:["Ir al centro de descargas","Preguntar más tarde"]'],
      ['buttons:["Install","Ask me later"]', 'buttons:["Instalar","Preguntar más tarde"]'],
      ['detail:`Compass ${t} is available. You are currently using ${e}. Would you like to download and install it now?`', 'detail:`Compass ${t} está disponible. Actualmente usas ${e}. ¿Quieres descargarla e instalarla ahora?`'],
      ['detail:`Compass ${t} is available. You are currently using a build of Compass that is not optimized for Apple processors. Would you like to download the version of Compass ${t} optimized for Apple processors now?`', 'detail:`Compass ${t} está disponible. Actualmente usas una compilación de Compass que no está optimizada para procesadores Apple. ¿Quieres descargar ahora la versión de Compass ${t} optimizada para procesadores Apple?`'],
      ['buttons:["Download Compass for Apple silicon (Recommended)","Update current installation","Ask me later"]', 'buttons:["Descargar Compass para Apple silicon (recomendado)","Actualizar la instalación actual","Preguntar más tarde"]'],
      ['message:"Mismatched architecture detected"', 'message:"Arquitectura incompatible detectada"'],
      ['detail:"You are currently using a build of Compass that is not optimized for Apple Silicon processors. This version might have significant performance issues when used. Would you like to download the version of Compass optimized for Apple Silicon processors now?"', 'detail:"Actualmente usas una compilación de Compass que no está optimizada para procesadores Apple Silicon. Esta versión podría tener problemas de rendimiento importantes. ¿Quieres descargar ahora la versión de Compass optimizada para procesadores Apple Silicon?"'],
      ['buttons:["Download Compass for Apple Silicon (Recommended)","Not now"]', 'buttons:["Descargar Compass para Apple Silicon (recomendado)","Ahora no"]'],
    ];
    appTotal = appStrings.length;
    for (const [from, to] of appStrings) {
      if (app.includes(from)) {
        app = app.split(from).join(to);
        appPatched++;
      }
    }
  }

  const i18n = fs.readFileSync(path.join(__dirname, 'i18n-es.js'), 'utf8');
  const menu = fs.readFileSync(path.join(__dirname, 'menu-es.js'), 'utf8');
  const replacements = new Map([
    ['build/index.html', patchedHtml],
    ['build/main.js', main],
    ['build/menu-es.js', menu],
    ['build/i18n-es.js', i18n],
  ]);
  if (app) replacements.set('build/463.js', app);

  const result = repack(backupPath, asarPath, replacements);
  console.log('parche aplicado en', asarPath);
  console.log('cadenas de dialogos traducidas:', appPatched, '/', appTotal);
  console.log(JSON.stringify(result));
}

main();
