const express = require("express");
const path = require("path");

const app = express();
let PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const server = app.listen(PORT, () => {
  console.log(`Lumina Photo Gallery Publishing site running at http://localhost:${PORT}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.log(`Port ${PORT} is in use, retrying on port ${PORT + 1}...`);
    PORT += 1;
    server.listen(PORT);
  } else {
    console.error("Server error:", err);
  }
});
