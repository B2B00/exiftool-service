// server.js
const express = require("express");
const multer = require("multer");
const { execFile } = require("child_process");
const fs = require("fs");
const app = express();
const upload = multer({ dest: "uploads/" });

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY || '';

app.post("/analyze", upload.single("file"), (req, res) => {
  // Autenticação simples (opcional): enviar header x-api-key se API_KEY estiver definido
  if (API_KEY && req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!req.file) return res.status(400).json({ error: "Nenhum ficheiro recebido" });

  const filePath = req.file.path;

  execFile("exiftool", ["-j", "-a", "-G1", "-s", filePath], (err, stdout, stderr) => {
    try { fs.unlinkSync(filePath); } catch (e) { /* ignorar */ }

    if (err) {
      return res.status(500).json({ error: stderr || err.message });
    }

    try {
      const parsed = JSON.parse(stdout)[0] || {};
      return res.json(parsed);
    } catch (e) {
      return res.status(500).json({ error: "Falha ao parsear saída do ExifTool" });
    }
  });
});

app.get("/", (req, res) => res.send("ExifTool API OK"));

app.listen(PORT, () => console.log(`ExifTool API rodando na porta ${PORT}`));
