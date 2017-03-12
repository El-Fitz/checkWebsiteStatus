'use strict';
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();
var request = require ( 'request' );

console.log('Loading function');

exports.handler = (event, context, callback) => {
  let website = event.company.website;
      checkStatus(website, function(err, headers, statusCode) {

        if (err || headers === null || typeof headers == 'undefined' || statusCode < 200 || (statusCode >= 400 && statusCode <= 499) || (statusCode >= 500 && statusCode <= 599)) {
          console.log("Website doesn't work");
          event.websiteIsOnline = false;
        } else {
          event.websiteIsOnline = true;
        }
        context.done(null, event);
  });
};

function checkStatus(url, done) {
  var options = {
    uri: url,
    method: "HEAD",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "User-Agent": "ElFitz AWS Lambda/1.0"
    }
  };
  request(options, function(err, data) {
    console.log("Headers: ", data.headers);
    console.log("Status Code: ", data.statusCode);
    console.log("Error: ", err);
    done(err, data.headers, data.statusCode);
  });
}
