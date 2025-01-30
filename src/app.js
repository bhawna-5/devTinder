const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/test", (req, res) => {
  res.send("Test Page");
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
