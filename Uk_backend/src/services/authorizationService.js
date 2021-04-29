const { STATUS_CODE } = require("../shared/constant");
const jwk = require('./jwks.json');
const jwt = require('jsonwebtoken');
const request = require('request');
const jwkToPem = require('jwk-to-pem');
const pem = jwkToPem(jwk.keys[1]);

const authorizationService = async (event)=>{
    const authHeader = event.headers.Authorization
    const token = authHeader.split(' ')[1];

    return {
        body: JSON.stringify(
            await new Promise((resolve,reject)=>{
                request({
                    url: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Na6ojbUpd/.well-known/jwks.json`,
                    json: true
                }, function (error, response, body) {
                    if (!error && response.statusCode === 200) {
                        pems = {};
                        var keys = body['keys'];
                        for(var i = 0; i < keys.length; i++) {
                            //Convert each key to PEM
                            var key_id = keys[i].kid;
                            var modulus = keys[i].n;
                            var exponent = keys[i].e;
                            var key_type = keys[i].kty;
                            var jwk = { kty: key_type, n: modulus, e: exponent};
                            var pem = jwkToPem(jwk);
                            pems[key_id] = pem;
                        }
                        //validate the token
                        var decodedJwt = jwt.decode(token, {complete: true});
                        if (!decodedJwt) {
                            reject("Not a valid JWT token");
                            return;
                        }
            
                        var kid = decodedJwt.header.kid;
                        var pem = pems[kid];
                        if (!pem) {
                            reject('Invalid token')
                            return;
                        }
            
                        jwt.verify(token, pem, function(err, payload) {
                            if(err) {
                                reject(err)
                            } else {
                                resolve(payload)
                                console.log(payload);
                            }
                        });
                    } else {
                        reject("Error! Unable to download JWKs")
                    }
                });
            })
        )
    }
  
    
}

module.exports = authorizationService;