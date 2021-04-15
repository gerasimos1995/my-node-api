const winston = require('winston');
const dotenv = require('dotenv');

dotenv.config();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV != 'PRODUCTION'){
  console.log("Not Production mode enable console logging");
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}

module.exports = logger;

