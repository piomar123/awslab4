var AWS = require("aws-sdk");
var helpers = require("../helpers.js");

AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();
var sqsURL = "https://sqs.us-west-2.amazonaws.com/983680736795/MarcinczykSQS";
var sqs = new AWS.SQS();
var simpleLogger = require('../simpleLogger.js');
var s3labMsgID = "S3labSQS";

var task =  function(request, next){
	var reqParams = {
		Bucket: request.query.bucket,
		Key: request.query.key,
	};

	var afterSendToSQS = function(err, data) {
		if(err){
			return next(err);
		}
		var logData = {
			client: request.connection.remoteAddress,
			s3bucket: reqParams.Bucket,
			s3key: reqParams.Key
		};
		// digests.forEach(function(hash){
		// 	var arr = hash.split(':');
		// 	logData[arr[0]] = arr[1].trim();
		// });
		simpleLogger.info('S3 file hash calculation requested to SQS', logData);
		next(null, "File " + request.query.key + " saved in bucket " + request.query.bucket);
	};

	var textMessage = "Request to calculate S3 file digests.";

	sqs.sendMessage(
  	{
    	MessageBody: textMessage,
      QueueUrl: sqsURL,
			MessageAttributes: {
				id: { DataType: "String", StringValue: s3labMsgID },
				s3bucket: { DataType: "String", StringValue: reqParams.Bucket },
				s3key: { DataType: "String", StringValue: reqParams.Key }
			}
    },
    afterSendToSQS
  );
	//s3.getObject(reqParams, calcDigests);
}

exports.action = task
