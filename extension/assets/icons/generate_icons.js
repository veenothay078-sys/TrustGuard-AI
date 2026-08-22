// Simple icon generator - run this to create PNG icons for the extension
// This creates minimal valid PNG files using raw bytes

const fs = require('fs');
const path = require('path');

// Minimal PNG header and blue shield icon (16x16, 48x48, 128x128)
// For production, replace with proper PNG files

function createSimplePNG(size) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR chunk
  function makeChunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const typeBytes = Buffer.from(type);
    const crc = crc32(Buffer.concat([typeBytes, data]));
    const crcBuf = Buffer.alloc(4);
    crcBuf.writeInt32BE(crc);
    return Buffer.concat([len, typeBytes, data, crcBuf]);
  }

  function crc32(buf) {
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
      table[i] = c;
    }
    let crc = 0xFFFFFFFF;
    for (const b of buf) crc = table[(crc ^ b) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) | 0;
  }

  const ihdr = makeChunk('IHDR', (() => {
    const b = Buffer.alloc(13);
    b.writeUInt32BE(size, 0);
    b.writeUInt32BE(size, 4);
    b[8] = 8; b[9] = 2; // 8-bit depth, RGB
    return b;
  })());

  // Create simple colored pixel data (blue-purple gradient)
  const rows = [];
  for (let y = 0; y < size; y++) {
    const row = Buffer.alloc(1 + size * 3);
    row[0] = 0; // filter type
    for (let x = 0; x < size; x++) {
      const cx = x - size / 2, cy = y - size / 2;
      const dist = Math.sqrt(cx * cx + cy * cy);
      const inCircle = dist < size * 0.45;
      const inShield = cy < size * 0.4 && Math.abs(cx) < size * 0.35 - Math.max(0, (cy + size * 0.15) * 0.3);
      if (inShield) {
        row[1 + x * 3] = 79;  // R - primary blue
        row[2 + x * 3] = 142; // G
        row[3 + x * 3] = 247; // B
      } else if (inCircle) {
        row[1 + x * 3] = 15;  // R - dark bg
        row[2 + x * 3] = 22;
        row[3 + x * 3] = 41;
      } else {
        row[1 + x * 3] = 10;  // transparent bg (very dark)
        row[2 + x * 3] = 14;
        row[3 + x * 3] = 26;
      }
    }
    rows.push(row);
  }

  // Compress using zlib (simple store, no compression)
  const zlib = require('zlib');
  const rawData = Buffer.concat(rows);
  const compressed = zlib.deflateSync(rawData);
  const idat = makeChunk('IDAT', compressed);
  const iend = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

const iconsDir = path.join(__dirname, '../extension/assets/icons');
fs.mkdirSync(iconsDir, { recursive: true });

[16, 48, 128].forEach(size => {
  const png = createSimplePNG(size);
  fs.writeFileSync(path.join(iconsDir, `icon${size}.png`), png);
  console.log(`Created icon${size}.png`);
});

console.log('Icons created! Replace with proper branded PNG files for production.');
