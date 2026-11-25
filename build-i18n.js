const fs = require('fs');
const dict = JSON.parse(fs.readFileSync(require('path').join(__dirname,'dict-es.json'), 'utf8'));

const rules = [
  [/^Compass (.+) installed successfully$/, 'Compass $1 instalado correctamente'],
  [/^Connected to (.+)$/, 'Conectado a $1'],
  [/^Connecting to (.+)$/, 'Conectando a $1'],
  [/^Delete (.+)$/, 'Eliminar $1'],
  [/^Drop (.+)$/, 'Eliminar $1'],
  [/^Clone (.+)$/, 'Clonar $1'],
  [/^Create (collection|database|index) (.+)$/, 'Crear $1 $2'],
  [/^(\d[\d.,]*)\s+documents?$/, '$1 documentos'],
  [/^(\d[\d.,]*)\s+collections?$/, '$1 colecciones'],
  [/^(\d[\d.,]*)\s+indexes$/, '$1 índices'],
  [/^(\d[\d.,]*)\s+of\s+(\d[\d.,]*)$/, '$1 de $2'],
  [/^(\d[\d.,]*)\s*[-–]\s*(\d[\d.,]*)\s+of\s+(\d[\d.,]*)$/, '$1 - $2 de $3'],
  [/^\(since (.+)\)$/, '(desde $1)'],
  [/^Show (\d+) more$/, 'Mostrar $1 más'],
  [/^(\d+) documents? in the collection$/, '$1 documentos en la colección'],
  [/^(.+) in the collection$/, '$1 en la colección'],
  [/^Item (\d+) of (\d+)$/, 'Elemento $1 de $2'],
  [/^(.+) is not available$/, '$1 no está disponible'],
  [/^To collection (.+)$/, 'A la colección $1'],
  [/^Connecting to (.+)$/, 'Conectando a $1'],
];

const dictJson = JSON.stringify(dict, null, 2);
const rulesJson = JSON.stringify(
  rules.map(([re, rep]) => [re.source, re.flags, rep]),
  null,
  2
);

const template = `(function () {
  'use strict';

  // Capa de traduccion al espanol para MongoDB Compass.
  // Traduce nodos de texto y atributos visibles en tiempo de ejecucion.
  var DICT = ${dictJson};

  var RULES = ${rulesJson}.map(function (r) {
    return [new RegExp(r[0], r[1]), r[2]];
  });

  var ATTRS = ['placeholder', 'title', 'aria-label', 'aria-description', 'alt'];
  var EXCLUDE = '[data-testid="document-list"],[data-testid="json-editor"],[data-testid="editable-json"],[contenteditable="true"],pre,code,.CodeMirror-code,.cm-content,.cm-line,.view-lines';
  var SINGLE_WORD = /^[A-Za-z][A-Za-z.'-]*$/;

  function isUiContext(el) {
    var p = el;
    for (var i = 0; i < 4 && p; i++, p = p.parentElement) {
      var tag = p.tagName;
      if (tag === 'BUTTON' || tag === 'A' || tag === 'LABEL' || tag === 'TH' || tag === 'OPTION' || tag === 'LEGEND' || tag === 'SUMMARY' || tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4') return true;
      var role = p.getAttribute && p.getAttribute('role');
      if (role && /^(button|tab|menuitem|option|columnheader|link|checkbox|radio|switch|combobox|treeitem)$/.test(role)) return true;
      if (p.hasAttribute && (p.hasAttribute('data-testid') || p.hasAttribute('aria-label') || p.hasAttribute('title'))) return true;
    }
    return false;
  }

  function translateString(value) {
    if (!value) return value;
    var direct = DICT[value];
    if (direct !== undefined) return direct;
    var trimmed = value.trim();
    if (!trimmed) return value;
    if (trimmed !== value) {
      var t = DICT[trimmed];
      if (t !== undefined) return value.replace(trimmed, t);
      var r = applyRules(trimmed);
      if (r !== trimmed) return value.replace(trimmed, r);
      return value;
    }
    return applyRules(trimmed);
  }

  function applyRules(s) {
    for (var i = 0; i < RULES.length; i++) {
      var re = RULES[i][0];
      if (re.test(s)) return s.replace(re, RULES[i][1]);
    }
    return s;
  }

  function translateTextNode(node) {
    var value = node.nodeValue;
    if (!value) return;
    var parent = node.parentElement;
    if (parent && parent.closest && parent.closest(EXCLUDE) && !(parent.closest('.CodeMirror-placeholder') || parent.closest('.cm-placeholder'))) return;
    var trimmed = value.trim();
    if (!trimmed) return;
    if (SINGLE_WORD.test(trimmed) && parent && !isUiContext(parent)) return;
    var out = translateString(value);
    if (out !== value) node.nodeValue = out;
  }

  function translateAttributes(el) {
    if (!el.getAttribute) return;
    for (var i = 0; i < ATTRS.length; i++) {
      var a = ATTRS[i];
      if (el.hasAttribute(a)) {
        var v = el.getAttribute(a);
        var out = translateString(v);
        if (out !== v) el.setAttribute(a, out);
      }
    }
  }

  function translateSubtree(root) {
    if (!root) return;
    if (root.nodeType === 3) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== 1 && root.nodeType !== 9 && root.nodeType !== 11) return;
    if (root.nodeType === 1) translateAttributes(root);
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, null);
    var node;
    while ((node = walker.nextNode())) {
      if (node.nodeType === 3) translateTextNode(node);
      else translateAttributes(node);
    }
  }

  function handleMutations(muts) {
    for (var i = 0; i < muts.length; i++) {
      var m = muts[i];
      if (m.type === 'characterData') {
        translateTextNode(m.target);
      } else if (m.type === 'attributes') {
        translateAttributes(m.target);
      } else {
        for (var j = 0; j < m.addedNodes.length; j++) {
          translateSubtree(m.addedNodes[j]);
        }
        translateAttributes(m.target);
      }
    }
  }

  var observer = new MutationObserver(handleMutations);
  var observing = false;

  function observe() {
    if (observing || !document.documentElement) return;
    observing = true;
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ATTRS,
    });
  }

  function start() {
    document.documentElement.setAttribute('lang', 'es');
    if (document.title) document.title = translateString(document.title);
    translateSubtree(document.body || document.documentElement);
  }

  observe();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      observe();
      start();
    }, { once: true });
  } else {
    start();
  }

  window.__compassEs = {
    dict: DICT,
    rules: RULES,
    add: function (pairs) { for (var k in pairs) DICT[k] = pairs[k]; },
    translate: translateString,
    rescan: function () { translateSubtree(document.body); },
  };
})();
`;

fs.writeFileSync(require('path').join(__dirname,'i18n-es.js'), template);
console.log('i18n-es.js bytes', template.length, 'entries', Object.keys(dict).length, 'rules', rules.length);

