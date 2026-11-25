// Traduccion de la barra de menus nativa de MongoDB Compass.
// Se ejecuta en el proceso principal antes de que se construya cualquier menu.
(function () {
  'use strict';

  var Menu;
  try {
    Menu = require('electron').Menu;
  } catch (e) {
    return;
  }
  if (!Menu || Menu.__compassEsPatched) return;
  Menu.__compassEsPatched = true;

  var MAP = {
    '&Connections': '&Conexiones',
    '&Import Saved Connections': '&Importar conexiones guardadas',
    '&Export Saved Connections': '&Exportar conexiones guardadas',
    'E&xit': '&Salir',
    'Edit': 'Editar',
    'Undo': '&Deshacer',
    'Redo': '&Rehacer',
    'Cut': '&Cortar',
    'Copy': 'Co&piar',
    'Paste': 'Pe&gar',
    'Select All': '&Seleccionar todo',
    'Find': '&Buscar',
    '&Settings': '&Ajustes',
    '&View': '&Ver',
    '&Reload': '&Recargar',
    '&Reload Data': 'Recargar &datos',
    'Actual Size': 'Tamaño rea&l',
    'Zoom In': '&Acercar',
    'Zoom Out': 'Ale&jar',
    '&Toggle DevTools': 'Alternar &DevTools',
    '&Help': 'A&yuda',
    '&License': '&Licencia',
    '&View Source Code on GitHub': '&Ver código fuente en GitHub',
    '&Suggest a Feature': '&Sugerir una función',
    '&Report a Bug': '&Informar de un error',
    '&Open Log File': 'Abrir archivo de &registro',
    'Check for updates…': 'Buscar actualizaciones…',
    'Check for updates...': 'Buscar actualizaciones...',
    'Installing updates…': 'Instalando actualizaciones…',
    'Installing updates...': 'Instalando actualizaciones...',
    'Restart to Update': 'Reiniciar para actualizar',
    'Window': 'Ventana',
    'New &Window': 'Nueva &ventana',
    'New Window': 'Nueva ventana',
    'Minimize': '&Minimizar',
    'Close': 'Cerrar',
    'Bring All to Front': 'Traer todo al frente',
    'Hide': '&Ocultar',
    'Hide Others': 'Ocultar &otros',
    'Show All': 'Mostrar &todo',
    'Quit': '&Salir',
    'About': 'Acerca de',
    'Preferences…': 'Preferencias…',
    'Services': 'Servicios'
  };

  var RULES = [
    [/^&Online (.+) Help$/, 'A&yuda en línea de $1'],
    [/^&About (.+)$/, 'A&cerca de $1'],
    [/^About (.+)$/, 'Acerca de $1']
  ];

  function translateLabel(label) {
    if (typeof label !== 'string') return label;
    if (MAP[label] !== undefined) return MAP[label];
    for (var i = 0; i < RULES.length; i++) {
      if (RULES[i][0].test(label)) return label.replace(RULES[i][0], RULES[i][1]);
    }
    return label;
  }

  function translateTemplate(items) {
    if (!Array.isArray(items)) return items;
    return items.map(function (item) {
      if (!item || typeof item !== 'object') return item;
      var copy = {};
      for (var key in item) copy[key] = item[key];
      if (copy.label !== undefined) copy.label = translateLabel(copy.label);
      if (Array.isArray(copy.submenu)) copy.submenu = translateTemplate(copy.submenu);
      return copy;
    });
  }

  var original = Menu.buildFromTemplate.bind(Menu);
  Menu.buildFromTemplate = function (template) {
    return original(translateTemplate(template));
  };

  // Volcado opcional del menu final (para verificacion): COMPASS_ES_MENU_DUMP=ruta.json
  if (process.env.COMPASS_ES_MENU_DUMP) {
    var fs = require('fs');
    var dump = function (items) {
      return (items || []).map(function (item) {
        return {
          label: item.label,
          role: item.role,
          type: item.type,
          enabled: item.enabled,
          submenu: item.submenu ? dump(item.submenu.items) : undefined
        };
      });
    };
    setTimeout(function () {
      try {
        var menu = Menu.getApplicationMenu();
        fs.writeFileSync(process.env.COMPASS_ES_MENU_DUMP, JSON.stringify(menu ? dump(menu.items) : null, null, 2));
      } catch (e) {}
    }, 6000);
  }
})();
