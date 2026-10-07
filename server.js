const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const MEDIA_DIR = process.env.MEDIA_DIR || path.join(__dirname, "media");

const VIDEO_EXT = new Set([".mp4", ".mkv", ".webm", ".mov", ".m4v", ".avi"]);
const IMAGE_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function scanDir(dir, rel = "") {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const abs = path.join(dir, entry.name);
    const r = path.join(rel, entry.name);
    if (entry.isDirectory()) return scanDir(abs, r);
    const ext = path.extname(entry.name).toLowerCase();
    return VIDEO_EXT.has(ext) ? [{ name: entry.name, path: r, size: fs.statSync(abs).size }] : [];
  });
}

function cleanTitle(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[._]/g, " ")
    .replace(/\b(1080p|2160p|4k|720p|x264|x265|h264|h265|bluray|webrip|web-dl)\b/gi, "")
    .replace(/\s+/g, " ").trim();
}

function library() {
  const videos = scanDir(MEDIA_DIR);
  return videos.map((v, i) => {
    const parts = v.path.split(path.sep);
    const type = parts.length > 1 ? "series" : "movie";
    return {
      id: String(i + 1),
      title: cleanTitle(v.name),
      type,
      path: v.path.replaceAll("\\", "/"),
      size: v.size
    };
  });
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.get("/api/library", (_req, res) => {
  res.json(library());
});

app.get("/api/video/:id", (req, res) => {
  const item = library().find(x => x.id === req.params.id);
  if (!item) return res.status(404).send("Vidéo introuvable");

  const file = path.resolve(MEDIA_DIR, item.path);
  const base = path.resolve(MEDIA_DIR);
  if (!file.startsWith(base + path.sep) || !fs.existsSync(file)) {
    return res.status(404).send("Fichier introuvable");
  }

  const stat = fs.statSync(file);
  const range = req.headers.range;
  const ext = path.extname(file).toLowerCase();
  const mime = ext === ".webm" ? "video/webm" : ext === ".mkv" ? "video/x-matroska" : "video/mp4";

  if (!range) {
    res.writeHead(200, { "Content-Length": stat.size, "Content-Type": mime, "Accept-Ranges": "bytes" });
    return fs.createReadStream(file).pipe(res);
  }

  const [startText, endText] = range.replace("bytes=", "").split("-");
  const start = Number(startText);
  const end = endText ? Number(endText) : stat.size - 1;
  const chunk = end - start + 1;

  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${stat.size}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunk,
    "Content-Type": mime
  });
  fs.createReadStream(file, { start, end }).pipe(res);
});

app.get("*", (_req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MaisonFlix disponible sur http://localhost:${PORT}`);
  console.log(`Médias: ${MEDIA_DIR}`);
});