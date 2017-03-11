'use strict';
var AWS = require('aws-sdk');
AWS.config.region = 'eu-west-1';
var lambda = new AWS.Lambda();
var request = require ( 'request' )

console.log('Loading function');

exports.handler = (event, context, callback) => {
  let website = event.company.website;
  extractWebsiteDomain(website, function(err, fullDomain) {
    if (typeof fullDomain !== null && fullDomain !== null) {
      checkStatus(fullDomain, function(err, data) {
        if (err || addresses === null || typeof addresses == 'undefined' || addresses.length === 0) {
          console.log("URL didn't resolve");
          event.websiteIsOnline = false;
        } else {
          event.websiteIsOnline = true;
        }
        context.done(null, event);
      });
    } else {
      context.done(err);
    }
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
  },
  request(options, function(err, data) {
    console.log("Headers: ", data.headers);
    done(err, data);
  }
};

function extractWebsiteDomain(website, done) {
  var params = {
    FunctionName: 'extractWebsiteDomainAndTLD',
    InvocationType: 'RequestResponse',
    LogType: 'Tail',
    Payload: '{"website" : ' + JSON.stringify(website) + '}'
  };

  lambda.invoke(params, function(err, data) {
    if (err) {
      console.log("Err: ", err);
      done(err, null);
    } else {
      let info = JSON.parse(data.Payload);
      done(err, info.fullDomain);
    }
  });
}
