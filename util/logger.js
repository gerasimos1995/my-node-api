const { format, createLogger, transports } = require('winston');
const fs = require('fs');
const path = require('path');
const logDir = 'logs';

// Log-Levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }

// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
  }
  if (!fs.existsSync(`${logDir}/daily`)) {
    fs.mkdirSync(`${logDir}/daily`);
  }

const logFormat = format.printf((info) => {
    const { timestamp, label, level, message, ...args } = info;
    const ts = timestamp.slice(0, -1).replace('T', ' ');
    // const lvl = level.padEnd(18)
    const lbl = label ? ` [${label}]` : '';
    return `${ts} ${level}:${lbl} ${message} ${Object.keys(args).length ? JSON.stringify(args) : ''}`;
});

const Configuration = {
    File: {
        level: 'error',
        filename: path.join(logDir, 'errors.log'),
        handleExceptions: true,
        json: false,
        maxsize: 5242880, // 5MB
        maxFiles: 5,
        colorize: false,
        zippedArchive: false,
        format: format.combine(
        format.timestamp(),
        format.splat(),
        logFormat
        )
    },
    Console: {
        level: 'silly', // env === 'development' ?  : 'warn',
        handleExceptions: true,
        json: false,
        format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.splat(),
        format.label({ label: global.process.pid }),
        logFormat
        )
    }
}

const LoggerInstance = createLogger({
    transports: [
        new transports.File(Configuration.File),
        new transports.Console(Configuration.Console)
    ]
});

// // Configure custom logger
// logger.create = (name) => {
//     // Check if allready created
//     if (createdLogger.findIndex((_name) => _name === name) !== -1) {
//       return loggers.get(name);
//     }
  
//     logger.debug('Create new logger [' + name.toUpperCase().yellow + ']');
  
//     loggers.add(name, {
//       transports: [
//         new transports.Console({
//           level: /* nconf.get('log-level') || */ env === 'development' ? 'silly' : 'warn',
  
//           format: format.combine(
//             format.colorize(),
//             format.timestamp(),
//             format.splat(),
//             // format.simple(),
//             format.label({ label: global.process.pid + '] [' + name.toUpperCase().yellow }),
//             logFormat
//           )
//         }),
//         new transports.File({
//           filename: `${logDir}/${name}.log`,
//           handleExceptions: true,
//           level: 'info',
//           maxsize: 5242880, // 5MB
//           maxFiles: 5,
//           zippedArchive: false,
//           format: format.combine(
//             format.timestamp(),
//             format.splat(),
//             format.label({ label: global.process.pid + '] [' + name.toUpperCase().yellow }),
//             logFormat
//           )
//         })
//       ]
  
//     });
//     createdLogger.push(name);
//     return loggers.get(name);
//   };

module.exports = LoggerInstance;