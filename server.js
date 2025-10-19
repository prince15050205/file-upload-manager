// ==========================
// IBM File Upload Manager Backend
// ==========================
const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// ===== Middleware =====
app.use(cors());
app.use(express.json());

// ===== Create uploads folder =====
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// ===== Login System =====
const validCredentials = {
  ishu: "150205",
  user2: "1234",
  admin: "admin123"
};

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (validCredentials[username] && validCredentials[username] === password) {
    res.json({ success: true, message: "Login Successful!" });
  } else {
    res.json({ success: false, message: "Invalid credentials" });
  }
});

// ===== File Upload System =====
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage });

app.post("/upload", upload.array("files"), (req, res) => {
  console.log("Files uploaded:", req.files.map(f => f.originalname));
  res.json({
    success: true,
    files: req.files.map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      path: `/uploads/${f.filename}`
    }))
  });
});

// ===== List Uploaded Files =====
app.get("/files", (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: "Cannot read upload folder" });
    res.json(files);
  });
});

// ===== Serve Uploaded Files =====
app.use("/uploads", express.static(uploadDir));

// ===== Default Route =====
app.get("/", (req, res) => {
  res.send("✅ IBM File Upload Manager Backend is running!");
});

// ===== Start Server =====
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
