const path = require('path');
const fs = require('fs');

// Get the current environment
const NODE_ENV = process.env.NODE_ENV || 'local';

// Load environment-specific configuration
let envConfig;
try {
  const envConfigPath = path.join(__dirname, 'env', `${NODE_ENV}.js`);
  if (fs.existsSync(envConfigPath)) {
    envConfig = require(envConfigPath);
  } else {
    console.warn(`Environment config file not found for ${NODE_ENV}, using local config`);
    envConfig = require('./env/local.js');
  }
} catch (error) {
  console.error(`Error loading environment config for ${NODE_ENV}:`, error);
  console.warn('Falling back to local config');
  envConfig = require('./env/local.js');
}

// Common/shared config
const commonConfig = {
  // Body Parser Configuration
  BodyParserLimit: '50mb',
  ParameterLimit: 100000,

  // Time Configuration
  MAIN_APP_TIME_OFFSET: '+05:30',
  Common_Date_Time_Format: 'YYYY-MM-DD HH:mm:ss',

  // Bcrypt salt rounds
  SALT_ROUNDS: 10,

  //
  algorithm : 'aes-256-cbc',
  ENCRYPTION_KEY : 'jayaprakashnews1234567890encrypt', // 32 characters
  ENCRYPTION_IV : 'jayaprakashnews1'                // 16 characters
  
};

module.exports = {
  NODE_ENV: envConfig.NODE_ENV,
  port: envConfig.PORT,
  MONGODB_URI: envConfig.MONGODB_URI,
  ...commonConfig
}; 