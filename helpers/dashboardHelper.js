const crypto = require('crypto');
const bcrypt = require('bcrypt');
const config = require('../config/config');
const Dashboard = require('../db/Dashboard');
const responsehelper = require('./responsehelper');
const languages = require('../db/languages');

exports.generateUsernames = (name, phone) => {
  let namePart = name.replace(/\s+/g, '').toLowerCase().slice(0, 2);
  namePart = namePart.padEnd(2, 'x');
  let phonePart = (phone || '').replace(/\D/g, '');
  phonePart = phonePart.slice(-2).padStart(2, '0');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const usernames = new Set();
  while (usernames.size < 20) {
    let randPart = '';
    for (let i = 0; i < 4; i++) {
      randPart += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    usernames.add(namePart + phonePart + randPart);
  }
  return Array.from(usernames);
};

exports.hashPassword = (password) => {
  const bcrypt = require('bcrypt');
  return bcrypt.hash(password, config.SALT_ROUNDS);
};

exports.comparePassword = (password, hash) => {
  const bcrypt = require('bcrypt');
  return bcrypt.compare(password, hash);
};

exports.encryptPassword = (plainText) => {
  const cipher = crypto.createCipheriv(config.algorithm, Buffer.from(config.ENCRYPTION_KEY), Buffer.from(config.ENCRYPTION_IV));
  let encrypted = cipher.update(plainText, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

exports.decryptPassword = (encryptedText) => {
  const decipher = crypto.createDecipheriv(config.algorithm, Buffer.from(config.ENCRYPTION_KEY), Buffer.from(config.ENCRYPTION_IV));
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

exports.generateRandomPassword = () => {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const specials = '!@#$%^&*()-_+=';
  function pick(str) {
    return str[Math.floor(Math.random() * str.length)];
  }
  let password = [
    pick(upper),
    pick(lower),
    pick(numbers),
    pick(specials)
  ];
  const all = upper + lower + numbers + specials;
  for (let i = 4; i < 8; i++) {
    password.push(pick(all));
  }
  password = password.sort(() => Math.random() - 0.5);
  return password.join('');
};

exports.validateAdminActiveSession = (dashAdminId, sessionId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = await Dashboard.findOne({ dashAdminId: dashAdminId });
      if (!admin) {
        throw { status: false, error_code: 400, message: "Invalid dashboard admin ID."};
      }
      if (!admin.isActive) {
        throw { status: false, error_code: 400, message: "Admin account is inactive."};
      }
      if (admin.sessionId !== sessionId) {
        throw { status: false, error_code: 400, message: "Invalid session. Please login again."};
      }
      resolve(admin);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.validateAdmin = (dashAdminId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const admin = await Dashboard.findOne({ dashAdminId: dashAdminId });
      if (!admin) {
        throw { status: false, error_code: 400, message: "Invalid dashboard admin ID."};
      }
      resolve(admin);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.isEmailExistsForOtherAdmin = (email, dashAdminId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {
        email,
        ...(dashAdminId?.trim() !== "" ? { dashAdminId: { $ne: dashAdminId } } : {})
      };
      const found = await Dashboard.findOne(query).collation({ locale: 'en', strength: 2 });
      if (found) {
        throw {
          status: false,
          error_code: 400,
          message: "Email already exists."
        };
      }
      resolve(true);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.isPhoneExistsForOtherAdmin = (phone, dashAdminId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const query = {
        phone,
        ...(dashAdminId?.trim() !== "" ? { dashAdminId: { $ne: dashAdminId } } : {})
      };
      const found = await Dashboard.findOne(query).collation({ locale: 'en', strength: 2 });
      if (found) {
        throw {
          status: false,
          error_code: 400,
          message:"Phone number already exists."
        };
      }
      resolve(true);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.isUsernameExists = (username) => {
  return new Promise(async (resolve, reject) => {
    try {
      const found = await Dashboard.findOne({ username }).collation({ locale: 'en', strength: 2 });
      if (!found) {
        throw { status: false, error_code: 400, message: "Username does not exist."};
      }
      resolve(found);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.validateAdminSelectedAdmin = (value) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (value.dashAdminId === value.selected_dashAdminId) {
        throw { status: false, error_code: 400, message: "Admin Selected Admin Must be Different."};
      }
      resolve(true);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

//Languages

exports.fetchlanguageID = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const min = 1000;
      const max = 1500;
      // Get all used language IDs as numbers
      const usedLanguages = await languages.find(
        { languageId: { $gte: String(min), $lte: String(max) } },
        { languageId: 1 }
      );
      const usedIds = new Set(usedLanguages.map(l => parseInt(l.languageId)));
      // Find the first available ID in the range
      let availableId = null;
      for (let i = min; i <= max; i++) {
        if (!usedIds.has(i)) {
          availableId = String(i); // Return as string
          break;
        }
      }
      if (!availableId) {
        throw new Error("No available language IDs in the range 1000-1500.");
      }
      resolve(availableId);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};


exports.validatlanguage = (languageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const language = await languages.findOne({ languageId: languageId });
      if (!language) {
        throw { status: false, error_code: 400, message: "Invalid languageId."};
      }
      resolve(language);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};

exports.isLanguageNameExist = (name, languageId) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("lang")
      const query = {
        name,
        ...(languageId?.trim() !== "" ? { languageId: { $ne: languageId } } : {})
      };
      const found = await languages.findOne(query).collation({ locale: 'en', strength: 2 });
      if (found) {
        throw {
          status: false,
          error_code: 400,
          message:"language name already exists."
        };
      }
      resolve(true);
    } catch (error) {
      reject(await responsehelper.Error_Handler(error));
    }
  });
};


