const fs = require('fs').promises;

class EnvFile {
  content;

  filePath;

  constructor(filePath) {
    this.filePath = filePath;
  }

  async read() {
    const text = await fs.readFile(this.filePath, 'utf8');
    let res = {};
    text
      .split('\n')
      .filter((s) => s !== '')
      .forEach((str) => {
        const [key, value] = str.split('=');
        if (key.startsWith('#')) return;
        res[key] = value;
      });
    this.content = res;
  }

  get(key) {
    return this.content[key];
  }

  upsert(key, value) {
    this.content[key] = value;
  }

  async save() {
    let fileContent = '';

    for (const key in this.content) {
      const value = this.content[key];
      fileContent += `${key}=${value}\n`;
    }

    await fs.writeFile(this.filePath, fileContent);
  }
}

module.exports = EnvFile;
