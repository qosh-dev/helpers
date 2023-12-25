const { exec } = require('child_process');

class DockerCompose {
  filePath;
  poolingInterval = 2000;

  constructor(filePath) {
    this.filePath = filePath;
  }

  // Start docker-compose
  start() {
    return new Promise((res, rej) => {
      exec(
        `docker-compose -f ${this.filePath} up -d`,
        (error, stdout, stderr) => {
          if (error) {
            rej(error);
          }
          res(stdout);
        }
      );
    });
  }

  async watch(callback) {
    setInterval(() => {
      this.startStatePooling(callback);
    }, this.poolingInterval);
  }

  startStatePooling(callback) {
    exec(
      `echo $(docker-compose -f ${this.filePath} ps)`,
      (error, stdout, stderr) => {
        if (error) {
          callback({ isActive: false });
          return;
        }
        callback({ isActive: !isEmpty(stdout) });
      }
    );

    function isEmpty(str) {
      return str === 'NAME COMMAND SERVICE STATUS PORTS\n';
    }
  }

  stop() {
    return new Promise((res, rej) => {
      exec(
        `docker-compose -f ${this.filePath} down`,
        (error, stdout, stderr) => {
          if (error) {
            rej(error);
          }
          res(stdout);
        }
      );
    });
  }
}

module.exports = DockerCompose;
