const express = require("express");
const url = require("url");
const fs = require("fs");
const { createCanvas } = require("canvas");
const app = express();
const port = 3000;

async function createImage(textToRender) {
  const width = 500;
  const height = 300;

  const canvas = createCanvas(width, height);
  const context = canvas.getContext("2d");

  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  const text = textToRender;

  context.font = "bold 40px Menlo";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "#c41094";
  context.fillText(text, width / 2, height / 2);

  const buffer = canvas.toBuffer("image/png");

  fs.writeFileSync("./test.png", buffer);
  // fs.chmod("./test.png", 0o644);
}

app.get("/", async (req, res) => {
  const queryObject = url.parse(req.url, true).query;

  await createImage(queryObject.name);

  const webPage = `
  <html>
  <head>
  <title>Hello, ${queryObject.name}</title>
  </head>
  <body>
  <img src="http://localhost:3000/test.png"></img>
  </body>
  </html>
  `;

  res.send(webPage);
});

app.get("/test.png", (req, res) => {
  res.sendFile("test.png", { root: __dirname });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
