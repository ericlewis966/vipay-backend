import schedule from 'node-schedule';
import {exec} from 'child_process';
import fs from 'fs';
import {uploadFileBuffer} from './universalFunctions';
import path from 'path';
export const scheduler = async () => {
  try {
    schedule.scheduleJob('05 12 * * *', async () => {
      try {
        ///at 12:05  server ---- time each day
        dbAutoBackUp();
      } catch (err) {
        console.log(err, '=============errorr==========');
      }
    });
  } catch (err) {
    console.log(err);
  }
};

const dbAutoBackUp = async () => {
  try {
    if (process.env.NODE_ENV === 'production') {
      let currentDate = new Date();
      let newBackupDir = `mongodump-${currentDate.getFullYear()}-${
        currentDate.getMonth() + 1
      }-${currentDate.getDate()}`;
      let cmds = [
        `mongodump --uri='${process.env.DB_URL_LIVE}'  --out public/uploads/${newBackupDir}`,
        `zip -r public/uploads/${newBackupDir}.zip public/uploads/${newBackupDir}`,
      ]; /// do consider to install zip by using:  (sudo apt install zip -y) at server setup

      exec(cmds[0], function (error) {
        if (empty(error)) {
          exec(cmds[1], async errorNew => {
            if (empty(errorNew)) {
              const filePath = path.join(
                __dirname,
                `../../public/uploads/${newBackupDir}.zip`,
              );
              let isExists = await fs.existsSync(filePath);
              if (isExists) {
                let buffer = await fs.readFileSync(filePath);
                if (buffer) {
                  await uploadFileBuffer(
                    buffer,
                    `${newBackupDir}.zip`,
                    'application/zip',
                  );
                  fs.unlink(filePath, function () {});
                  fs.rmSync(filePath.replace('.zip', ''), {recursive: true});
                }
              }
            } else {
              console.log(errorNew, 'errorNewerrorNewerrorNew');
            }
          });
        } else {
          console.log(error, 'errorerrorerrorerrorerror');
        }
      });
    }
  } catch (err) {
    console.log(err, '=====mongodump======');
  }
};

const empty = mixedVar => {
  let undef, key, i, len;
  let emptyValues = [undef, null, false, 0, '', '0'];
  for (i = 0, len = emptyValues.length; i < len; i++) {
    if (mixedVar === emptyValues[i]) {
      return true;
    }
  }
  if (typeof mixedVar === 'object') {
    for (key in mixedVar) {
      return false;
    }
    return true;
  }
  return false;
};
