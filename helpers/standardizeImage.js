const jimp = require("jimp");

const standardizeImage = async (path) => {
  const image = await jimp.read(path);
  image.cover(250, 250);
  await image.writeAsync(path);
};

module.exports = standardizeImage;
