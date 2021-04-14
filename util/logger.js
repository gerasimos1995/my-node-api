const winston = require('winston');

const LoggerInstance = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: "error.log", level: 'error'}),
        new winston.transports.File({ filename: "combined.log"})
    ]
});

LoggerInstance.add(new winston.transports.Console({
    format: winston.format.simple()
}));

module.exports = LoggerInstance;