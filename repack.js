const fs = require('fs');
const path = require('path');

function readAsar(asarPath) {
  const fd = fs.openSync(asarPath, 'r');
  const head = Buffer.alloc(16);
  fs.readSync(fd, head, 0, 16, 0);
  const pickleSize = head.readUInt32LE(4);
  const headerLen = head.readUInt32LE(12);
  const headerBuf = Buffer.alloc(headerLen);
  fs.readSync(fd, headerBuf, 0, headerLen, 16);
  const base = 8 + pickleSize;
  const header = JSON.parse(headerBuf.toString('utf8'));
  return { fd, base, header };
}

function walk(header, prefix = '', out = []) {
  for (const [name, node] of Object.entries(header.files || {})) {
    const p = prefix ? prefix + '/' + name : name;
    if (node.files) walk(node, p, out);
    else out.push({ name, path: p, node });
  }
  return out;
}

function ensureFile(header, filePath, size) {
  const parts = filePath.split('/');
  let node = header;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!node.files[parts[i]]) node.files[parts[i]] = { files: {} };
    node = node.files[parts[i]];
    if (!node.files) throw new Error('not a directory: ' + parts.slice(0, i + 1).join('/'));
  }
  const name = parts[parts.length - 1];
  node.files[name] = { size, offset: '0' };
}

function repack(srcPath, destPath, replacements) {
  const { fd, base, header } = readAsar(srcPath);
  for (const [p, v] of replacements) {
    const buf = Buffer.isBuffer(v) ? v : Buffer.from(v, 'utf8');
    const entry = walk(header).find((e) => e.path === p);
    if (!entry) ensureFile(header, p, buf.length);
  }
  const entries = walk(header);
  const chunks = [];
  let offset = 0;
  let replaced = 0;
  const seen = new Set();
  for (const e of entries) {
    if (e.node.unpacked) continue;
    const size = e.node.size;
    let buf;
    if (replacements.has(e.path)) {
      buf = Buffer.isBuffer(replacements.get(e.path))
        ? replacements.get(e.path)
        : Buffer.from(replacements.get(e.path), 'utf8');
      replaced++;
      seen.add(e.path);
    } else {
      buf = Buffer.alloc(size);
      if (size) fs.readSync(fd, buf, 0, size, base + Number(e.node.offset));
    }
    e.node.size = buf.length;
    e.node.offset = String(offset);
    chunks.push(buf);
    offset += buf.length;
  }
  fs.closeSync(fd);
  for (const k of replacements.keys()) if (!seen.has(k)) throw new Error('missing asar entry: ' + k);

  const json = Buffer.from(JSON.stringify(header), 'utf8');
  const padded = Math.ceil(json.length / 4) * 4;
  const head = Buffer.alloc(16);
  head.writeUInt32LE(4, 0);
  head.writeUInt32LE(8 + padded, 4);
  head.writeUInt32LE(4 + padded, 8);
  head.writeUInt32LE(json.length, 12);
  const tmp = destPath + '.tmp';
  fs.writeFileSync(tmp, Buffer.concat([head, json, Buffer.alloc(padded - json.length), ...chunks]));
  fs.renameSync(tmp, destPath);
  return { entries: entries.length, replaced, bytes: 16 + padded + offset };
}

module.exports = { readAsar, walk, repack };

if (require.main === module) {
  const src = 'C:/Users/Portatil de Julia.DESKTOP-H8SCKBL/AppData/Local/MongoDBCompass/app-1.53.3/resources/app.asar';
  const dest = process.argv[2] || src;
  const repl = new Map();
  if (process.argv[3]) {
    const pj = JSON.parse(fs.readFileSync(process.argv[3], 'utf8'));
    for (const [k, v] of Object.entries(pj)) repl.set(k, v);
  }
  const r = repack(src, dest, repl);
  console.log(JSON.stringify(r));
}
