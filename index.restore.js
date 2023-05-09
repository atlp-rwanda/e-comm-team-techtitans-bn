const dotenv = require('dotenv');
const {google} = require('googleapis');
const fs = require('fs');
const {exec} = require('child_process');
const CronJob = require ('cron').CronJob
dotenv.config();

const folderID = '17-AOgQ87BkboPgE6KUvveOp9nfpUfjYN';

const jsonContent = fs.readFileSync('./ecommerce-384907-ac1f54ca0531.json');
const keyObject = JSON.parse(jsonContent);

// Extract the private key from the object
const privateKey = keyObject.private_key;
console.log(privateKey.replace(/\\n/g, '\n'))
// create a JWT client instance
const authClient = new google.auth.JWT({
  email: 'drive-uploader@ecommerce-384907.iam.gserviceaccount.com',
  key: privateKey.replace(/\\n/g, '\n'),
  scopes: ['https://www.googleapis.com/auth/drive']
});

const drive = google.drive({ version: 'v3', auth: authClient });

const restoreDatabase = async () => {
  // Get the latest backup file from Google Drive
  const files = await drive.files.list({
    q: `name contains '${process.env.DB_NAME}' and mimeType='text/plain' and trashed = false and parents in '${folderID}'`,
    orderBy: 'createdTime desc',
    fields: 'files(id, name)',
  });

  if (!files.data.files.length) {
    console.log('No backup files found on Google Drive');
    return;
  }

  const latestBackup = files.data.files[0];
  console.log(`Restoring database from backup file: ${latestBackup.name}`);

  // Download the backup file from Google Drive
  const file = await drive.files.get({
    fileId: latestBackup.id,
    alt: 'media',
  });

    // Write the file to disk
fs.writeFileSync(`temp/${latestBackup.name}`, file.data);

  // Restore the database from the backup file
  const dbName = process.env.DB_NAME;
  const dbPass = process.env.DB_PASSWORD;
  const dbHost = process.env.DB_HOST;
  const dbUser = process.env.DB_USER;
  const dbPort = process.env.DB_PORT;
  const backupFilePath = `temp/${latestBackup.name}`;

  exec(`sh ./restore.sh ${dbPass} ${dbHost} ${dbUser} ${dbPort} ${dbName} ${backupFilePath}`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return;
    }

    console.log(`Database restored successfully: ${stdout}`);
  });
};
//scheduling restore job
// var job = new CronJob('* * * * *',
// function () {
//     console.log('-------Running cron job-------');
//     restoreDatabase();
// },
// null,
// true);

// module.exports = job;