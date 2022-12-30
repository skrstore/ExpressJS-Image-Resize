const path = require("path");
const fs = require("fs");
const express = require("express");

const ResizeImage = require("./ResizeImage");

const app = express();
const PORT = 5000;

app.use(express.static(`${process.cwd()}/public`));

app.get("/", (req, res) => {
  res.sendFile(`index.html`);
});

// http://localhost:3000?image=1&format=png&width=200&height=200
app.get("/image", (req, res) => {
  const { image, format, width, height } = req.query;

  let fileNames = [];
  fs.readdir(process.cwd() + "/images", (err, files) => {
    if (err) {
      console.log(err);
      res.send("Bad Request");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      fileNames.push(path.parse(files[i]).name);
    }

    if (fileNames.indexOf(image) !== -1) {
      let ext = path.parse(files[fileNames.indexOf(image)]).ext;

      res.type(`image/${format || "png"}`);
      ResizeImage("./images/" + image + ext, format, width, height).pipe(res);
    } else {
      res.send("File Not Found");
    }
  });
});

app.get("/images", (req, res) => {
  fs.readdir(process.cwd() + "/images", (err, files) => {
    if (err) {
      console.log(err);
      res.send("Bad Request");
      return;
    }
    let fileNames = [];
    for (let i = 0; i < files.length; i++) {
      fileNames.push(path.parse(files[i]).name);
    }
    console.log(fileNames);
    let data = "";
    for (let i = 0; i < fileNames.length; i++) {
      data += `<a href="image/download/${fileNames[i]}">${
        fileNames[i]
      }</a><br>`;
    }
    res.send(data);
  });
});

app.get("/image/download/:name", (req, res) => {
  console.log(req.params);
  // res.send(req.params);
  let image = req.params.name;
  let format = "png";
  let width = 400;
  let height = 400;

  let fileNames = [];
  fs.readdir(process.cwd() + "/images", (err, files) => {
    if (err) {
      console.log(err);
      res.send("Bad Request");
      return;
    }
    for (let i = 0; i < files.length; i++) {
      fileNames.push(path.parse(files[i]).name);
    }

    if (fileNames.indexOf(image) !== -1) {
      let ext = path.parse(files[fileNames.indexOf(image)]).ext;

      res.type(`image/${format || "png"}`);
      // ResizeImage("./images/" + image + ext, format, width, height).pipe(
      //   res.download()
      // );

      let writable = fs.createReadStream();

      writable.pipe(
        ResizeImage("./images/" + image + ext, format, width, height)
      );

      console.log(writable);
      res.send("Hii");
      // res.send(ResizeImage("./images/" + image + ext, format, width, height));
    } else {
      res.send("File Not Found");
    }
  });
});

app.listen(PORT, console.log(`Server running on ${PORT}`));
