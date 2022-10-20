'use strict';
import nodemailer from 'nodemailer';
import sesTransport from 'nodemailer-ses-transport';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';
const { Magic, SDKError } = require('@magic-sdk/admin');
const mAdmin = new Magic(process.env.MAGIC_SECRET_KEY);
import AWS from 'aws-sdk';
import jwt from 'jsonwebtoken';
// import got from 'got';
import axios from 'axios'
import sharp from 'sharp';
import {
  SERVER,
  USER_TYPE,
  LANGUAGE,
  STATUS_MSG,
  COMMON_STATUS,
  MODELS_NAME,
} from '../config/AppConstraints';
import DAO from '../services/queries';
import { User, OrderCounter } from '../models';
import { createLogger, transports, format } from 'winston';
import Joi from 'joi';
/***************************************
 **** Logger for error and success *****
 ***************************************/

export const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`),
  ),
  transports: [
    new transports.File({
      filename: './logs/all-logs.log',
      json: false,
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new transports.Console(),
  ],
});

export const validateEmail = email => {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const messageLogs = (error, success) => {
  if (error) logger.error(`\x1b[31m` + error, 'messageLogsErr');
  else logger.info(`\x1b[32m` + success);
};

export const orderCounterNumber = async model => {
  try {
    let output = await DAO.findAndUpdate(
      OrderCounter,
      { type: model },
      { $inc: { count: 1 } },
      { lean: true, new: true, upsert: true },
    );
    if (output.count >= 0 && output.count < 10) {
      return '000' + output.count;
    } else if (output.count >= 10 && output.count < 100) {
      return '00' + output.count;
    } else if (output.count >= 100 && output.count < 1000) {
      return '0' + output.count;
    } else {
      return output.count;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const sendEmail = async (
  email,
  content,
  subject,
  attachmentPath = null,
) => {
  try {
    const transporter = await nodemailer.createTransport(
      sesTransport({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.SES_REGION,
      }),
    );

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: subject,
      html: content,
    };

    const sendEmai = await transporter.sendMail(mailOptions);

    if (sendEmai.error)
      console.log(sendEmai.error, 'error while sending email');

    console.log(sendEmai);

    return true;
  } catch (err) {
    console.log(err, 'sendEmailErr');
    return false;
  }
};

export const generateToken = async val => {
  return new Promise((resolve, reject) => {
    try {
      let key = process.env.JWT_SECRET;
      let token = jwt.sign(
        { data: val },
        key,
        {
          algorithm: 'HS256',
        },
        { expiresIn: '30d' },
      );
      resolve(token);
    } catch (err) {
      console.log(err, 'generateTokenErr');
      throw err;
    }
  });
};

export const createDefaultData = async () => {
  try {
    Promise.all([createPublicDirectory(), createSuperAdmin()])
      .then(res => {
        console.log('Bootstrap Successfully');
      })
      .catch(err => {
        console.log(err, 'error in bootstraping');
      });
  } catch (err) {
    console.log(err, 'createDefaultDataErr');
    return false;
  }
};

export const fileUpload = async file => {
  try {
  } catch (err) {
    console.log(err, '========');
    throw err;
  }
};

export const uploadFileBuffer = async (buffer, newName, mimeType, userId) => {
  try {
    return await uploadOriginalImage(buffer, newName, mimeType, userId);
  } catch (err) {
    console.log(err, '========');
    throw err;
  }
};

async function uploadOriginalImage(fileBuffer, fileName, mimeType, userId) {
  try {
    AWS.config.update({
      accessKeyId: process.env.ACCESS_KEY_ID,
      secretAccessKey: process.env.SECRET_ACCESS_KEY,
    });
    if (fileBuffer.length > 5242880) {
      return await uploadMultipart(
        fileBuffer,
        fileName,
        mimeType,
        fileBuffer.length,
      );
    } else {
      let s3bucket = new AWS.S3();
      let params = {
        Bucket: process.env.BUCKET_NAME,
        Key: userId + '/images/' + fileName,
        Body: fileBuffer,
        ContentType: mimeType
      };
      return await s3bucket.putObject(params).promise();
    }
  } catch (e) {
    console.log(e, 'uploadOriginalImageErr');
  }
}

async function uploadMultipart(fileBuffer, fileName, mimeType, fileSize) {
  let s3bucket = new AWS.S3(),
    paramsData = [];
  try {
    let params = {
      Bucket: process.env.BUCKET_NAME,
      Key: 'images/' + fileName,
      ContentType: mimeType,
    };

    let createMultipart = await s3bucket
      .createMultipartUpload(params)
      .promise();
    let partSize = 5242880,
      parts = Math.ceil(fileSize / partSize);
    for (let partNum = 0; partNum < parts; partNum++) {
      let rangeStart = partNum * partSize,
        end = Math.min(rangeStart + partSize, fileSize);
      let updatedBuffer = fileBuffer.slice(rangeStart, end);
      paramsData.push({
        Body: updatedBuffer,
        Bucket: process.env.BUCKET_NAME,
        Key: 'images/' + fileName,
        PartNumber: partNum + 1,
        UploadId: createMultipart.UploadId,
      });
    }
    let etagData = paramsData.map(async params => {
      let temp = await s3bucket.uploadPart(params).promise();
      return { ETag: temp.ETag, PartNumber: params.PartNumber };
    });
    let dataPacks = await Promise.all(etagData);
    return s3bucket
      .completeMultipartUpload({
        Bucket: process.env.BUCKET_NAME,
        Key: 'images/' + fileName,
        MultipartUpload: {
          Parts: dataPacks,
        },
        UploadId: createMultipart.UploadId,
      })
      .promise();
  } catch (err) {
    console.log(err, 'uploadMultipartErr');
    return err;
  }
}

const writedirAsync = (path, data) => {
  return new Promise(function (resolve, reject) {
    fs.writeFile(path, data, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
};

export const resizeImageToThumbnail = async (imagePath) => {
  try {
    // let fileBuffer = await readFile(imagePath);
    return await sharp(imagePath)
      .resize(200, 200, {
        fit: sharp.fit.inside,
        position: sharp.strategy.entropy,
      })
      .toBuffer();
  } catch (err) {
    throw err
  }
}

export const getFileBuffer = async payload => {
  try {
    return '';
  } catch (error) {
    let newPath = path.join(__dirname, '../../public/uploads/', 'default.png');
    let filePath = path.join(__dirname, '../views/assets/default.png');
    let fileBuffer = await readFile(filePath);
    await sharp(fileBuffer)
      .resize(Number(payload.height || 700), Number(payload.width || 700), {
        fit: sharp.fit.inside,
        position: sharp.strategy.entropy,
      })
      .toFile(newPath);
    return newPath;
  }
};

async function readFile(path, data) {
  return new Promise(function (resolve, reject) {
    fs.readFile(path, (err, data) => {
      err ? reject(err) : resolve(data);
    });
  });
}

async function createPublicDirectory() {
  try {
    const newPath = path.join(__dirname, `../../public/uploads`);
    let isExists = await fs.existsSync(newPath);
    if (!isExists) {
      fs.mkdir(newPath, { recursive: true }, function (err, result) {
        console.log('Created');
      });
    }
  } catch (err) {
    console.log(err);
  }
}

async function createSuperAdmin() {
  try {
    let defaultAdmin = [
      {
        name: 'ViPay Admin',
        email: 'admin@vipay.com',
        password: 'ViPay@$%123',
        image: 'default.png',
        userType: USER_TYPE.SUPER_ADMIN,
        status: COMMON_STATUS.ACTIVE,
        isProfileComplete: true,
        isPasswordUpdated: true,
        phoneNumber: '0000000000000001',
        callingCode: '+91',
        fullNumber: '+910000000000000001',
      },
    ];

    defaultAdmin.map(async (val, i) => {
      let findAdmin = await DAO.getDataOne(
        User,
        { email: val.email },
        { email: 1 },
        { lean: true },
      );
      if (!findAdmin) {
        if (val.password) {
          val.password = await bcrypt.hashSync(val.password, SERVER.SALT);
        }
        val.displayId = await orderCounterNumber(MODELS_NAME.USER);
        val.userNumber = await orderCounterNumber(MODELS_NAME.USER);
        await DAO.saveData(User, val);
      }
    });
  } catch (err) {
    console.log(err, 'createSuperAdminErrsdsadasd');
    return false;
  }
}

export const escapeRegExp = str => {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
};

export const dateTimeFormatString = date => {
  let month = new Date(date).getMonth() + 1;
  let dateValue = new Date(date).getDate();
  let year = new Date(date).getFullYear();
  if (month < 10) month = '0' + month;
  if (dateValue < 10) dateValue = '0' + dateValue;
  return month + '/' + dateValue + '/' + year;
};

export const verifyToken = async token => {
  try {
    if (token.data._id) {
      let data = await DAO.getDataOne(
        User,
        { _id: token.data._id, userType: token.data.userType },
        { password: 0 },
        { lean: true },
      );
      if (!data) throw STATUS_MSG.ERROR.INVALID_TOKEN;
      // if (data.status === COMMON_STATUS.DELETED) {
      //   await DAO.update(
      //     User,
      //     { _id: token.data._id },
      //     { $set: { loginTime: [] } },
      //     { lean: true },
      //   );
      //   return STATUS_MSG.ERROR.ACCOUNT_NO_LONGER_EXISTS;
      // }

      // if (data.status === COMMON_STATUS.INACTIVE) {
      //   await DAO.update(
      //     User,
      //     { _id: token.data._id },
      //     { $set: { loginTime: [] } },
      //     { lean: true },
      //   );
      //   return STATUS_MSG.ERROR.ACCOUNT_SUSPENDED;
      // }

      // if (data.loginTime && data.loginTime.length) {
      //   let isValid = false;
      //   for (let i = 0; i < data.loginTime.length; i++) {
      //     if (
      //       Number(data.loginTime[i].loginTime) === Number(token.data.loginTime)
      //     ) {
      //       isValid = true;
      //       break;
      //     }
      //   }
      //   if (!isValid) return STATUS_MSG.ERROR.INVALID_TOKEN;
      else {
        return { isValid: true, data: data };
      }
      // } else return STATUS_MSG.ERROR.INVALID_TOKEN;
    } else return STATUS_MSG.ERROR.INVALID_TOKEN;
  } catch (err) {
    console.log(err, '=======');
  }
};

export const authorizationHeader = Joi.object({
  authorization: Joi.string().required(),
  'accept-language': Joi.string().required().valid(LANGUAGE.EN),
}).unknown();

export const authorizationHeaderOptional = Joi.object({
  authorization: Joi.string().optional().allow(''),
  'accept-language': Joi.string().required().valid(LANGUAGE.EN),
}).unknown();

export const languageHeader = Joi.object({
  'accept-language': Joi.string().required().valid(LANGUAGE.EN),
}).unknown();

export const validateSchema = (data, schema, options) => {
  return new Promise((resolve, reject) => {
    Joi.validate(data, schema, options, (err, value) => {
      if (err) {
        reject(err);
      } else {
        resolve(value);
      }
    });
  });
};

export const currentMonthStartEnd = () => {
  try {
    let date = new Date(),
      y = date.getFullYear(),
      m = date.getMonth();
    let startDate = new Date(new Date(y, m, 1).setHours(0, 0, 0, 0));
    let endDate = new Date(new Date(y, m + 1, 0).setHours(23, 59, 59, 999));
    return { startDate, endDate };
  } catch (err) {
    console.log(err);
  }
};

export const currentDateString = () => {
  try {
    return `${new Date().getFullYear()}-${new Date().getMonth() + 1 < 10
      ? `0${new Date().getMonth() + 1}`
      : new Date().getMonth() + 1
      }-${new Date().getDate() < 10
        ? `0${new Date().getDate()}`
        : new Date().getDate()
      }`;
  } catch (err) {
    console.log(err);
  }
};

export const countryDataFinder = async ip => {
  try {
    const url = `http://ip-api.com/json/${ip}`;
    // let countryData = await got(url).json();
    let countryData = await (await axios.get(url)).data;
    if (countryData && countryData.country) {
      return countryData.country;
    } else {
      return '';
    }
  } catch (err) {
    console.log(err);
  }
};

export const paymentGatewayService = async () => {
  try {
    const url = ``;
    return url;
  } catch (err) {
    console.log(err);
  }
};

export const getMagicTokenIssuer = async (DIDToken) => {
  try {
    const issuer = mAdmin.token.getIssuer(DIDToken)
    // const issuer = await got.get(`https://api.magic.link/v1/admin/auth/user/get?issuer=${DIDToken}`, { respopnse: 'json', headers: { 'X-Magic-Secret-Key': process.env.MAGIC_SECRET_KEY }})
    // console.log(issuer)
    return mAdmin.users.getMetadataByIssuer(issuer)
  } catch (err) {
    throw err
  }
}