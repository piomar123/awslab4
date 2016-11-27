var AWS = require('aws-sdk');
var uuid = require('node-uuid');
var moment = require('moment');
var simpledb = new AWS.SimpleDB();
var DBdomain = 'piotr.marcinczykDB';
var logItemPrefix = 'lab-log-';
AWS.config.loadFromPath('./config.json');

simpledb.createDomain({ DomainName: DBdomain }, function(err, data) {
	if(err) console.log(err, err.stack);
	console.log(data);
});

var afterLogFunc = function(err, logParams){
	if(err) {
		console.log(err);
		console.log(logParams);
		return;
	}
	console.log(logParams);
};

var log = function(level, message, details){
	var logParams = {
		DomainName: DBdomain,
		ItemName: logItemPrefix + uuid.v4(),
		Attributes: [
			{
				Name: 'timestamp',
				Value: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
			},
			{
				Name: 'level',
				Value: level
			},
			{
				Name: 'message',
				Value: message
			}
		]
	}
	Object.keys(details).forEach(function(key){
		logParams.Attributes.push({
			Name: key,
			Value: details[key]
		});
	});
	simpledb.putAttributes(logParams,
		function(err,data) {console.log(data); return afterLogFunc(err, logParams)});
};

var logInfo  = function(message, details){ return log('info',  message,details); };
var logWarn  = function(message, details){ return log('warn',  message,details); };
var logError = function(message, details){ return log('error', message,details); };

exports.info   	= logInfo;
exports.warning = logWarn;
exports.error   = logError;