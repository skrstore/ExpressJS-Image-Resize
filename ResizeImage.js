const fs = require("fs");
const sharp = require("sharp");

module.exports = resize = (path, format, width, height) => {
  const readStream = fs.createReadStream(path);
  let transform = sharp();

  let w, h;
  if (width) {
    w = parseInt(width);
    if (w > 1000) w = 1000;
  }
  if (height) {
    h = parseInt(height);
    if (h > 1000) h = 1000;
  }

  if (format) {
    transform = transform.toFormat(format);
  }

  if (w || h) {
    transform = transform.resize(w, h);
  }

  return readStream.pipe(transform);
};
