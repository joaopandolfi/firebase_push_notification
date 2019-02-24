const Storage = require('@google-cloud/storage');

const env = process.env.GCLOUD_PROJECT;

if ((env !== null) && (env !== undefined)) {
  // Creates a client
  const storage = new Storage({
    projectId: env,
  });

  let bucketName = '';

  if (env === '-dev') {
    bucketName = `${bucketName}-dev`;
  }

  console.log(`getEnv.js: Downloading co from "${env}" bucket "${bucketName}"`);

  // Download file
  storage.bucket(bucketName)
    .file('firebase-credentials.json')
    .download({ destination: 'credentials/firebase-credentials.json' })
    .then(() => {
      console.info('getEnv.js: firebase-credentials.json downloaded successfully');
    })
    .catch((e) => {
      console.error(`getEnv.js: firebase-credentials.json, There was an error: ${JSON.stringify(e, undefined, 2)}`);
    });

  // Download file
  storage.bucket(bucketName)
    .file('config.js')
    .download({ destination: 'credentials/config.js' })
    .then(() => {
      console.info('getEnv.js: config.js downloaded successfully');
    })
    .catch((e) => {
      console.error(`getEnv.js: config.js, There was an error: ${JSON.stringify(e, undefined, 2)}`);
    });
}
