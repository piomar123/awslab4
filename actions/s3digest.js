var AWS = require("aws-sdk");
var helpers = require("../helpers.js");

AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();
var simpleLogger = require('../simpleLogger.js');

var task =  function(request, next){
	var reqParams = {
		Bucket: request.query.bucket,
		Key: request.query.key,
	};

	var showDigests = function(err, digests) {
		var logData = {
			client: request.connection.remoteAddress,
			s3bucket: reqParams.Bucket,
			s3key: reqParams.Key
		};
		digests.forEach(function(hash){
			var arr = hash.split(':');
			logData[arr[0]] = arr[1].trim();
		});
		simpleLogger.info('S3 file hash calculated', logData);

		next(null, digests.join("<br>") + "<hr>");
	};

	var calcDigests = function(err, data){
		if(err) return next(err);

		helpers.calculateMultiDigest(
			data.Body,
			['md5', 'sha1', 'sha256', 'sha512'],
			showDigests, 1);
	};

	s3.getObject(reqParams, calcDigests);
	//callback(null, "File " + request.query.key + " saved in bucket " + request.query.bucket);
}

exports.action = task