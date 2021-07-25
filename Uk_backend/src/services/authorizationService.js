const { STATUS_CODE } = require("../shared/constant");
const jwt = require("jsonwebtoken");
const request = require("request");
const jwkToPem = require("jwk-to-pem");
// const pem = jwkToPem(jwk.keys[1]);
const Verifier = require("verify-cognito-token");

const authorizationService = async (event) => {
  try {
    const authHeader = event.headers.Authorization;
    const token = authHeader.split(" ")[1];
    return {
      body: JSON.stringify(
        await new Promise((resolve, reject) => {
          request(
            {
              url: `https://cognito-idp.us-east-1.amazonaws.com/us-east-1_Nv92dj9JN/.well-known/jwks.json`,
              json: true,
            },
            function (error, response, body) {
              if (!error && response.statusCode === 200) {
                pems = {};
                var keys = body["keys"];
                for (var i = 0; i < keys.length; i++) {
                  //Convert each key to PEM
                  var key_id = keys[i].kid;
                  var modulus = keys[i].n;
                  var exponent = keys[i].e;
                  var key_type = keys[i].kty;
                  var jwk = { kty: key_type, n: modulus, e: exponent };
                  var pem = jwkToPem(jwk);
                  pems[key_id] = pem;
                }
                //validate the token
                var decodedJwt = jwt.decode(token, { complete: true });
                if (!decodedJwt) {
                  reject({
                    error: "Not a valid JWT token",
                  });
                  return;
                }

                var kid = decodedJwt.header.kid;
                var pem = pems[kid];
                if (!pem) {
                  reject({
                    tokenVlidationError: "Invalid token",
                  });
                  return;
                }

                jwt.verify(token, pem, function (err, payload) {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(payload);
                  }
                });
              } else {
                reject({ error: "Unable to download JWKs" });
              }
            }
          );
        })
      ),
      statusCode: STATUS_CODE.SUCCESS,
    };
  } catch (err) {
    return {
      body: JSON.stringify({
        error: "Token validation error",
      }),
      statusCode: STATUS_CODE.SERVER_ERROR,
    };
  }
};

// const authorizationService =async (event) => {
//   const authHeader = event.headers.Authorization;
//   const token = authHeader.split(" ")[1];
//   try{
//     const params = {
//       region: 'us-east-1',  // required
//       userPoolId: 'us-east-1_sI9rWGwiz', // required
//       debug: true // optional parameter to show console logs
//     }

//     const claims = {
//       aud: '2lkjm717aaenjk1gaplh9pql8t',
//       email_verified: true,
//       auth_time: time => time <= 1621326003,
//       'cognito:username': groups => groups.includes('709492fd-7ee9-4c0a-ba4a-b83f04534f34')
//     }
//   console.log("***********")
//   const verifier = new Verifier(params, claims);
//   console.log("*****123******")

//   const result = await verifier.verify(token)
//   console.log(result);

//   }catch(err){
//     print(err)
//   }

// }

module.exports = authorizationService;
