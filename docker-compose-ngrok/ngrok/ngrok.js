const { exec } = require('child_process');

class Ngrok {
  async start(port) {
    await this._execAsync(`ngrok http ${port} &>/dev/null &`);
    const res = await this._execAsync(
      `echo $(curl --silent --max-time 10 --connect-timeout 5 --show-error http://127.0.0.1:4040/api/tunnels | sed -nE 's/.*public_url":"https:..([^"]*)` +
        ".*/\\1/p')"
    );
    const url = res.substring(0, res.length - 1);

    if (url === '') {
      await new Promise((res) => setTimeout(res, 1000));
      return this.start(port);
    }
    return `https://${url}`;
  }

  async stop() {
    try {
      await this._execAsync('kill -9 "$(pgrep ngrok)"');
      console.log('Ngrok connection successfully closed');
    } catch {
      console.log('Ngrok connection not found');
    }
  }

  _execAsync(command) {
    return new Promise((res, rej) => {
      exec(command, (error, stdout, stderr) => {
        if (error) return rej(error);
        res(stdout);
      });
    });
  }
}

module.exports = Ngrok;
