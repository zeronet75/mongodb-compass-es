// Empaqueta varios PNG (16, 24, 32, 48, 64, 128, 256) en un .ico.
const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || __dirname;
const out = process.argv[3] || path.join(__dirname, 'compass-es.ico');
const sizes = [16, 24, 32, 48, 64, 128, 256];

const frames = [];
for (const s of sizes) {
  const p = path.join(dir, `icon-${s}.png`);
  if (!fs.existsSync(p)) {
    console.error('falta', p);
    process.exit(1);
  }
  frames.push({ size: s, data: fs.readFileSync(p) });
}

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reservado
header.writeUInt16LE(1, 2); // tipo icono
header.writeUInt16LE(frames.length, 4);

const entries = Buffer.alloc(16 * frames.length);
let offset = 6 + entries.length;
frames.forEach((f, i) => {
  const b = i * 16;
  entries.writeUInt8(f.size >= 256 ? 0 : f.size, b + 0);
  entries.writeUInt8(f.size >= 256 ? 0 : f.size, b + 1);
  entries.writeUInt8(0, b + 2);
  entries.writeUInt8(0, b + 3);
  entries.writeUInt16LE(1, b + 4);
  entries.writeUInt16LE(32, b + 6);
  entries.writeUInt32LE(f.data.length, b + 8);
  entries.writeUInt32LE(offset, b + 12);
  offset += f.data.length;
});

fs.writeFileSync(out, Buffer.concat([header, entries, ...frames.map((f) => f.data)]));
console.log('ico:', out, 'bytes:', fs.statSync(out).size, 'frames:', frames.length);
