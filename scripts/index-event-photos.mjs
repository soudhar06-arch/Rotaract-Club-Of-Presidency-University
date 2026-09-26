import { readdir, mkdir, writeFile, stat } from "node:fs/promises";
import path from "node:path";
import { createHash } from "node:crypto";
import sharp from "sharp";

// Index the club's supplied archive, without inferring dates or descriptions from filenames.
const root = path.resolve("docs/Events conducted");
const target = path.resolve("public/event-archive");
const events = [];
for (const folder of (await readdir(root, { withFileTypes: true })).filter((entry) => entry.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
  const id = `local-${createHash("sha256").update(folder.name).digest("hex").slice(0, 16)}`;
  const images = [];
  await mkdir(path.join(target, id), { recursive: true });
  for (const name of (await readdir(path.join(root, folder.name))).filter((name) => /\.(jpe?g|png|webp)$/i.test(name)).sort()) {
    const input = path.join(root, folder.name, name);
    const info = await stat(input);
    const filename = `${createHash("sha256").update(`${name}:${info.size}:${info.mtimeMs}`).digest("hex").slice(0, 16)}.webp`;
    const output = path.join(target, id, filename);
    try { await stat(output); } catch { await sharp(input).rotate().resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true }).webp({ quality: 78 }).toFile(output); }
    images.push(`/event-archive/${id}/${filename}`);
  }
  events.push({ id, slug: id, folderId: folder.name, title: folder.name, category: "", source: "local", published: true, images, image: images[0], coverImage: images[0] });
}
await writeFile("src/data/event-archive.json", JSON.stringify(events, null, 2) + "\n");
console.log(`Indexed ${events.length} supplied event folders and ${events.reduce((n, e) => n + e.images.length, 0)} photographs.`);
