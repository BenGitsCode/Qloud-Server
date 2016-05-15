'use strict';

const crypto = require('crypto');
const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const randomHexString = (length) =>
  new Promise((resolve, reject) => {
    crypto.randomBytes(length, (err, buf) => {
      if (err) {
        reject(err);
      } else {
        resolve(buf.toString('hex'));
      }
    });
  });


const awsS3Upload = (file) =>
  randomHexString(16)
  .then((filename) => {
    let dir = new Date().toISOString().split('T')[0];
    return {
      ACL: 'public-read',
      Body: file.data,
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      ContentType: file.mime,
      Key: `${dir}/${filename}.${file.ext}`,
    };
  }).then(params =>
    new Promise((resolve, reject) => {
      s3.upload(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    })
  );



module.exports = awsS3Upload;
