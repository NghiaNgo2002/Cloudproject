const sharp = require('sharp');
const path = require('path');

class Resize {
  constructor(folder, id) {
    this.folder = folder;
    this.id = id;
  }
  async save(buffer) {
    const filename = this.filename();
    const filepath = this.filepath(filename);

    await sharp(buffer)
      .resize(383, 383, { // size image 300x300
        fit: sharp.fit.inside,
        withoutEnlargement: true
      })
      .toFile(filepath);
    
    return filename;
  }
  filename() {
      console.log(this.id);
      return `profile-img-${this.id}.jpg`;
  }
  filepath(filename) {
    return path.resolve(`${this.folder}/${filename}`)
  }
}
module.exports = Resize;