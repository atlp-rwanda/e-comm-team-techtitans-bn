const dotenv = require ('dotenv')
dotenv.config()
const express = require('express')
const app = express()
const {exec} = require ('child_process')
const CronJob = require ('cron').CronJob
const {google} = require ('googleapis')
const fs = require('fs')
const folderID = '17-AOgQ87BkboPgE6KUvveOp9nfpUfjYN'

// Read the JSON file into a JavaScript object
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

const backupDatabase = () => {
    // extract credentials from .env
    const dbName = process.env.DB_NAME;
    const dbPass = process.env.DB_PASSWORD;
    const dbHost = process.env.DB_HOST;
    const dbUser = process.env.DB_USER;
    const dbPort = process.env.DB_PORT;
    const format = "backup"; 

    const date = new Date();
    const currentDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
    const backupFilePath = `automated-backups/${dbName}-${currentDate}.${format}`;
    
    // execute node child process(exec)
    exec(`sh ./backup.sh ${dbPass} ${dbHost} ${dbUser} ${dbPort} ${dbName} ${backupFilePath}`,
      (error, stdout, stderr) => {
        if (error) {
          return console.error(`exec error: ${error}`);
        };
        if (stderr) {
          return console.error(`stderr: ${stderr}`);
        };
        //backup to google drive
          const fileMetadata = {
          name: `${dbName}-${currentDate}.${format}`,
          parents: [folderID]
        };
        const media = {
          mimeType: 'text/plain',
          body: fs.createReadStream(backupFilePath)
        };
        drive.files.create({
          resource: fileMetadata,
          media: media,
          fields: 'id'
        }, (err, file) => {
          if (err) {
            console.error(err);
           // console.log("invalid google drive credentials")
            fs.unlink(backupFilePath, (err) => {
              if (err) {
                
              } else {
                //console.log(`Local file ${backupFilePath} deleted successfully`);
              }
            });
          } else {
            console.log("Backup file uploaded to Google Drive");
            fs.unlink(backupFilePath, (err) => {
              if (err) {
                
              } else {
                //console.log(`Local file ${backupFilePath} deleted successfully`);
              }
            });
          }
        });
      }
      
      )
}
      // scheduling the backup job
      var job = new CronJob('* * * * *',
      function () {
          //console.log('-------Running cron job-------');
          backupDatabase();
      },
      null,
      true);
      
      module.exports = job;