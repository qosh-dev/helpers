const DockerCompose = require('./docker-compose');
const path = require('path');
const Ngrok = require('./ngrok/ngrok');
const EnvFile = require('./env-file');

async function bootstrap() {
  const composeFilePath = path.join(__dirname, '..', 'docker-compose.yml');
  const envFilePath = path.join(__dirname, '..', '.env');
  const envFile = new EnvFile(envFilePath);
  await envFile.read();
  const apiPORT = +envFile.get('WEB_PORT');

  const ngrok = new Ngrok();
  const remoteURL = await ngrok.start(apiPORT);
  envFile.upsert('WEB_URL', remoteURL);
  await envFile.save();

  const dockerCompose = new DockerCompose(composeFilePath);
  await dockerCompose.start();

  dockerCompose.watch(async ({ isActive }) => {
    if (isActive) return;
    console.log('Docker compose down');
    console.log('\n');
    await ngrok.stop();
    process.exit(0);
  });

  process.on('SIGINT', async (signal) => {
    console.log('\n');
    await ngrok.stop();
    console.log('Docker compose down');
    await dockerCompose.stop();

    console.log('\nProcess closed');
    process.exit(0);
  });

  process.on('ENOENT', async (signal) => {
    console.log('ENOENT');
    process.exit(0);
  });

  await new Promise((res) => setTimeout(res, 10000));
  console.log('Application started', remoteURL);
}

bootstrap();
