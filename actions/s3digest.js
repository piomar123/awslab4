var AWS = require("aws-sdk");

AWS.config.loadFromPath('./config.json');

var task =  function(request, callback){
	callback(null, "File " + request.query.key + " saved in bucket " + request.query.bucket);
}

exports.action = task