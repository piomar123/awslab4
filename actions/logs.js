var util = require("util");
var helpers = require("../helpers");
var EJS_TEMPLATE = "logs.ejs";
var simpleLogger = require('../simpleLogger.js');

var getLogs = function(request, callback){
	simpleLogger.getLogs(function(err, data){
		callback(null, {
			template: EJS_TEMPLATE,
			params: {
				entries: data.parsed
			}
		});
	});
}

exports.action = getLogs;
