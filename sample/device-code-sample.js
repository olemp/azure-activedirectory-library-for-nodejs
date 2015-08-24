﻿/*
 * @copyright
 * Copyright © Microsoft Open Technologies, Inc.
 *
 * All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http: *www.apache.org/licenses/LICENSE-2.0
 *
 * THIS CODE IS PROVIDED *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS
 * OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION
 * ANY IMPLIED WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A
 * PARTICULAR PURPOSE, MERCHANTABILITY OR NON-INFRINGEMENT.
 *
 * See the Apache License, Version 2.0 for the specific language
 * governing permissions and limitations under the License.
 */
'use strict';

var fs = require('fs');
var adal = require('../lib/adal.js');
var async = require('async');
var url = require('url');

var AuthenticationContext = adal.AuthenticationContext;

function turnOnLogging() {
    var log = adal.Logging;
    log.setLoggingOptions(
        {
            level : log.LOGGING_LEVEL.VERBOSE,
            log : function (level, message, error) {
                console.log(message);
                if (error) {
                    console.log(error);
                }
            }
        });
}

/*
 * You can override the default account information by providing a JSON file
 * with the same parameters as the sampleParameters variable below.  Either
 * through a command line argument, 'node sample.js parameters.json', or
 * specifying in an environment variable.
 * {
 *    "tenant" : "rrandallaad1.onmicrosoft.com",
 *    "authorityHostUrl" : "https://login.windows.net",
 *    "clientId" : "624ac9bd-4c1c-4687-aec8-b56a8991cfb3",
 *    "clientSecret" : "verySecret=""
 * }
 */
var parametersFile = process.argv[2] || process.env['ADAL_SAMPLE_PARAMETERS_FILE' ];

var sampleParameters;
if (parametersFile) {
    var jsonFile = fs.readFileSync(parametersFile);
    if (jsonFile) {
        sampleParameters = JSON.parse(jsonFile);
    } else {
        console.log('File not found, falling back to defaults: ' + parametersFile);
    }
}

if (!parametersFile) {
    sampleParameters = {
        tenant : 'auxteststageauto.ccsctp.net',
        authorityHostUrl : 'https://login.windows-ppe.net',
        clientId : '04b07795-8ddb-461a-bbee-02f9e1bf7b46'
    };
}

var authorityUrl = sampleParameters.authorityHostUrl + '/' + sampleParameters.tenant;

var resource = '00000002-0000-0000-c000-000000000000';

//turnOnLogging();

var context = new AuthenticationContext(authorityUrl);

context.acquireUserCode(resource, sampleParameters.clientId, 'es-mx', function (err, response) {
    if (err) {
        console.log('well that didn\'t work: ' + err.stack);
    } else {
        console.log(response);
        console.log('calling acquire token with device code');
        context.acquireTokenWithDeviceCode(resource, sampleParameters.clientId, response, function (err, tokenResponse) {
            if (err) {
                console.log('error happens when acquiring token with device code');
                console.log(err);
            }
            else {
                console.log(tokenResponse);
            }
        });

        //setTimeout(function() {
        //   context.cancelRequestToGetTokenWithDeviceCode(response, function(err) {
        //      if (err) {
        //         console.log('error during cancelling');
        //      }
        //   });
        //}, 5000);
    }
});
