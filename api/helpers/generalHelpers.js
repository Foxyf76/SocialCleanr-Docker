const crypto = require('crypto');
const config = require('config');

const ENCRYPTION_KEY = config.encryptionKey;
const IV_LENGTH = 16;

/**
 * Apply async await functionality to 'forEach' loop
 * @param {array} array - Items to be itterated
 * @param {object} callback - Value(s) to be retured from forEach
 */

// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

/**
 * Encrypt text using AES-256 with random IV and secret key
 * @param {string} plaintext - Text to be encrypted
 * @return Encrypted text
 */

// https://gist.github.com/vlucas/2bd40f62d20c1d49237a109d491974eb
const encryptAES = (plaintext) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let encrypted = cipher.update(plaintext);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

/**
 * Decrypt ciphertext using secret key
 * @param {string} ciphertext - Text to be decrypted
 * @return Decrypted text
 */

const decrpytAES = async (ciphertext) => {
  let textParts = ciphertext.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedText = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(
    'aes-256-cbc',
    Buffer.from(ENCRYPTION_KEY),
    iv
  );

  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

module.exports = {
  asyncForEach,
  encryptAES,
  decrpytAES,
};
