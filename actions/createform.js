var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";
var os = require("os");

var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);
	var hiddenFields = [];

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name

	policy.getConditions().push({ "x-amz-meta-uploader": os.hostname() });
	hiddenFields = s3Form.generateS3FormFields();
	hiddenFields = s3Form.addS3CredientalsFields(hiddenFields, awsConfig);

	callback(null, {template: INDEX_TEMPLATE, params:{
		fields:hiddenFields, bucket:policy.getConditionValueByKey("bucket")
	}});
}

exports.action = task;
